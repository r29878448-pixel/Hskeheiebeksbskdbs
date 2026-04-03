import { SubjectSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="h-10 w-48 bg-card rounded-lg shimmer mb-8" />
      <SubjectSkeleton />
    </div>
  );
}
