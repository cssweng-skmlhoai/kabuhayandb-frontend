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
  inputProps = {},
  rules ={},
}) => (
  <FormField
    control={control}
    name={name}
    rules={rules}
    render={({ field }) => (
      <FormItem className={`relative ${className}`}>
        <FormLabel className={`text-base`}>{label}</FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              {...field}
              type={inputType}
              disabled={!isEdit}
              className={isEdit ? "pr-10" : "h-10 px-3 py-2 text-base !text-black disabled:opacity-100 rounded-md"}
              style={{ backgroundColor: "#F0EDED" }}
              {...inputProps}
            />
            {isEdit && field.value && (
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-black text-base"
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