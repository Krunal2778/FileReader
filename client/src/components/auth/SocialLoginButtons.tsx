import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";

export default function SocialLoginButtons() {
  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };
  
  const handleAppleLogin = () => {
    window.location.href = "/api/auth/apple";
  };
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button 
        variant="outline" 
        onClick={handleGoogleLogin}
        className="flex items-center justify-center dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <FcGoogle className="w-5 h-5 mr-2" />
        Google
      </Button>
      <Button 
        variant="outline" 
        onClick={handleAppleLogin}
        className="flex items-center justify-center dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <SiApple className="w-5 h-5 mr-2" />
        Apple
      </Button>
    </div>
  );
}
