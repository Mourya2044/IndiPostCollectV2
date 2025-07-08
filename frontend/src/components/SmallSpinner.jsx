import { Loader2 } from "lucide-react";

export default function SmallSpinner({ message = "Uploading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 space-y-2">
      <Loader2 className="h-6 w-6 animate-spin text-IPCaccent"/>
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
