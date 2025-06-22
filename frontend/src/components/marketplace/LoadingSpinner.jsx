import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading stamps..." }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-gray-600 text-lg">{message}</p>
            
            {/* Loading skeleton cards */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 animate-pulse">
                        <div className="bg-gray-200 aspect-square rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}