import Loader from "@/core/ui/Loader/Loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center flex-1 h-full">
      <Loader className="w-4 h-4" />
    </div>
  );
}
