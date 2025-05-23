import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import SideMenu from "@/components/layout/SideMenu";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, changePasswordSchema } from "@shared/validation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileFormValues = z.infer<typeof updateProfileSchema>;
type PasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function Settings() {
  const { user, logout, refreshUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Fetch user preferences
  const { data: preferences } = useQuery({
    queryKey: ["/api/users/preferences"],
    enabled: !!user,
  });
  
  // Form for profile update
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      location: user?.location || "chandigarh",
      visibility: user?.visibility || "public",
      profileImage: user?.profileImage || "",
    },
  });
  
  // Form for password change
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return apiRequest("PATCH", "/api/users/profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      refreshUser();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });
  
  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormValues) => {
      return apiRequest("POST", "/api/auth/change-password", data);
    },
    onSuccess: () => {
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully",
      });
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });
  
  // Categories update mutation
  const updateCategoriesMutation = useMutation({
    mutationFn: async (categories: string[]) => {
      return apiRequest("POST", "/api/users/preferences/categories", { categories });
    },
    onSuccess: () => {
      toast({
        title: "Categories updated",
        description: "Your preferred categories have been updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update categories",
        variant: "destructive",
      });
    },
  });
  
  // Notifications update mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (notificationPrefs: Record<string, boolean>) => {
      return apiRequest("POST", "/api/users/preferences/notifications", { preferences: notificationPrefs });
    },
    onSuccess: () => {
      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been updated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    },
  });
  
  const handleLogout = () => {
    logout();
    setLocation("/login");
  };
  
  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };
  
  const onPasswordSubmit = (data: PasswordFormValues) => {
    changePasswordMutation.mutate(data);
  };
  
  if (!user) {
    setLocation("/login");
    return null;
  }
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <div id="app" className="flex flex-col min-h-screen bg-neutral-100 dark:bg-gray-900">
      <Header />
      
      {/* Main content */}
      <main className="flex-1 content-area">
        <div className="container mx-auto px-4 py-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>
                
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="text-lg font-medium dark:text-white">{user.name}</h3>
                        <p className="text-neutral-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="profileImage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Profile Image URL</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
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
                                  <SelectItem value="amritsar">Amritsar</SelectItem>
                                  <SelectItem value="jalandhar">Jalandhar</SelectItem>
                                  <SelectItem value="ludhiana">Ludhiana</SelectItem>
                                  <SelectItem value="chandigarh">Chandigarh</SelectItem>
                                  <SelectItem value="gurugram">Gurugram</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
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
                        
                        <Button 
                          type="submit" 
                          disabled={updateProfileMutation.isPending}
                          className="bg-primary text-white dark:bg-primary-dark"
                        >
                          {updateProfileMutation.isPending ? "Updating..." : "Update Profile"}
                        </Button>
                      </form>
                    </Form>
                  </div>
                </TabsContent>
                
                {/* Password Tab */}
                <TabsContent value="password">
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        disabled={changePasswordMutation.isPending}
                        className="bg-primary text-white dark:bg-primary-dark"
                      >
                        {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 dark:text-white">Selected Categories</h3>
                      <p className="text-neutral-500 mb-4 dark:text-gray-400">
                        Choose categories to display on your home screen
                      </p>
                      
                      {preferences?.data?.selectedCategories ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {preferences.data.selectedCategories.map((category: string) => (
                            <div
                              key={category}
                              className="flex items-center p-3 border border-primary rounded-lg bg-primary bg-opacity-5 dark:border-primary-light dark:bg-primary-dark dark:bg-opacity-20"
                            >
                              <span className="text-sm font-medium dark:text-white">
                                {category
                                  .split("_")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 dark:text-gray-400">Loading categories...</p>
                      )}
                      
                      <Button 
                        onClick={() => setLocation("/select-categories")}
                        className="mt-4 bg-primary text-white dark:bg-primary-dark"
                      >
                        Edit Categories
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Notifications Tab */}
                <TabsContent value="notifications">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 dark:text-white">Notification Preferences</h3>
                      <p className="text-neutral-500 mb-4 dark:text-gray-400">
                        Choose which notifications you'd like to receive
                      </p>
                      
                      {preferences?.data?.notificationPreferences ? (
                        <div className="space-y-4">
                          {Object.entries(preferences.data.notificationPreferences).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                              <Label className="text-base dark:text-white">
                                {key === "all" 
                                  ? "All Notifications" 
                                  : key.charAt(0).toUpperCase() + key.slice(1)}
                              </Label>
                              <Switch checked={value} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-neutral-500 dark:text-gray-400">Loading notification preferences...</p>
                      )}
                      
                      <Button 
                        onClick={() => setLocation("/custom-notification")}
                        className="mt-4 bg-primary text-white dark:bg-primary-dark"
                      >
                        Edit Notifications
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium dark:text-white">Account Actions</h3>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <BottomNavigation />
      <SideMenu />
    </div>
  );
}
