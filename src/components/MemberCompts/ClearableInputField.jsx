import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

const ClearableInputField = ({
  control,
  name,
  label,
  isEdit,
  className,
  inputType = "text",
}) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={`relative ${className}`}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              {...field}
              type={inputType}
              disabled={!isEdit}
              className={isEdit ? "pr-10" : ""}
            />
            {isEdit && field.value && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => field.onChange("")}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default ClearableInputField;
