import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string | number | boolean;
}

interface MultiSelectSimpleProps {
  options: MultiSelectOption[];
  selected: (string | number | boolean)[];
  onChange: (selected: (string | number | boolean)[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectSimple({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectSimpleProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleOption = (value: string | number | boolean) => {
    if (disabled) return;

    if (selected.includes(value)) {
      onChange(selected.filter(item => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const handleRemoveOption = (value: string | number | boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(selected.filter(item => item !== value));
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const getSelectedLabels = () => {
    return selected.map(value => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : String(value);
    });
  };

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={cn(
          "w-full min-h-10 p-2 text-left border border-gray-300 rounded-md bg-white",
          "hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "flex items-center justify-between",
          disabled && "bg-gray-100 cursor-not-allowed opacity-50",
          "dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        )}
      >
        <div className="flex-1 flex flex-wrap gap-1 min-w-0">
          {selected.length > 0 ? (
            getSelectedLabels().map((label, index) => (
              <span
                key={selected[index]}
                className={cn(
                  "inline-flex items-center px-2 py-1 rounded text-xs",
                  "bg-blue-100 text-blue-800 border border-blue-200",
                  "dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
                )}
              >
                {label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveOption(selected[index], e)}
                    className="ml-1 hover:text-blue-600"
                    aria-label={`Remove ${label}`}
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <div className="ml-2 flex-shrink-0">
          <svg
            className={cn("w-4 h-4 transition-transform", isOpen && "transform rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={cn(
          "absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg",
          "max-h-60 overflow-auto",
          "dark:bg-gray-800 dark:border-gray-600"
        )}>
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 text-sm">No options available</div>
          ) : (
            options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() => handleToggleOption(option.value)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center",
                    "focus:outline-none focus:bg-gray-100",
                    isSelected && "bg-blue-50 text-blue-900",
                    "dark:hover:bg-gray-700 dark:focus:bg-gray-700",
                    isSelected && "dark:bg-blue-900 dark:text-blue-200"
                  )}
                >
                  <div className="mr-2 w-4 h-4 flex items-center justify-center">
                    {isSelected && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="truncate">{option.label}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
