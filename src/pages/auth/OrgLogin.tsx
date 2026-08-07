import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../api/authApi";
import { useJoinOrgMutation } from "../../api/organizationApi";
import { setCredentials } from "../../features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold capitalize">{orgSlug} Login</CardTitle>
          <CardDescription>Enter your email to sign in to the organization</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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
            {needsAccess ? (
              <Button type="button" onClick={handleRequestAccess} className="w-full" disabled={isLoading}>
                {isJoining ? "Requesting..." : "Request Access to Organization"}
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoggingIn ? "Signing in..." : "Sign in"}
              </Button>
            )}
            <div className="flex flex-col space-y-2 text-sm text-center text-slate-500">
              <div>
                Don't have an account?{" "}
                <Link to={`/register/${orgSlug}`} className="font-medium text-slate-900 hover:underline">
                  Sign up for {orgSlug}
                </Link>
              </div>
              <div>
                Go back to <Link to="/login" className="font-medium text-slate-900 hover:underline">General Login</Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
