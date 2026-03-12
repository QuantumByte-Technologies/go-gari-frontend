"use client"

import * as React from "react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"
import { cn } from "@/lib/utils"

type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        ...defaultClassNames,
        root: cn(defaultClassNames.root, "w-fit"),
        month_caption: cn(
          defaultClassNames.month_caption,
          "flex justify-center pt-1 relative items-center w-full mb-4 gap-1"
        ),
        caption_label: "hidden",
        dropdowns: "flex items-center gap-1",
        dropdown: cn(
          "h-7 rounded-md border border-input bg-background px-2 text-sm font-medium",
          "focus:outline-none focus:ring-2 focus:ring-[#65AA36] focus:border-transparent",
          "cursor-pointer"
        ),
        nav: cn(defaultClassNames.nav, "flex items-center gap-1"),
        button_previous: cn(
          defaultClassNames.button_previous,
          "absolute left-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-md border border-input flex items-center justify-center"
        ),
        button_next: cn(
          defaultClassNames.button_next,
          "absolute right-1 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-md border border-input flex items-center justify-center"
        ),
        month_grid: "w-full border-collapse",
        weekdays: cn(defaultClassNames.weekdays, "flex"),
        weekday: "text-muted-foreground w-8 font-normal text-[0.8rem] text-center",
        week: "flex w-full mt-2",
        day: "relative p-0 text-center text-sm",
        day_button: cn(
          defaultClassNames.day_button,
          "h-8 w-8 p-0 font-normal rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        ),
        selected: "bg-[#65AA36] text-white rounded-md hover:bg-[#65AA36] hover:text-white focus:bg-[#65AA36] focus:text-white",
        today: "bg-accent text-accent-foreground rounded-md",
        outside: "text-muted-foreground opacity-50",
        disabled: "text-muted-foreground opacity-50",
        range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        hidden: "invisible",
        ...classNames,
      }}
      {...props}
    />
  )
}

export { Calendar }
