import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col gap-5 p-5 max-w-7xl mx-auto w-full">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center p-5 bg-gray-100 rounded-lg h-20">
        <div className="w-36 h-10 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex gap-5">
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Hero/Banner Skeleton */}
      <div className="w-full h-96 bg-gray-200 rounded-lg animate-pulse"></div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="bg-gray-100 rounded-lg p-4 h-72">
            <div className="w-full h-40 bg-gray-200 rounded mb-3 animate-pulse"></div>
            <div className="w-3/4 h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="w-1/2 h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Footer Skeleton */}
      <div className="mt-10 pt-10 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="space-y-3">
              <div className="w-28 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-full h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-5/6 h-3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;