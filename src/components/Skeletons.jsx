import { motion } from 'framer-motion';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-xl mb-4" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="w-9 h-9 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

function SkeletonDetail() {
  return (
    <div className="flex flex-col md:flex-row gap-12 animate-pulse">
      <div className="w-full md:w-1/2 bg-gray-200 rounded-3xl aspect-square" />
      <div className="w-full md:w-1/2 space-y-4 pt-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded w-3/4" />
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-24 bg-gray-200 rounded w-full mt-6" />
        <div className="h-12 bg-gray-200 rounded-full w-full mt-8" />
      </div>
    </div>
  );
}

export { SkeletonCard, SkeletonDetail };
