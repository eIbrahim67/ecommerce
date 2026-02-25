import { Loader2 } from "lucide-react";

export const GlobalLoader = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-body">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h2 className="text-xl font-bold font-heading mb-2 text-heading">Loading...</h2>
            <p className="text-sm">Please wait while we prepare the page.</p>
        </div>
    );
};
