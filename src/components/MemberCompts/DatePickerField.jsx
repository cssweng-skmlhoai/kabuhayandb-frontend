import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const DatePickerField = ({ control, name, label, isEditing, className }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={cn("relative", className)}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          {isEditing ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center justify-between border rounded-md p-2 text-sm",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  <span>
                    {field.value
                      ? format(field.value, "MM/dd/yy")
                      : "Select date"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <div className="px-3 py-2 border rounded-md text-sm text-muted-foreground">
              {field.value ? format(field.value, "MM/dd/yy") : "—"}
            </div>
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default DatePickerField;