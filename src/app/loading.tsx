// src/app/loading.tsx
export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}