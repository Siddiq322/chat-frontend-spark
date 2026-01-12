import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-secondary/30">
      <Link 
        to="/" 
        className="flex items-center gap-2 mb-8 transition-transform hover:scale-105"
      >
        <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-medium">
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">ChatFlow</span>
      </Link>
      
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-card p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
