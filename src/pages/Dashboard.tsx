import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { MessageSquare } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="h-screen flex bg-background">
      <ChatSidebar />
      
      {/* Main content - Empty state */}
      <main className="hidden md:flex flex-1 items-center justify-center bg-secondary/20">
        <div className="text-center animate-fade-in">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Select a conversation
          </h2>
          <p className="text-muted-foreground max-w-sm">
            Choose a chat from the sidebar to start messaging or search for new contacts
          </p>
        </div>
      </main>
    </div>
  );
}
