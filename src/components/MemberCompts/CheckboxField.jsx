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
      <FormItem className="flex items-center space-x-3">
        <FormControl>
          <Checkbox
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
            disabled={!isEdit}
          />
        </FormControl>
        <FormLabel className="mb-0">{label}</FormLabel>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default CheckboxField;
