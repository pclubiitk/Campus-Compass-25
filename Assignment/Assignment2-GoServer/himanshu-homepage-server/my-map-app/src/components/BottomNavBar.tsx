import { User, BookOpen, Megaphone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BottomNavBar() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white px-4 py-2 rounded-full shadow-md flex items-center gap-4 border">
      <Button size="icon" variant="ghost" className="rounded-full">
        <User className="h-5 w-5 text-gray-600" />
      </Button>
      <Button size="icon" variant="ghost" className="rounded-full">
        <BookOpen className="h-5 w-5 text-gray-600" />
      </Button>
      <Button size="icon" variant="ghost" className="rounded-full">
        <Megaphone className="h-5 w-5 text-gray-600" />
      </Button>
      <Button size="icon" variant="ghost" className="rounded-full">
        <Share2 className="h-5 w-5 text-gray-600" />
      </Button>
      
    </div>
    
  );
}
