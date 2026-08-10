import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../api/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { AuthCard } from "../../components/auth/AuthCard";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: userData.token, user: userData.user }));
      toast.success("Successfully logged in");
      navigate("/projects");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <AuthCard title="Welcome back" description="Enter your email to sign in to your account">
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
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
            Don't have an account?{" "}
            <Typography component={Link} to="/register" variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              Sign up
            </Typography>
          </Typography>
        </Stack>
      </form>
    </AuthCard>
  );
}
