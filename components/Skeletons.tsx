import React from 'react';

export function CourseSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 p-3 md:p-8">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="aspect-video rounded-xl shimmer overflow-hidden" />
      ))}
    </div>
  );
}

export function SubjectSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 p-3 md:p-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-24 rounded-2xl shimmer" />
      ))}
    </div>
  );
}

export function LessonSkeleton() {
  return (
    <div className="space-y-2 p-3 md:p-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-16 rounded-xl shimmer" />
      ))}
    </div>
  );
}
