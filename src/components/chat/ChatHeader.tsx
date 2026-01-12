import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Button } from "@/components/ui/button";
import { MoreVertical, Phone, Video, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ChatHeaderProps {
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export function ChatHeader({ name, avatar, isOnline, lastSeen }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-card border-b shadow-soft">
      <Link
        to="/app"
        className="md:hidden p-2 -ml-2 rounded-full hover:bg-accent transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <AvatarWithStatus
        src={avatar}
        fallback={name}
        isOnline={isOnline}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <h2 className="font-semibold text-sm truncate">{name}</h2>
        <p className="text-xs text-muted-foreground">
          {isOnline ? "Online" : lastSeen ? `Last seen ${lastSeen}` : "Offline"}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
        >
          <Phone className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
