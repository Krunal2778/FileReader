import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema } from "@shared/validation";
import { z } from "zod";
import { useLocation } from "wouter";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import SocialLoginButtons from "./SocialLoginButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations } from "@shared/types";

type FormValues = z.infer<typeof registrationSchema>;

export default function SignupForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      name: "",
      phone: "",
      location: "chandigarh",
      visibility: "public",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast({
        title: "Registration successful",
        description: "Let's set up your preferences",
      });
      setLocation("/select-categories");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-muted-foreground">Enter your information to get started</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="9876543210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location.charAt(0).toUpperCase() + location.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Visibility</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </Form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted-foreground/20"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign up with
          </span>
        </div>
      </div>
      
      <SocialLoginButtons />
      
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Button 
          variant="link" 
          className="p-0 h-auto font-medium text-primary"
          onClick={() => setLocation("/login")}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
