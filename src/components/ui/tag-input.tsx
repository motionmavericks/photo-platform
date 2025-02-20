import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import { X } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"

interface TagInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[]
  maxTags?: number
  placeholder?: string
  error?: string
  disabled?: boolean
}

export function TagInput({
  value,
  onChange,
  suggestions = [],
  maxTags = 10,
  placeholder = "Add tags...",
  error,
  disabled,
  className,
  ...props
}: TagInputProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Filter suggestions based on input value and existing tags
  const filteredSuggestions = React.useMemo(() => {
    return suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(suggestion)
    )
  }, [suggestions, inputValue, value])

  // Add a tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (
      trimmedTag &&
      !value.includes(trimmedTag) &&
      value.length < maxTags
    ) {
      onChange([...value, trimmedTag])
      setInputValue("")
      setOpen(false)
    }
  }

  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove))
  }

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      <div
        className={cn(
          "flex min-h-[2.5rem] w-full flex-wrap gap-2 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
          error
            ? "border-destructive"
            : "border-input focus-within:ring-1 focus-within:ring-ring",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        {/* Existing tags */}
        {value.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm"
          >
            {tag}
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-secondary-foreground/20"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}

        {/* Tag input with suggestions */}
        {!disabled && value.length < maxTags && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setOpen(true)
                }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="h-7 w-20 border-0 p-0 focus-visible:ring-0"
              />
            </PopoverTrigger>
            {suggestions.length > 0 && (
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandInput
                    value={inputValue}
                    onValueChange={setInputValue}
                    placeholder="Search tags..."
                  />
                  <CommandEmpty>No tags found</CommandEmpty>
                  <CommandGroup>
                    {filteredSuggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        value={suggestion}
                        onSelect={() => addTag(suggestion)}
                      >
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            )}
          </Popover>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      {/* Max tags limit message */}
      {value.length >= maxTags && (
        <p className="text-xs text-muted-foreground">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  )
}
