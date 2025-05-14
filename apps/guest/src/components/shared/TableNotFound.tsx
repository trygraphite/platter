"use client"
import { AlertCircle } from "@platter/ui/lib/icons";
import { useRouter } from "next/navigation";

export default function TableNotFound({ qrId }:any) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 bg-red-50 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Table Not Found</h2>
          <p className="text-gray-600 mb-6 text-center">
            We couldn't find a table associated with this QR code. 
            The table may have been removed or the QR code might be invalid.
          </p>
          
         
          
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => router.push('/')}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Return to Home
            </button>
            <button 
              onClick={() => router.back()}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}