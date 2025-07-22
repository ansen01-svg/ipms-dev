interface CircularStatProps {
  value: number;
  color: string; // Tailwind bg color class like bg-blue-500
}

export default function CircularStat({ value, color }: CircularStatProps) {
  return (
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${color}`}
    >
      {value}
    </div>
  );
}
