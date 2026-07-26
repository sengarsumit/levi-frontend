import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../../api/authApi";
import { useJoinOrgMutation } from "../../api/organizationApi";
import { setCredentials } from "../../features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold capitalize">Join {orgSlug}</CardTitle>
          <CardDescription>Create an account to request access to this organization.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processing..." : "Request Access"}
            </Button>
            <div className="text-sm text-center text-slate-500">
              Already have an account?{" "}
              <Link to={`/login/${orgSlug}`} className="font-medium text-slate-900 hover:underline">
                Sign in to {orgSlug}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
