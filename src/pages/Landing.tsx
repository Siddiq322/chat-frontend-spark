import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle, Zap, Shield, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background via-background to-accent/20">
        <div className="text-center max-w-2xl mx-auto animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-medium">
              <MessageCircle className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-4xl font-bold text-foreground">ChatFlow</span>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Connect in Real-Time,{" "}
            <span className="text-primary">Anywhere</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Experience seamless conversations with friends and colleagues. 
            Fast, secure, and beautifully simple messaging for everyone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto px-8 rounded-full shadow-medium">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto px-8 rounded-full"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto px-4">
          <div className="text-center p-6 rounded-2xl bg-card shadow-soft animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Real-time messaging with instant delivery and notifications
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-card shadow-soft animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              End-to-end encryption keeps your conversations safe
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-card shadow-soft animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Easy to Use</h3>
            <p className="text-sm text-muted-foreground">
              Simple interface designed for seamless communication
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t bg-card">
        <p className="text-center text-sm text-muted-foreground">
          © 2026 ChatFlow. Connect with confidence.
        </p>
      </footer>
    </div>
  );
}
