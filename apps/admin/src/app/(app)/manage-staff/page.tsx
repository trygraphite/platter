
'use client';
import { HourglassLoader } from '@platter/ui/components/timeLoader';
import Link from 'next/link';


export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  text-white p-4">
      <div className="max-w-2xl w-full bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mb-4 bg-clip-text text-primary">
          Staff Management
        </h1>
        
        <div className="my-8">
          <HourglassLoader />
        </div>
        
        <h2 className="text-3xl font-semibold text-center mb-4">Coming Soon</h2>
        
        <p className="text-lg text-center text-gray-300 mb-8">
          We're working hard to bring you an amazing staff management experience. 
          This feature will be available shortly.
        </p>
        
        <Link 
          href="/" 
          className="px-6 py-3 bg-blue-500 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Return to Dashboard
        </Link>
      </div>
      
      <div className="mt-8 text-sm text-gray-400">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </div>
    </div>
  );
}