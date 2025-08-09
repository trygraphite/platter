"use client";

import { Coffee, Printer, Receipt, X } from "lucide-react";
import type React from "react";

interface PrintSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintServicePoint: () => void;
  onPrintFullOrder: () => void;
  orderNumber: string;
}

export function PrintSelectionModal({
  isOpen,
  onClose,
  onPrintServicePoint,
  onPrintFullOrder,
  orderNumber,
}: PrintSelectionModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Printer className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Print Docket Options
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-600 text-center">
            Choose what to print for Order #{orderNumber}
          </p>

          <div className="space-y-3">
            {/* Service Point Items Option */}
            <button
              type="button"
              onClick={onPrintServicePoint}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Coffee className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Service Point Items
                  </h3>
                  <p className="text-sm text-gray-600">
                    Print docket for items you can manage
                  </p>
                </div>
              </div>
            </button>

            {/* Full Order Option */}
            <button
              type="button"
              onClick={onPrintFullOrder}
              className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Receipt className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Full Order</h3>
                  <p className="text-sm text-gray-600">
                    Print complete order docket (receipt)
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
