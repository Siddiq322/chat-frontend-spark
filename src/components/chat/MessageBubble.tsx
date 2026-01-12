import { cn } from "@/lib/utils";
import { Check, CheckCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type MessageType = "text" | "image" | "gif" | "sticker";

interface MessageBubbleProps {
  content: string;
  type?: MessageType;
  isOutgoing: boolean;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  imageUrl?: string;
  messageId?: string;
  isDeleted?: boolean;
  onDelete?: (messageId: string) => void;
}

export function MessageBubble({
  content,
  type = "text",
  isOutgoing,
  timestamp,
  status,
  imageUrl,
  messageId,
  isDeleted = false,
  onDelete,
}: MessageBubbleProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    if (messageId && onDelete) {
      onDelete(messageId);
    }
    setShowDeleteDialog(false);
  };

  const renderContent = () => {
    if (isDeleted) {
      return (
        <p className="text-sm italic opacity-60">
          <Trash2 className="h-3 w-3 inline mr-1" />
          This message was deleted
        </p>
      );
    }

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
    <>
      <div
        className={cn(
          "max-w-[75%] animate-fade-in group relative",
          isOutgoing ? "ml-auto" : "mr-auto"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Delete button - only show for outgoing messages that aren't deleted */}
        {isOutgoing && !isDeleted && isHovered && onDelete && (
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full hover:bg-destructive/10 text-destructive"
            aria-label="Delete message"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}

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

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete message?</AlertDialogTitle>
            <AlertDialogDescription>
              This message will be deleted for everyone. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
