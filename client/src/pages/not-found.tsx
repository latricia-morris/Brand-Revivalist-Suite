import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto glass-card border-none">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-[#660000]" />
            <h1 className="text-2xl font-serif font-bold text-[#f7f5f5]">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-[#f7f5f5]/70 text-sm mb-6">
            The archetype you are looking for has not been discovered yet.
          </p>

          <Link href="/">
            <Button className="w-full">Return to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
