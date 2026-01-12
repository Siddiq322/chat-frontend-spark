import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarWithStatusProps {
  src?: string;
  fallback: string;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const statusSizeClasses = {
  sm: "h-2.5 w-2.5 border-[1.5px]",
  md: "h-3 w-3 border-2",
  lg: "h-3.5 w-3.5 border-2",
};

export function AvatarWithStatus({
  src,
  fallback,
  isOnline,
  size = "md",
  className,
}: AvatarWithStatusProps) {
  return (
    <div className={cn("relative", className)}>
      <Avatar className={cn(sizeClasses[size], "border-2 border-background shadow-soft")}>
        <AvatarImage src={src} alt={fallback} />
        <AvatarFallback className="bg-primary/10 text-primary font-medium">
          {fallback.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {isOnline !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-background",
            statusSizeClasses[size],
            isOnline ? "bg-online" : "bg-offline"
          )}
        />
      )}
    </div>
  );
}
