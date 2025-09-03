import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "./badge";

export interface MultiSelectOption {
  label: string;
  value: string | number | boolean;
}

interface MultiSelectDebugProps {
  options: MultiSelectOption[];
  selected: (string | number | boolean)[];
  onChange: (selected: (string | number | boolean)[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelectDebug({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectDebugProps) {
  const [open, setOpen] = React.useState(false);
  const [debugInfo, setDebugInfo] = React.useState<string>("");

  React.useEffect(() => {
    const info = {
      optionsCount: options?.length || 0,
      selectedCount: selected?.length || 0,
      optionsPreview: options?.slice(0, 3),
      selectedPreview: selected?.slice(0, 3),
      disabled,
      open,
    };
    setDebugInfo(JSON.stringify(info, null, 2));
    console.log("MultiSelect Debug Info:", info);
  }, [options, selected, disabled, open]);

  const handleUnselect = React.useCallback(
    (item: string | number | boolean) => {
      console.log("Unselecting:", item);
      const newSelected = selected.filter((i) => i !== item);
      console.log("New selected after unselect:", newSelected);
      onChange(newSelected);
    },
    [selected, onChange],
  );

  const handleSelect = React.useCallback(
    (item: string | number | boolean) => {
      console.log("Selecting:", item, "Current selected:", selected);
      if (selected.includes(item)) {
        handleUnselect(item);
      } else {
        const newSelected = [...selected, item];
        console.log("New selected after select:", newSelected);
        onChange(newSelected);
      }
    },
    [selected, onChange, handleUnselect],
  );

  const handleButtonClick = () => {
    console.log("Button clicked, current open state:", open);
    setOpen(!open);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between min-h-10 h-auto text-left font-normal",
              !selected?.length && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
            disabled={disabled}
            type="button"
            onClick={handleButtonClick}
          >
            <div className="flex gap-1 flex-wrap flex-1 min-w-0">
              {selected && selected.length > 0 ? (
                selected.map((item) => {
                  const option = options?.find((opt) => opt.value === item);
                  return option ? (
                    <Badge
                      variant="secondary"
                      key={String(item)}
                      className="mr-1 mb-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Badge clicked for:", item);
                      }}
                    >
                      {option.label}
                      <button
                        type="button"
                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.stopPropagation();
                            handleUnselect(item);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log("X button clicked for:", item);
                          handleUnselect(item);
                        }}
                        aria-label={`Remove ${option.label}`}
                      >
                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                      </button>
                    </Badge>
                  ) : (
                    <Badge key={String(item)} variant="destructive" className="mr-1 mb-1 text-xs">
                      Invalid: {String(item)}
                    </Badge>
                  );
                })
              ) : (
                <span className="text-muted-foreground truncate">
                  {placeholder}
                </span>
              )}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 z-[1000]"
          align="start"
          sideOffset={4}
        >
          <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              No item found. (Total options: {options?.length || 0})
            </CommandEmpty>
            <CommandList className="max-h-[200px]">
              <CommandGroup>
                {options?.map((option) => {
                  const isSelected = selected?.includes(option.value);
                  return (
                    <CommandItem
                      key={String(option.value)}
                      value={option.label}
                      onSelect={() => {
                        console.log("CommandItem onSelect triggered for:", option);
                        handleSelect(option.value);
                      }}
                      className={cn(
                        "cursor-pointer",
                        isSelected && "bg-accent text-accent-foreground"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <span className="truncate">{option.label}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {String(option.value)}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Debug Info */}
      <details className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded">
        <summary className="cursor-pointer font-semibold">Debug Info</summary>
        <pre className="mt-2 whitespace-pre-wrap">{debugInfo}</pre>
      </details>
    </div>
  );
}
