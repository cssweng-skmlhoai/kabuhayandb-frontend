import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const CheckboxField = ({ control, name, label, isEdit }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex flex-col items-center space-y-1 text-center">
        <FormLabel className="mb-0 text-base">{label}</FormLabel>
        <FormControl>
          <Checkbox
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
            disabled={!isEdit}
            className={
              isEdit
                ? "data-[state=checked]:bg-black data-[state=checked]:border-black"
                : "border-black text-black opacity-100"
            }
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default CheckboxField;
