import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/Header";

export default function CustomNotification() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    all: true,
    announcements: true,
    events: true,
    news: true,
    jobs: false,
    sale: false,
    property: false,
  });
  
  // Fetch existing notification preferences
  const { data: preferencesData } = useQuery({
    queryKey: ["/api/users/preferences"],
    enabled: !!user,
    onSuccess: (data) => {
      if (data?.data?.notificationPreferences) {
        setNotifications(data.data.notificationPreferences);
      }
    },
  });
  
  // Update notification preferences mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (preferences: Record<string, boolean>) => {
      return apiRequest("POST", "/api/users/preferences/notifications", { preferences });
    },
    onSuccess: () => {
      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been saved",
      });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    },
  });
  
  const toggleNotification = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  
  const handleSubmit = () => {
    updateNotificationsMutation.mutate(notifications);
  };
  
  const handleSkip = () => {
    // Use default notification settings
    updateNotificationsMutation.mutate({ all: true });
  };
  
  if (!user) {
    setLocation("/login");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-gray-900">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2 dark:text-white">Customize Notifications</h1>
              <p className="text-neutral-600 dark:text-gray-400">
                Choose which notifications you'd like to receive
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label className="text-base dark:text-white">All Notifications</Label>
                  <p className="text-sm text-neutral-500 dark:text-gray-400">Receive all notifications</p>
                </div>
                <Switch
                  checked={notifications.all}
                  onCheckedChange={() => toggleNotification("all")}
                />
              </div>
              
              <div className="border-t border-neutral-200 dark:border-gray-700"></div>
              
              <div className="flex items-center justify-between py-2">
                <Label className="text-base dark:text-white">Announcements</Label>
                <Switch
                  checked={notifications.announcements}
                  onCheckedChange={() => toggleNotification("announcements")}
                  disabled={notifications.all}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <Label className="text-base dark:text-white">Events</Label>
                <Switch
                  checked={notifications.events}
                  onCheckedChange={() => toggleNotification("events")}
                  disabled={notifications.all}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <Label className="text-base dark:text-white">News</Label>
                <Switch
                  checked={notifications.news}
                  onCheckedChange={() => toggleNotification("news")}
                  disabled={notifications.all}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <Label className="text-base dark:text-white">Jobs</Label>
                <Switch
                  checked={notifications.jobs}
                  onCheckedChange={() => toggleNotification("jobs")}
                  disabled={notifications.all}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <Label className="text-base dark:text-white">Sale</Label>
                <Switch
                  checked={notifications.sale}
                  onCheckedChange={() => toggleNotification("sale")}
                  disabled={notifications.all}
                />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <Label className="text-base dark:text-white">Property</Label>
                <Switch
                  checked={notifications.property}
                  onCheckedChange={() => toggleNotification("property")}
                  disabled={notifications.all}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <Button variant="outline" onClick={handleSkip}>
                Skip
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={updateNotificationsMutation.isPending}
                className="bg-primary text-white dark:bg-primary-dark"
              >
                {updateNotificationsMutation.isPending ? "Saving..." : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
