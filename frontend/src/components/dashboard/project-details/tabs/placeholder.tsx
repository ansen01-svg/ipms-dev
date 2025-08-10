interface PlaceholderTabProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

export default function PlaceholderTab({
  icon: Icon,
  title,
}: PlaceholderTabProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto max-w-md">
        <div className="mx-auto h-16 w-16 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
          <Icon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm">
          This section is currently under development.
        </p>
      </div>
    </div>
  );
}
