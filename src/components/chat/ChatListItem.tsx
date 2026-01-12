import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { cn } from "@/lib/utils";

interface ChatListItemProps {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export function ChatListItem({
  name,
  avatar,
  lastMessage,
  timestamp,
  unreadCount,
  isOnline,
  isActive,
  onClick,
}: ChatListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
        "hover:bg-sidebar-hover",
        isActive && "bg-sidebar-active"
      )}
    >
      <AvatarWithStatus
        src={avatar}
        fallback={name}
        isOnline={isOnline}
        size="md"
      />
      <div className="flex-1 min-w-0 text-left">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm truncate">{name}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-sm text-muted-foreground truncate">{lastMessage}</p>
          {unreadCount && unreadCount > 0 && (
            <span className="flex-shrink-0 h-5 min-w-5 px-1.5 flex items-center justify-center bg-primary text-primary-foreground text-xs font-medium rounded-full">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
