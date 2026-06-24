import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

// Controlled filter section. Props:
// - title: section title
// - name: key for this filter (e.g., 'category', 'price', 'color', 'size')
// - options: [{ value, name, color? }]
// - type: 'radio' | 'checkbox' (currently using radio)
// - selectedValue: current selected value (string|null)
// - onChange: (name, value|null) => void
const FilterSection = ({
  title,
  name,
  options,
  type = "radio",
  selectedValue,
  onChange,
}) => {
  const [open, setOpen] = useState(true);

  const handleChange = (value) => {
    if (type === "radio") {
      const newVal = selectedValue === value ? null : value; // toggle off if clicking again
      onChange && onChange(name, newVal);
    }
    // Checkbox case can be added later
  };

  return (
    <div className="mb-6 border-b border-gray-200 pb-4">
      <div
        className="flex justify-between items-center px-2 py-2 cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
        onClick={() => setOpen(!open)}
      >
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </div>

      {open && (
        <div className="mt-3 px-2 space-y-2">
          {options &&
            options.map((opt, idx) => {
              const value = opt.value ?? opt.name;
              const checked = selectedValue === value;
              return (
                <label
                  key={idx}
                  className={`flex items-center gap-2 cursor-pointer p-2 rounded-md transition-colors ${
                    checked ? "bg-pink-50" : "hover:bg-gray-50"
                  }`}
                >
                  <input
                    type={type}
                    name={name}
                    value={value}
                    checked={!!checked}
                    onChange={() => handleChange(value)}
                    className="w-4 h-4 accent-pink-600 cursor-pointer"
                  />
                  <span className="flex items-center gap-2 text-gray-700">
                    {opt.name}
                    {opt.color && (
                      <span
                        className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                        style={{ backgroundColor: opt.color }}
                      ></span>
                    )}
                  </span>
                </label>
              );
            })}
        </div>
      )}
    </div>
  );
};
export default FilterSection;
