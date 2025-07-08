import { Loader2 } from "lucide-react";

export default function SmallSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-2">
      <Loader2 className="h-6 w-6 animate-spin text-IPCaccent"/>
    </div>
  );
}
