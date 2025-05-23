import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import SignupForm from "@/components/auth/SignupForm";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  useEffect(() => {
    // Redirect to home if already logged in
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4 py-8 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center mb-6">
            <span className="material-icons text-4xl text-primary dark:text-primary-light">dashboard</span>
            <h1 className="text-2xl font-bold mt-2 dark:text-white">Notice Board</h1>
          </div>
          <SignupForm />
        </CardContent>
      </Card>
    </div>
  );
}
