"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-white p-3 [--cell-radius:12px] [--cell-size:36px] select-none",
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit bg-white rounded-[20px]", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 bg-white", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3 bg-white", defaultClassNames.month),
        nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 px-1", defaultClassNames.nav),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 p-0 select-none aria-disabled:opacity-50 rounded-[10px]",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 p-0 select-none aria-disabled:opacity-50 rounded-[10px]",
          defaultClassNames.button_next
        ),
        month_caption: cn("flex h-9 w-full items-center justify-center text-sm font-semibold text-slate-800", defaultClassNames.month_caption),
        weekdays: cn("flex w-full justify-between mt-2", defaultClassNames.weekdays),
        weekday: cn("flex h-9 w-9 items-center justify-center text-[0.8rem] font-medium text-slate-400 select-none", defaultClassNames.weekday),
        week: cn("flex w-full justify-between mt-1", defaultClassNames.week),
        day: cn("relative h-9 w-9 p-0 text-center select-none flex items-center justify-center", defaultClassNames.day),
        today: cn("bg-slate-100 text-slate-900 font-semibold rounded-[12px]", defaultClassNames.today),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn("bg-white", className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
          if (orientation === "right") return <ChevronRightIcon className={cn("size-4", className)} {...props} />
          return <ChevronDownIcon className={cn("size-4", className)} {...props} />
        },
        DayButton: (props) => <CalendarDayButton locale={locale} {...props} />,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      className={cn(
        "h-9 w-9 p-0 font-normal rounded-[12px] hover:bg-slate-100 transition-all text-slate-700",
        "data-[selected-single=true]:bg-[linear-gradient(135deg,var(--app-primary),var(--app-secondary))] data-[selected-single=true]:text-white data-[selected-single=true]:shadow-[0_8px_20px_rgba(116,82,245,0.25)]",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }