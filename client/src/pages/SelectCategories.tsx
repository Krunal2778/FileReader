import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/layout/Header";

export default function SelectCategories() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Fetch all categories
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["/api/categories"],
  });
  
  // Update user preferences mutation
  const updateCategoriesMutation = useMutation({
    mutationFn: async (categories: string[]) => {
      return apiRequest("POST", "/api/users/preferences/categories", { categories });
    },
    onSuccess: () => {
      toast({
        title: "Categories updated",
        description: "Your preferred categories have been saved",
      });
      setLocation("/custom-notification");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update categories",
        variant: "destructive",
      });
    },
  });
  
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((cat) => cat !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });
  };
  
  const handleSubmit = () => {
    if (selectedCategories.length === 0) {
      toast({
        title: "Please select at least one category",
        variant: "destructive",
      });
      return;
    }
    
    updateCategoriesMutation.mutate(selectedCategories);
  };
  
  const handleSkip = () => {
    // Select default categories
    updateCategoriesMutation.mutate(["announcement", "event", "news"]);
  };
  
  if (!user) {
    setLocation("/login");
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-gray-900">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2 dark:text-white">Select Categories</h1>
              <p className="text-neutral-600 dark:text-gray-400">
                Choose categories you're interested in to personalize your feed
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {categoriesData?.data?.map((category: any) => (
                    <button
                      key={category.id}
                      onClick={() => toggleCategory(category.name)}
                      className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
                        selectedCategories.includes(category.name)
                          ? "border-primary bg-primary bg-opacity-5 dark:border-primary-light dark:bg-primary-dark dark:bg-opacity-20"
                          : "border-neutral-200 dark:border-gray-700"
                      }`}
                    >
                      <span className={`material-icons text-2xl mb-2 ${
                        selectedCategories.includes(category.name)
                          ? "text-primary dark:text-primary-light"
                          : "text-neutral-600 dark:text-gray-400"
                      }`}>
                        {category.icon}
                      </span>
                      <span className={selectedCategories.includes(category.name) ? "font-medium dark:text-white" : "dark:text-gray-300"}>
                        {category.displayName}
                      </span>
                    </button>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button variant="outline" onClick={handleSkip}>
                    Skip
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={updateCategoriesMutation.isPending}
                    className="bg-primary text-white dark:bg-primary-dark"
                  >
                    {updateCategoriesMutation.isPending ? "Saving..." : "Continue"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
