export const CustomTick = ({
  x,
  y,
  payload,
  angle,
}: {
  x: number;
  y: number;
  payload: { value: Date };
  angle: number;
}) => {
  const formatter = new Intl.DateTimeFormat(undefined, {
    // year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    // minute: "2-digit",
  });
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform={`rotate(${angle})`}
      >
        {formatter.format(payload.value)}
      </text>
    </g>
  );
};
