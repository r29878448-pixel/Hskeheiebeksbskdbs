export default function Loading() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex-1 bg-black/50 shimmer" />
      <div className="p-8 space-y-4">
        <div className="h-8 w-1/3 bg-card rounded shimmer" />
        <div className="h-4 w-2/3 bg-card rounded shimmer" />
      </div>
    </div>
  );
}
