import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../api/authApi";
import { useJoinOrgMutation } from "../../api/organizationApi";
import { setCredentials } from "../../features/auth/authSlice";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { AuthCard } from "../../components/auth/AuthCard";
import { toast } from "sonner";

export default function OrgLogin() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [joinOrg, { isLoading: isJoining }] = useJoinOrgMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [needsAccess, setNeedsAccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password, orgSlug }).unwrap();
      dispatch(setCredentials({ token: userData.token, user: userData.user }));
      toast.success(`Successfully logged into ${orgSlug}`);
      navigate("/projects");
    } catch (err: any) {
      const msg = err?.data?.message;
      if (msg === "User is not a member of this organization") {
        setNeedsAccess(true);
        toast.info("You need to request access to this organization.");
        // We could theoretically login them in globally, but we require credentials again to join.
      } else if (msg === "User is pending approval for this organization") {
        toast.error("Your access request is still pending approval by an admin.");
      } else {
        toast.error(msg || "Login failed");
      }
    }
  };

  const handleRequestAccess = async () => {
    if (!orgSlug) return;
    try {
      // To request access, we must be logged in.
      // We will perform a general login first.
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: userData.token, user: userData.user }));

      await joinOrg(orgSlug).unwrap();
      toast.success("Access requested successfully! Please wait for approval.");
      setNeedsAccess(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to request access");
    }
  };

  const isLoading = isLoggingIn || isJoining;

  return (
    <AuthCard
      title={`${orgSlug} Login`}
      description="Enter your email to sign in to the organization"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Email"
            type="email"
            placeholder="m@example.com"
            required
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {needsAccess ? (
            <Button
              type="button"
              onClick={handleRequestAccess}
              variant="contained"
              size="large"
              fullWidth
              disabled={isLoading}
            >
              {isJoining ? "Requesting..." : "Request Access to Organization"}
            </Button>
          ) : (
            <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading}>
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </Button>
          )}

          <Stack spacing={0.5} sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Don't have an account?{" "}
              <Typography
                component={Link}
                to={`/register/${orgSlug}`}
                variant="body2"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Sign up for {orgSlug}
              </Typography>
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Go back to{" "}
              <Typography component={Link} to="/login" variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                General Login
              </Typography>
            </Typography>
          </Stack>
        </Stack>
      </form>
    </AuthCard>
  );
}
