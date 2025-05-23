import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import SelectCategories from "@/pages/SelectCategories";
import CustomNotification from "@/pages/CustomNotification";
import MyPosts from "@/pages/MyPosts";
import Settings from "@/pages/Settings";
import DetailedPost from "@/pages/DetailedPost";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ui/theme-provider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/select-categories" component={SelectCategories} />
      <Route path="/custom-notification" component={CustomNotification} />
      <Route path="/my-posts" component={MyPosts} />
      <Route path="/settings" component={Settings} />
      <Route path="/post/:id" component={DetailedPost} />
      <Route path="/auth/callback" component={() => {
        const [location, setLocation] = useLocation();
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        
        if (token) {
          localStorage.setItem('auth_token', token);
          setLocation('/');
          return <div>Authenticating...</div>;
        }
        
        return <NotFound />;
      }} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="noticeboard-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
