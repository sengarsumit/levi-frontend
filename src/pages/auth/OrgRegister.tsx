import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../../api/authApi";
import { useJoinOrgMutation } from "../../api/organizationApi";
import { setCredentials } from "../../features/auth/authSlice";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { AuthCard } from "../../components/auth/AuthCard";
import { toast } from "sonner";

export default function OrgRegister() {
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [joinOrg, { isLoading: isJoining }] = useJoinOrgMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgSlug) return;

    try {
      // 1. Create the user account
      const userData = await register({ name, email, password }).unwrap();

      // 2. Set credentials so the next request is authenticated
      dispatch(setCredentials({ token: userData.token, user: userData.user }));

      // 3. Request to join the organization
      await joinOrg(orgSlug).unwrap();

      toast.success("Account created and access requested. Please wait for an admin to approve you.");
      // We send them to the general login or a waiting page. Let's send to login.
      navigate(`/login/${orgSlug}`);
    } catch (err: any) {
      const msg = err?.data?.message || "Registration or Join failed";
      if (msg === "Email already exists") {
        toast.error("An account with this email already exists. Please use the Sign In link below to request access.");
      } else {
        toast.error(msg);
      }
    }
  };

  const isLoading = isRegistering || isJoining;

  return (
    <AuthCard
      title={`Join ${orgSlug}`}
      description="Create an account to request access to this organization."
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2.5}>
          <TextField
            label="Full Name"
            type="text"
            placeholder="John Doe"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading}>
            {isLoading ? "Processing..." : "Request Access"}
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
            Already have an account?{" "}
            <Typography
              component={Link}
              to={`/login/${orgSlug}`}
              variant="body2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Sign in to {orgSlug}
            </Typography>
          </Typography>
        </Stack>
      </form>
    </AuthCard>
  );
}
