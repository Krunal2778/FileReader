import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { locations } from "@shared/types";

interface LocationFilterProps {
  currentLocation: string;
  onLocationChange: (location: string) => void;
}

export default function LocationFilter({ currentLocation, onLocationChange }: LocationFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  
  const locationDisplayNames: Record<string, string> = {
    amritsar: "Amritsar",
    jalandhar: "Jalandhar",
    ludhiana: "Ludhiana",
    chandigarh: "Chandigarh",
    gurugram: "Gurugram",
  };
  
  const handleSelect = (location: string) => {
    setSelectedLocation(location);
  };
  
  const handleApply = () => {
    onLocationChange(selectedLocation);
    setIsOpen(false);
  };
  
  return (
    <div className="bg-white rounded-lg mb-4 p-3 flex items-center justify-between elevation-1 dark:bg-gray-800">
      <div className="flex items-center">
        <span className="material-icons text-primary mr-2 dark:text-primary-light">location_on</span>
        <span className="font-medium dark:text-white">{locationDisplayNames[currentLocation]}</span>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="text-primary dark:text-primary-light">Change</button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Location</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              {locations.map((location) => (
                <div
                  key={location}
                  className={`p-3 rounded-lg cursor-pointer border ${
                    selectedLocation === location
                      ? "border-primary bg-primary bg-opacity-5 dark:border-primary-light dark:bg-primary-dark dark:bg-opacity-20"
                      : "border-neutral-200 dark:border-gray-700"
                  }`}
                  onClick={() => handleSelect(location)}
                >
                  <div className="flex items-center">
                    <span className="material-icons text-neutral-600 mr-2 dark:text-gray-300">
                      {selectedLocation === location ? "radio_button_checked" : "radio_button_unchecked"}
                    </span>
                    <span className={selectedLocation === location ? "font-medium dark:text-white" : "dark:text-gray-300"}>
                      {locationDisplayNames[location]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={handleApply}
                className="bg-primary text-white dark:bg-primary-dark"
              >
                Apply Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
