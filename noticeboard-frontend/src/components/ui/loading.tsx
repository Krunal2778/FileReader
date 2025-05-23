import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "default" }: { size?: "default" | "large" | "small" }) {
  const sizeClass = {
    small: "h-4 w-4",
    default: "h-6 w-6",
    large: "h-10 w-10"
  }[size];

  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`animate-spin ${sizeClass}`} />
    </div>
  );
}

export function FullPageLoading() {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
      <LoadingSpinner size="large" />
    </div>
  );
}