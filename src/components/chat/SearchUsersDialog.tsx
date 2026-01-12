import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarWithStatus } from "@/components/ui/avatar-with-status";
import { Search, UserPlus, Loader2 } from "lucide-react";
import { searchUsers, sendChatRequest } from "@/services/chatApi";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  username: string;
  email: string;
  isOnline: boolean;
}

export function SearchUsersDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchUsers(searchQuery);
      console.log('Search response:', response);
      
      if (response.success) {
        // Handle both array and object with users property
        const usersData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.users || []);
        setUsers(usersData);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to search users",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to search users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string, username: string) => {
    setSendingRequest(userId);
    try {
      const response = await sendChatRequest(userId);
      if (response.success) {
        toast({
          title: "Success",
          description: `Chat request sent to ${username}`,
        });
        // Remove user from list after sending request
        setUsers(users.filter(u => u._id !== userId));
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to send request",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send request",
        variant: "destructive",
      });
    } finally {
      setSendingRequest(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search Users</DialogTitle>
          <DialogDescription>
            Search for users by username or email to start chatting
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Search"
              )}
            </Button>
          </div>

          {/* Results */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {users.length === 0 && searchQuery && !loading && (
              <p className="text-center text-sm text-muted-foreground py-8">
                No users found
              </p>
            )}
            
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AvatarWithStatus
                    fallback={user.username}
                    isOnline={user.isOnline}
                  />
                  <div>
                    <p className="font-medium text-sm">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSendRequest(user._id, user.username)}
                  disabled={sendingRequest === user._id}
                >
                  {sendingRequest === user._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
