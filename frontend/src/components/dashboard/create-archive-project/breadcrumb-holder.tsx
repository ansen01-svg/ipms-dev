export function ArchiveProjectBreadCrumbHolder() {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        {/* <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button> */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Archived Projects</span>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            Create New Archive Project
          </span>
        </div>
      </div>
    </div>
  );
}
