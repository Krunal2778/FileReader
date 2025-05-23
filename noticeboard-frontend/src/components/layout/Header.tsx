import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/ui/theme-provider";
import { LogOut, Moon, Settings, Sun, User } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const navigateToSettings = () => {
    setLocation("/settings");
  };

  return (
    <header className="bg-primary sticky top-0 z-50 elevation-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and app name */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="material-icons text-white">dashboard</span>
              <span className="text-white font-medium text-lg">Notice Board</span>
            </div>
          </Link>
          
          {/* Search bar */}
          <div className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search notices..."
                className="w-full py-2 px-4 bg-primary-light bg-opacity-20 text-white placeholder-white placeholder-opacity-70 rounded-full focus:outline-none"
              />
              <span className="material-icons absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                search
              </span>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button className="material-ripple p-2 rounded-full hover:bg-primary-light hover:bg-opacity-20">
              <span className="material-icons text-white">notifications</span>
            </button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="material-ripple flex items-center space-x-1 text-white">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      {user.profileImage ? (
                        <Avatar>
                          <AvatarImage src={user.profileImage} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                      ) : (
                        <span className="text-white text-sm font-medium">
                          {getInitials(user.name)}
                        </span>
                      )}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLocation("/my-posts")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Posts</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={navigateToSettings}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <button className="bg-white text-primary font-medium px-3 py-1 rounded-md">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
