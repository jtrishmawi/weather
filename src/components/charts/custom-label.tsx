export const CustomLabel = ({
  x,
  y,
  color,
  value,
}: {
  x: string;
  y: string;
  color: string;
  value: string;
}) => {
  return (
    <text x={x} y={y} dy={-4} fill={color} fontSize={10} textAnchor="middle">
      {value}
    </text>
  );
};
