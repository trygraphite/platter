import { Button } from "@platter/ui/components/button";
import type React from "react";
import { useState } from "react";
import { formatNaira } from "@/utils";

type VarietyWithWeight = {
  _id: string;
  name: string;
  price: number;
  outOfStock?: boolean;
  weight?: string;
  description?: string;
};

interface VarietyRadioGroupProps {
  varieties: VarietyWithWeight[];
  product: any;
  addToCart: (product: any, increment: boolean, varietyId?: string) => void;
  closeModal: () => void;
}

const VarietyRadioGroup: React.FC<VarietyRadioGroupProps> = ({
  varieties,
  product,
  addToCart,
  closeModal,
}) => {
  const availableVarieties = varieties.filter((v) => !v.outOfStock);
  const [selected, setSelected] = useState<VarietyWithWeight>(
    availableVarieties.length > 0 ? availableVarieties[0] : varieties[0],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected && !selected.outOfStock) {
      addToCart(product, true, selected._id);
      closeModal();
    }
  };

  return (
    <form className="flex flex-col gap-4 flex-1 w-full" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3 mb-6">
        {varieties.map((variety) => (
          <label
            key={variety._id}
            className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition-colors border ${
              variety.outOfStock
                ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                : selected._id === variety._id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
            }`}
          >
            <div className="flex items-center gap-2 flex-1">
              <input
                type="radio"
                name="variety"
                checked={selected._id === variety._id}
                onChange={() => !variety.outOfStock && setSelected(variety)}
                disabled={variety.outOfStock}
                className="accent-orange-500 mr-2 w-4 h-4"
              />
              <div className="flex flex-col">
                <span
                  className={`font-medium ${variety.outOfStock ? "text-gray-400" : "text-gray-900"}`}
                >
                  {variety.name}
                </span>
                {variety.weight && (
                  <span
                    className={`text-xs ${variety.outOfStock ? "text-gray-300" : "text-gray-500"}`}
                  >
                    {variety.weight}
                  </span>
                )}
                {variety.description && (
                  <span
                    className={`text-xs ${variety.outOfStock ? "text-gray-300" : "text-gray-500"}`}
                  >
                    {variety.description}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`text-lg font-bold ml-2 ${variety.outOfStock ? "text-gray-400" : "text-gray-900"}`}
              >
                {formatNaira(variety.price)}
              </span>
              {variety.outOfStock && (
                <span className="text-xs text-red-500">Out of stock</span>
              )}
            </div>
          </label>
        ))}
      </div>
      <Button
        type="submit"
        className="w-full rounded-xl py-4 text-lg font-semibold mt-auto bg-orange-500 hover:bg-orange-600 text-white"
        disabled={!selected || selected.outOfStock}
      >
        {selected?.outOfStock
          ? "Out of Stock"
          : `Add for ${formatNaira(selected?.price ?? 0)}`}
      </Button>
    </form>
  );
};

export default VarietyRadioGroup;
