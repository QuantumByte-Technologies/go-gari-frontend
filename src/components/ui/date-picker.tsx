"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  /** Currently selected date as YYYY-MM-DD string (or empty/undefined) */
  value?: string | null
  /** Called with YYYY-MM-DD string when a date is picked, or "" when cleared */
  onChange: (value: string) => void
  placeholder?: string
  /** Disable dates before this date */
  minDate?: Date
  /** Disable dates after this date */
  maxDate?: Date
  disabled?: boolean
  className?: string
  id?: string
  /**
   * Enable month/year dropdown navigation.
   * Pass fromYear + toYear to set the year range shown in the dropdown.
   * Defaults to showing dropdowns spanning ±10 years from today.
   */
  captionLayout?: "label" | "dropdown" | "dropdown-months" | "dropdown-years"
  fromYear?: number
  toYear?: number
}

/** Parse a YYYY-MM-DD string to a Date, returning undefined on invalid input */
function parseYMD(value: string | null | undefined): Date | undefined {
  if (!value) return undefined
  const d = parse(value, "yyyy-MM-dd", new Date())
  return isValid(d) ? d : undefined
}

/** Format a Date to YYYY-MM-DD string */
function toYMD(d: Date): string {
  return format(d, "yyyy-MM-dd")
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  minDate,
  maxDate,
  disabled,
  className,
  id,
  captionLayout = "dropdown",
  fromYear,
  toYear,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selected = parseYMD(value)

  const thisYear = new Date().getFullYear()
  const resolvedFromYear = fromYear ?? (maxDate ? thisYear - 100 : thisYear - 1)
  const resolvedToYear = toYear ?? (maxDate ? thisYear : thisYear + 5)

  const handleSelect = (date: Date | undefined) => {
    onChange(date ? toYMD(date) : "")
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal h-11",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          {selected ? format(selected, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          captionLayout={captionLayout}
          fromYear={resolvedFromYear}
          toYear={resolvedToYear}
          defaultMonth={selected ?? (maxDate ? maxDate : undefined)}
          disabled={(date) => {
            if (minDate && date < minDate) return true
            if (maxDate && date > maxDate) return true
            return false
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

/** Variant for booking date ranges — shows two linked pickers side by side */
interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartChange: (value: string) => void
  onEndChange: (value: string) => void
  minDate?: Date
  className?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  minDate,
  className,
}: DateRangePickerProps) {
  const parsedStart = parseYMD(startDate)

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          Start Date
        </label>
        <DatePicker
          value={startDate}
          onChange={(val) => {
            onStartChange(val)
            // If new start is after current end, clear the end
            if (val && endDate && val >= endDate) {
              onEndChange("")
            }
          }}
          minDate={minDate}
          placeholder="Select start date"
          captionLayout="dropdown"
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 3}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-500">
          End Date
        </label>
        <DatePicker
          value={endDate}
          onChange={onEndChange}
          minDate={parsedStart ?? minDate}
          placeholder="Select end date"
          disabled={!startDate}
          captionLayout="dropdown"
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 3}
        />
      </div>
    </div>
  )
}
