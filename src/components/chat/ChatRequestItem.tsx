import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ChatRequestItemProps {
  id: string;
  name: string;
  avatar?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

export function ChatRequestItem({
  name,
  avatar,
  onAccept,
  onReject,
}: ChatRequestItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50 animate-fade-in">
      <AvatarWithStatus src={avatar} fallback={name} size="sm" />
      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm truncate block">{name}</span>
        <span className="text-xs text-muted-foreground">wants to chat</span>
      </div>
      <div className="flex gap-1.5">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
          onClick={onReject}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
          onClick={onAccept}
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
