import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface Tab {
  id: string;
  label: string;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const { user } = useAuth();
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [tabWidth, setTabWidth] = useState(0);
  const [tabLeft, setTabLeft] = useState(0);
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "around-me", label: "Around Me" },
    { id: "announcements", label: "Announcements" },
    { id: "events", label: "Events" },
    { id: "news", label: "News" },
    { id: "jobs", label: "Jobs" },
    { id: "sale", label: "Sale" },
  ]);
  
  // Get user preferences if logged in
  const { data: userPreferences } = useQuery({
    queryKey: ["/api/users/preferences"],
    enabled: !!user,
  });
  
  useEffect(() => {
    // Update tabs based on user preferences
    if (userPreferences?.data?.selectedCategories) {
      const defaultTabs = [{ id: "around-me", label: "Around Me" }];
      
      const prefTabs = userPreferences.data.selectedCategories.map((category: string) => {
        const displayName = category
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        
        return {
          id: category,
          label: displayName,
        };
      });
      
      setTabs([...defaultTabs, ...prefTabs]);
    }
  }, [userPreferences]);
  
  useEffect(() => {
    // Update indicator position
    const tabElements = tabsContainerRef.current?.querySelectorAll('[data-tab]');
    if (tabElements) {
      const activeTabElement = Array.from(tabElements).find(
        (tab) => tab.getAttribute('data-tab') === activeTab
      ) as HTMLElement;
      
      if (activeTabElement) {
        setTabWidth(activeTabElement.offsetWidth);
        setTabLeft(activeTabElement.offsetLeft);
      }
    }
  }, [activeTab, tabs]);
  
  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };
  
  return (
    <div className="bg-white rounded-lg mb-4 elevation-1 overflow-hidden dark:bg-gray-800">
      <div className="relative border-b border-neutral-200 dark:border-gray-700">
        <div className="flex overflow-x-auto hide-scrollbar" ref={tabsContainerRef}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-3 ${
                activeTab === tab.id
                  ? "text-primary font-medium dark:text-primary-light"
                  : "text-neutral-600 font-medium dark:text-gray-300"
              } whitespace-nowrap`}
              data-tab={tab.id}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Tab indicator */}
        <div
          className="tab-indicator"
          style={{
            width: `${tabWidth}px`,
            left: `${tabLeft}px`,
          }}
        ></div>
      </div>
    </div>
  );
}
