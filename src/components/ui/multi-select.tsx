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

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: (string | number | boolean)[];
  onChange: (selected: (string | number | boolean)[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = React.useCallback(
    (item: string | number | boolean) => {
      onChange(selected.filter((i) => i !== item));
    },
    [selected, onChange],
  );

  const handleSelect = React.useCallback(
    (item: string | number | boolean) => {
      if (selected.includes(item)) {
        handleUnselect(item);
      } else {
        onChange([...selected, item]);
      }
    },
    [selected, onChange, handleUnselect],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-10 h-auto text-left font-normal multiselect-trigger",
            !selected.length && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          disabled={disabled}
          type="button"
          data-placeholder={!selected.length}
        >
          <div className="flex gap-1 flex-wrap flex-1 min-w-0">
            {selected.length > 0 ? (
              selected.map((item) => {
                const option = options.find((opt) => opt.value === item);
                return option ? (
                  <Badge
                    variant="secondary"
                    key={String(item)}
                    className="mr-1 mb-1 text-xs multiselect-badge"
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
                        handleUnselect(item);
                      }}
                      aria-label={`Remove ${option.label}`}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ) : null;
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
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
        sideOffset={4}
        style={{ zIndex: 1000 }}
      >
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            No item found.
          </CommandEmpty>
          <CommandList className="max-h-[200px]">
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={String(option.value)}
                  value={option.label}
                  onSelect={() => {
                    handleSelect(option.value);
                  }}
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onMouseDown={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
