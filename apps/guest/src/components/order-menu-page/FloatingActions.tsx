import { Button } from "@platter/ui/components/button";
import { Bell } from "@platter/ui/lib/icons";
import type React from "react";
import { useState } from "react";

interface FloatingActionsProps {
  callWaiter: () => void;
  requestBill: () => void;
  cart: unknown[];
}

const FloatingActions: React.FC<FloatingActionsProps> = ({
  callWaiter,
  requestBill,
  cart,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBellShaking, setIsBellShaking] = useState(false);

  const toggleExpanded = () => {
    if (!isExpanded) {
      setIsBellShaking(true);
      setIsExpanded(true);
      setTimeout(() => setIsBellShaking(false), 600);
    } else {
      setIsExpanded(false);
    }
  };

  const handleActionClick = (action: () => void) => {
    action();
    setIsExpanded(false);
  };

  return (
    <>
      {/* Animated Background Overlay */}
      <div
        className={`fixed inset-0 transition-all duration-500 ease-out z-30 ${
          isExpanded
            ? "bg-black/30 backdrop-blur-sm opacity-100 pointer-events-auto"
            : "bg-transparent backdrop-blur-none opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsExpanded(false)}
      />

      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end space-y-3">
        {/* Expanded Action Buttons */}
        <div
          className={`flex flex-col items-end space-y-3 transition-all duration-300 ${
            isExpanded
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-4 pointer-events-none"
          }`}
        >
          <Button
            size="lg"
            className={`rounded-full bg-green-600 hover:bg-green-700 shadow-lg transition-all duration-300 text-white font-semibold min-w-max px-6 py-3 transform ${
              isExpanded
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-8 opacity-0 scale-95"
            }`}
            style={{
              transitionDelay: isExpanded ? "0.1s" : "0s",
            }}
            onClick={() => handleActionClick(callWaiter)}
            title="Call Waiter"
          >
            🍽️ Request a waiter
          </Button>

          <Button
            size="lg"
            className={`rounded-full bg-orange-600 hover:bg-orange-700 shadow-lg transition-all duration-300 text-white font-semibold min-w-max px-6 py-3 transform ${
              isExpanded
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-8 opacity-0 scale-95"
            }`}
            style={{
              transitionDelay: isExpanded ? "0.2s" : "0s",
            }}
            onClick={() => handleActionClick(requestBill)}
            disabled={!cart.length}
            title="Request Bill"
          >
            💰 Request a bill
          </Button>
        </div>

        {/* Main Bell Button */}
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-blue-600 hover:bg-blue-700 shadow-xl transition-colors duration-300 text-white"
          onClick={toggleExpanded}
          title={isExpanded ? "Close Actions" : "Open Actions"}
        >
          <Bell
            className={`w-7 h-7 ${isBellShaking ? "animate-bell-shake" : ""}`}
          />
        </Button>
      </div>

      <style jsx>{`
        @keyframes bell-shake {
          0%, 100% { 
            transform: rotate(0deg) scale(1); 
          }
          10% { 
            transform: rotate(-15deg) scale(1.1); 
          }
          20% { 
            transform: rotate(15deg) scale(1.1); 
          }
          30% { 
            transform: rotate(-12deg) scale(1.08); 
          }
          40% { 
            transform: rotate(12deg) scale(1.08); 
          }
          50% { 
            transform: rotate(-8deg) scale(1.05); 
          }
          60% { 
            transform: rotate(8deg) scale(1.05); 
          }
          70% { 
            transform: rotate(-4deg) scale(1.02); 
          }
          80% { 
            transform: rotate(4deg) scale(1.02); 
          }
          90% { 
            transform: rotate(-1deg) scale(1.01); 
          }
        }
        
        .animate-bell-shake {
          animation: bell-shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
        
        /* Enhanced backdrop blur for better visibility */
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }
        
        /* Enhanced shadow */
        .shadow-xl {
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </>
  );
};

export default FloatingActions;
