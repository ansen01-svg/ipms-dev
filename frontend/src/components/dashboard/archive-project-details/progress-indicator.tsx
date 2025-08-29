interface ProgressIndicatorProps {
  current: number;
  target: number;
  className?: string;
}

export function ProgressIndicator({
  current,
  target,
  className = "",
}: ProgressIndicatorProps) {
  const difference = target - current;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Current: {current}%</span>
        <span className="text-gray-600">Target: {target}%</span>
      </div>

      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${current}%` }}
          />
        </div>

        {/* Show target position if different from current */}
        {difference !== 0 && (
          <div
            className={`absolute top-0 h-3 w-1 ${
              isIncrease ? "bg-green-500" : "bg-orange-500"
            } transition-all duration-500`}
            style={{ left: `${Math.min(target, 100)}%` }}
          />
        )}
      </div>

      {difference !== 0 && (
        <div
          className={`text-xs ${
            isIncrease
              ? "text-green-600"
              : isDecrease
              ? "text-orange-600"
              : "text-gray-600"
          }`}
        >
          {isIncrease ? "+" : ""}
          {difference.toFixed(1)}% change
        </div>
      )}
    </div>
  );
}
