import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ClearableSelectField = ({
  control,
  name,
  label,
  isEdit,
  className,
  options = [],
  rules = {},
}) => (
  <FormField
    control={control}
    name={name}
    rules={rules}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel className={`text-base`}>{label}</FormLabel>
        <FormControl>
          {isEdit ? (
            <div className="relative">
              <Select onValueChange={field.onChange} value={field.value || ""}>
                <SelectTrigger className="h-10 w-full rounded-md border border-input bg-[#F0EDED] px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="h-10 w-full rounded-md border px-3 py-2 text-base !text-black bg-[#F0EDED] flex items-center disabled:opacity-100">
              {field.value || "—"}
            </div>
          )}
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default ClearableSelectField;