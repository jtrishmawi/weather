import { TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

export const CustomTooltip = ({
  active,
  payload,
  label,
  units,
}: {
  units: string;
} & TooltipProps<ValueType, NameType>) => {
  console.log(payload);
  if (active && payload && payload.length) {
    const formatter = new Intl.DateTimeFormat(undefined, {
      // year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <div className="rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
        <p className="label">{`${formatter.format(new Date(label))} : ${
          payload[0].value
        }${units}`}</p>
      </div>
    );
  }

  return null;
};
