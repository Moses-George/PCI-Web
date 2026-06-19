/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import type {
  UseFieldArrayRemove,
  UseFieldArrayAppend,
  FieldErrors,
} from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
// import { DistressInput } from '../../types';

interface DistressDynamicInputProps {
  fields: Record<"id", string>[];
  append: UseFieldArrayAppend<any, "distressInputs">;
  remove: UseFieldArrayRemove;
  register: any;
  errors: FieldErrors;
  control: any;
  //   control: Control<any>;
}

const DistressDynamicInput: React.FC<DistressDynamicInputProps> = ({
  fields,
  append,
  remove,
  register,
  //   errors,
}) => {
  const distressTypes = [
    "Alligator",
    "Longitudinal",
    "Transverse",
    "Pothole",
    "Rutting",
    "Weathering",
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-gray-700">
          Distress Inputs (n fields)
        </label>
        <button
          type="button"
          onClick={() =>
            append({ distressType: "", severity: "L", quantity: 0 })
          }
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlus /> Add Distress
        </button>
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-lg border border-gray-200"
          >
            {/* Distress Type */}
            <div className="col-span-4">
              <select
                {...register(`distressInputs.${index}.distressType`, {
                  required: "Type is required",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Type</option>
                {distressTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {/* {errors?.distressInputs?.[index]?.distressType && (
                <p className="text-red-500 text-xs mt-1">{errors.distressInputs[index]?.distressType?.message}</p>
              )} */}
            </div>

            {/* Severity */}
            <div className="col-span-3">
              <select
                {...register(`distressInputs.${index}.severity`)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="L">Low (L)</option>
                <option value="M">Medium (M)</option>
                <option value="H">High (H)</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="col-span-3">
              <input
                type="number"
                step="0.01"
                {...register(`distressInputs.${index}.quantity`, {
                  required: "Qty required",
                  min: 0,
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Qty (m² or count)"
              />
              {/* {errors?.distressInputs?.[index]?.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.distressInputs[index]?.quantity?.message}</p>
              )} */}
            </div>

            {/* Remove Button */}
            <div className="col-span-2 flex justify-end">
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-800 p-1.5 rounded-full hover:bg-red-50 transition-colors"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 text-sm">
          No distress inputs added. Click "Add Distress" to define manual
          inspections.
        </div>
      )}
    </div>
  );
};

export default DistressDynamicInput;
