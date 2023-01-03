import Loader from "@/core/ui/Loader/Loader";

export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <Loader className="w-4 h-4" />
    </div>
  );
}
