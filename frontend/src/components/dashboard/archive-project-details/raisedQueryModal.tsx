import { getAuthToken } from "@/lib/rbac-config.ts/auth-local";
import { Send, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface RaisedQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSubmitSuccess?: () => void;
}

interface QueryFormData {
  queryTitle: string;
  queryDescription: string;
  queryCategory: string;
  priority: string;
  expectedResolutionDate: string;
  assignedTo: string;
}

const QUERY_CATEGORIES = [
  "Technical",
  "Financial",
  "Administrative",
  "Legal",
  "Compliance",
  "Design",
  "Material",
  "Safety",
  "Environmental",
  "Other",
];

const PRIORITIES = [
  { value: "Low", label: "Low", color: "bg-green-100 text-green-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High", color: "bg-orange-100 text-orange-800" },
  { value: "Urgent", label: "Urgent", color: "bg-red-100 text-red-800" },
];

function RaisedQueryModal({
  isOpen,
  onClose,
  projectId,
  onSubmitSuccess,
}: RaisedQueryModalProps) {
  const [formData, setFormData] = useState<QueryFormData>({
    queryTitle: "",
    queryDescription: "",
    queryCategory: "",
    priority: "Medium",
    expectedResolutionDate: "",
    assignedTo: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<QueryFormData>>({});

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof QueryFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<QueryFormData> = {};

    if (!formData.queryTitle.trim()) {
      newErrors.queryTitle = "Query title is required";
    } else if (formData.queryTitle.trim().length < 5) {
      newErrors.queryTitle = "Query title must be at least 5 characters";
    } else if (formData.queryTitle.trim().length > 200) {
      newErrors.queryTitle = "Query title cannot exceed 200 characters";
    }

    if (!formData.queryDescription.trim()) {
      newErrors.queryDescription = "Query description is required";
    } else if (formData.queryDescription.trim().length < 20) {
      newErrors.queryDescription =
        "Query description must be at least 20 characters";
    } else if (formData.queryDescription.trim().length > 2000) {
      newErrors.queryDescription =
        "Query description cannot exceed 2000 characters";
    }

    if (!formData.queryCategory) {
      newErrors.queryCategory = "Query category is required";
    }

    if (!formData.expectedResolutionDate) {
      newErrors.expectedResolutionDate = "Expected resolution date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const token = getAuthToken();

    try {
      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_PROD_API_URL}/archive-project/${projectId}/queries`,
        `${process.env.NEXT_PUBLIC_DEV_API_URL}/archive-project/${projectId}/queries`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adjust based on your auth implementation
          },
          body: JSON.stringify({
            queryTitle: formData.queryTitle.trim(),
            queryDescription: formData.queryDescription.trim(),
            queryCategory: formData.queryCategory,
            priority: formData.priority,
            expectedResolutionDate: formData.expectedResolutionDate,
            assignedTo: formData.assignedTo.trim() || undefined,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Success notification could be added here
        toast.success("Query raised successfully!");

        // Reset form
        setFormData({
          queryTitle: "",
          queryDescription: "",
          queryCategory: "",
          priority: "Medium",
          expectedResolutionDate: "",
          assignedTo: "",
        });

        onSubmitSuccess?.();
        onClose();
      } else {
        // Handle API errors
        alert(result.message || "Failed to raise query. Please try again.");
      }
    } catch (error) {
      console.error("Error raising query:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        queryTitle: "",
        queryDescription: "",
        queryCategory: "",
        priority: "Medium",
        expectedResolutionDate: "",
        assignedTo: "",
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-blue-600 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-semibold text-white">Raise Query</h2>
              <p className="text-sm text-white">
                Submit a new query for this project
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Query Title */}
          <div>
            <label
              htmlFor="queryTitle"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Query Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="queryTitle"
              name="queryTitle"
              value={formData.queryTitle}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title for your query"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                errors.queryTitle
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              maxLength={200}
              disabled={isLoading}
            />
            {errors.queryTitle && (
              <p className="mt-1 text-sm text-red-600">{errors.queryTitle}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.queryTitle.length}/200 characters
            </p>
          </div>

          {/* Query Category and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="queryCategory"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="queryCategory"
                name="queryCategory"
                value={formData.queryCategory}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.queryCategory
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                disabled={isLoading}
              >
                <option value="">Select category</option>
                {QUERY_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.queryCategory && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.queryCategory}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                disabled={isLoading}
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Query Description */}
          <div>
            <label
              htmlFor="queryDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Query Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="queryDescription"
              name="queryDescription"
              value={formData.queryDescription}
              onChange={handleInputChange}
              rows={5}
              placeholder="Provide detailed description of your query..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y ${
                errors.queryDescription
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300"
              }`}
              maxLength={2000}
              disabled={isLoading}
            />
            {errors.queryDescription && (
              <p className="mt-1 text-sm text-red-600">
                {errors.queryDescription}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {formData.queryDescription.length}/2000 characters (minimum 20
              required)
            </p>
          </div>

          {/* Expected Resolution Date and Assigned To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expectedResolutionDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Expected Resolution Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="expectedResolutionDate"
                name="expectedResolutionDate"
                value={formData.expectedResolutionDate}
                onChange={handleInputChange}
                min={minDate}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
                  errors.expectedResolutionDate
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.expectedResolutionDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.expectedResolutionDate}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="assignedTo"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Assign To (Optional)
              </label>
              <input
                type="text"
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleInputChange}
                placeholder="Enter name or leave blank"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Current Priority Badge */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Selected Priority:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                PRIORITIES.find((p) => p.value === formData.priority)?.color ||
                "bg-gray-100 text-gray-800"
              }`}
            >
              {formData.priority}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Raising Query...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Raise Query</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RaisedQueryModal;
