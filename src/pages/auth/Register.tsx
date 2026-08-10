import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../../api/authApi";
import { setCredentials } from "../../features/auth/authSlice";
import { Stack, TextField, Button, Typography } from "@mui/material";
import { AuthCard } from "../../components/auth/AuthCard";
import { toast } from "sonner";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ token: userData.token, user: userData.user }));
      toast.success("Account created successfully");
      navigate("/projects");
    } catch (err: any) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <AuthCard title="Create an account" description="Enter your details below to create your account">
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
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
            Already have an account?{" "}
            <Typography component={Link} to="/login" variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
              Sign in
            </Typography>
          </Typography>
        </Stack>
      </form>
    </AuthCard>
  );
}
