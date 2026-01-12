import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

type MessageType = "text" | "image" | "gif" | "sticker";

interface MessageBubbleProps {
  content: string;
  type?: MessageType;
  isOutgoing: boolean;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  imageUrl?: string;
}

export function MessageBubble({
  content,
  type = "text",
  isOutgoing,
  timestamp,
  status,
  imageUrl,
}: MessageBubbleProps) {
  const renderContent = () => {
    switch (type) {
      case "image":
        return (
          <div className="space-y-2">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Shared image"
              className="max-w-[240px] rounded-lg object-cover"
            />
            {content && <p className="text-sm">{content}</p>}
          </div>
        );
      case "gif":
        return (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="GIF"
            className="max-w-[200px] rounded-lg"
          />
        );
      case "sticker":
        return (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt="Sticker"
            className="w-24 h-24 object-contain"
          />
        );
      default:
        return <p className="text-sm leading-relaxed">{content}</p>;
    }
  };

  const renderStatus = () => {
    if (!isOutgoing || !status) return null;
    
    return (
      <span className={cn(
        "ml-1",
        status === "read" ? "text-primary-foreground/80" : "text-primary-foreground/60"
      )}>
        {status === "sent" && <Check className="h-3 w-3" />}
        {(status === "delivered" || status === "read") && (
          <CheckCheck className={cn("h-3 w-3", status === "read" && "text-sky-200")} />
        )}
      </span>
    );
  };

  return (
    <div
      className={cn(
        "max-w-[75%] animate-fade-in",
        isOutgoing ? "ml-auto" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "px-4 py-2.5 shadow-soft",
          isOutgoing
            ? "bg-message-outgoing text-message-outgoing-foreground rounded-2xl rounded-br-md"
            : "bg-message-incoming text-message-incoming-foreground rounded-2xl rounded-bl-md"
        )}
      >
        {renderContent()}
        <div className={cn(
          "flex items-center justify-end gap-1 mt-1",
          isOutgoing ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          <span className="text-[10px]">{timestamp}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
