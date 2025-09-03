import * as React from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
  label: string;
  value: string | number | boolean;
}

interface MultiSelectFinalProps {
  options: MultiSelectOption[];
  selected: (string | number | boolean)[];
  onChange: (selected: (string | number | boolean)[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectFinal({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectFinalProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleToggleOption = React.useCallback(
    (value: string | number | boolean) => {
      if (disabled) return;

      const newSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];

      onChange(newSelected);
      console.log(
        "MultiSelect option toggled:",
        value,
        "New selection:",
        newSelected,
      );
    },
    [selected, onChange, disabled],
  );

  const handleRemoveOption = React.useCallback(
    (value: string | number | boolean, event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (disabled) return;

      const newSelected = selected.filter((item) => item !== value);
      onChange(newSelected);
      console.log(
        "MultiSelect option removed:",
        value,
        "New selection:",
        newSelected,
      );
    },
    [selected, onChange, disabled],
  );

  const toggleDropdown = React.useCallback(() => {
    if (disabled) return;

    console.log("MultiSelect dropdown toggled, was open:", isOpen);
    setIsOpen(!isOpen);
    setSearchTerm("");
  }, [isOpen, disabled]);

  const getSelectedLabels = React.useCallback(() => {
    return selected.map((value) => {
      const option = options.find((opt) => opt.value === value);
      return { value, label: option ? option.label : String(value) };
    });
  }, [selected, options]);

  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [options, searchTerm]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!isOpen) {
        toggleDropdown();
      }
    }
  };

  return (
    <div
      className={cn("relative w-full", className)}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleDropdown();
          }
        }}
        className={cn(
          "w-full min-h-[2.5rem] p-3 text-left border rounded-md bg-background cursor-pointer",
          "border-border hover:border-border/80 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
          "flex items-center justify-between gap-2",
          disabled && "opacity-50 cursor-not-allowed bg-muted",
          isOpen && "ring-2 ring-ring border-transparent",
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={placeholder}
      >
        <div className="flex-1 flex flex-wrap gap-1 min-w-0">
          {selected.length > 0 ? (
            getSelectedLabels().map(({ value, label }) => (
              <span
                key={String(value)}
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md",
                  "bg-secondary text-secondary-foreground",
                  "border border-secondary/20",
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <span className="max-w-[150px] truncate">{label}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => handleRemoveOption(value, e)}
                    className={cn(
                      "flex-shrink-0 ml-1 rounded-sm opacity-70 hover:opacity-100",
                      "hover:bg-secondary-foreground/20 focus:outline-none focus:ring-1 focus:ring-ring",
                    )}
                    aria-label={`Remove ${label}`}
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground truncate text-sm">
              {placeholder}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform flex-shrink-0",
            isOpen && "rotate-180",
          )}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-full left-0 right-0 z-[9999] mt-1",
            "bg-popover border border-border rounded-md shadow-md",
            "max-h-[300px] overflow-hidden",
          )}
          style={{
            position: "absolute",
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          {/* Search Input */}
          <div className="p-2 border-b border-border">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full px-3 py-2 text-sm bg-background border border-border rounded-sm",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              )}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="max-h-[200px] overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                {searchTerm ? "No options found" : "No options available"}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <div
                    key={String(option.value)}
                    role="option"
                    aria-selected={isSelected}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleToggleOption(option.value);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left cursor-pointer rounded-sm",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      "flex items-center gap-2 transition-colors",
                      isSelected &&
                        "bg-accent/50 text-accent-foreground font-medium",
                    )}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleToggleOption(option.value);
                      }
                    }}
                  >
                    <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                      {isSelected && (
                        <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
                          <svg
                            className="w-2 h-2 text-primary-foreground"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="truncate flex-1">{option.label}</span>
                    {/* Show value for debugging */}
                    <span className="text-xs opacity-50 flex-shrink-0">
                      {String(option.value)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
