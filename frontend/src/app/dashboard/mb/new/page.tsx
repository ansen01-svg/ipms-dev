"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { getAuthToken } from "@/lib/rbac-config.ts/auth-local";
import {
  ArrowLeft,
  Calculator,
  File,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Measurement {
  id: number;
  description: string;
  no: number;
  length: number;
  width: number;
  height: number;
  total: number;
}

interface WorkItem {
  id: number;
  description: string;
  unit: string;
  measurements: Measurement[];
  totalQuantity: number;
  uploadedFile: File | null;
}

interface MBFormData {
  projectId: string;
  description: string;
  remarks: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

const CreateMBPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data for the main MB
  const [mbFormData, setMBFormData] = useState<MBFormData>({
    projectId: "",
    description: "",
    remarks: "",
  });

  // Work items for measurement calculations (display only)
  const [workItems, setWorkItems] = useState<WorkItem[]>([
    {
      id: 1,
      description:
        "Earth work in excavation by mechanical means (Hydraulic excavator) / manual means in foundation trenches",
      unit: "Cum",
      measurements: [
        {
          id: 1,
          description: "Footing",
          no: 8,
          length: 2,
          width: 2,
          height: 0.5,
          total: 32,
        },
      ],
      totalQuantity: 32,
      uploadedFile: null,
    },
  ]);

  // Main file upload for the MB
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainFileError, setMainFileError] = useState<string>("");

  const addMeasurement = (itemIndex: number) => {
    const newMeasurement: Measurement = {
      id: Date.now(),
      description: "",
      no: 1,
      length: 0,
      width: 0,
      height: 0,
      total: 0,
    };

    const updatedItems: WorkItem[] = [...workItems];
    updatedItems[itemIndex].measurements.push(newMeasurement);
    setWorkItems(updatedItems);
  };

  const updateMeasurement = (
    itemIndex: number,
    measurementIndex: number,
    field: keyof Measurement,
    value: string | number
  ): void => {
    const updatedItems: WorkItem[] = [...workItems];
    const measurement: Measurement =
      updatedItems[itemIndex].measurements[measurementIndex];
    measurement[field] = value as never;

    // Auto-calculate total
    if (["no", "length", "width", "height"].includes(field)) {
      measurement.total =
        Number(measurement.no) *
        Number(measurement.length) *
        Number(measurement.width) *
        Number(measurement.height);
    }

    // Update item total
    updatedItems[itemIndex].totalQuantity = updatedItems[
      itemIndex
    ].measurements.reduce((sum, m) => sum + m.total, 0);

    setWorkItems(updatedItems);
  };

  const deleteMeasurement = (
    itemIndex: number,
    measurementIndex: number
  ): void => {
    const updatedItems: WorkItem[] = [...workItems];
    updatedItems[itemIndex].measurements.splice(measurementIndex, 1);
    updatedItems[itemIndex].totalQuantity = updatedItems[
      itemIndex
    ].measurements.reduce((sum, m) => sum + m.total, 0);
    setWorkItems(updatedItems);
  };

  const addWorkItem = () => {
    const newItem: WorkItem = {
      id: Date.now(),
      description: "",
      unit: "Cum",
      measurements: [],
      totalQuantity: 0,
      uploadedFile: null,
    };
    setWorkItems([...workItems, newItem]);
  };

  const removeWorkItem = (itemIndex: number) => {
    if (workItems.length > 1) {
      const updatedItems = workItems.filter((_, index) => index !== itemIndex);
      setWorkItems(updatedItems);
    }
  };

  const handleMainFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      setMainFileError("Please select a PDF, JPG, JPEG, or PNG file");
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      setMainFileError("File size must be less than 50MB");
      return;
    }

    setMainFile(file);
    setMainFileError("");
  };

  const handleWorkItemFileSelect = (itemIndex: number, file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a PDF, JPG, JPEG, or PNG file");
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size must be less than 50MB");
      return;
    }

    const updatedItems = [...workItems];
    updatedItems[itemIndex].uploadedFile = file;
    setWorkItems(updatedItems);
  };

  const removeWorkItemFile = (itemIndex: number) => {
    const updatedItems = [...workItems];
    updatedItems[itemIndex].uploadedFile = null;
    setWorkItems(updatedItems);
  };

  const validateForm = (): boolean => {
    if (!mbFormData.projectId.trim()) {
      toast.error("Project ID is required");
      return false;
    }

    if (mbFormData.projectId.length !== 24) {
      toast.error("Project ID must be 24 characters long");
      return false;
    }

    if (!mbFormData.description.trim()) {
      toast.error("Description is required");
      return false;
    }

    if (mbFormData.description.length < 10) {
      toast.error("Description must be at least 10 characters long");
      return false;
    }

    if (!mainFile) {
      toast.error("Main measurement book file is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const token = getAuthToken();

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("project", mbFormData.projectId);
      formData.append("description", mbFormData.description);
      if (mbFormData.remarks.trim()) {
        formData.append("remarks", mbFormData.remarks);
      }
      formData.append("mbFile", mainFile as File);

      // Add work items data (for reference, not used by backend)
      const workItemsData = workItems.map((item) => ({
        description: item.description,
        unit: item.unit,
        measurements: item.measurements,
        totalQuantity: item.totalQuantity,
      }));
      formData.append("workItemsReference", JSON.stringify(workItemsData));

      const response = await fetch(`${API_BASE_URL}/mb`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create measurement book");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to create measurement book");
      }

      toast.success("Measurement book created successfully");
      router.push("/dashboard/mb");
    } catch (error) {
      console.error("Error creating measurement book:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create measurement book"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUpload = ({
    file,
    onFileSelect,
    onFileRemove,
    error,
    label = "Upload File",
  }: {
    file: File | null;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    error?: string;
    label?: string;
  }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    // let fileInputRef = useState<HTMLInputElement | null>(null)[0];
    const fileInputId = useState(
      `file-upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    )[0];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
      // Reset the input value to allow selecting the same file again
      event.target.value = "";
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const selectedFile = files[0];
        onFileSelect(selectedFile);
      }
    };

    const handleClick = () => {
      const input = document.getElementById(fileInputId) as HTMLInputElement;
      if (input) {
        input.click();
      }
    };

    return (
      <div className="space-y-2">
        {!file ? (
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
              isDragOver
                ? "border-teal-400 bg-teal-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <Upload
              className={`mx-auto h-8 w-8 ${
                isDragOver ? "text-teal-500" : "text-gray-400"
              }`}
            />
            <div className="mt-2">
              <span
                className={`text-sm font-medium ${
                  isDragOver
                    ? "text-teal-600"
                    : "text-teal-600 hover:text-teal-500"
                }`}
              >
                {isDragOver ? "Drop file here" : label}
              </span>
              <input
                // ref={(el) => {
                //   if (el) fileInputRef = el;
                // }}
                id={fileInputId}
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                {isDragOver
                  ? "Release to upload"
                  : "PDF, JPG, JPEG, PNG up to 50MB or drag and drop"}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <File className="h-6 w-6 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onFileRemove}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard/mb")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to MB List
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Measurement Book
                </h1>
                <p className="text-sm text-gray-600">
                  Upload and create measurement book with work items
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/mb")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isSubmitting ? (
                  <>
                    <Calculator className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create MB
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* MB Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Measurement Book Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectId" className="text-sm font-medium">
                  Project ID *
                </Label>
                <Input
                  id="projectId"
                  type="text"
                  value={mbFormData.projectId}
                  onChange={(e) =>
                    setMBFormData({ ...mbFormData, projectId: e.target.value })
                  }
                  placeholder="Enter 24-character Project ID"
                  maxLength={24}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the exact MongoDB Project ID (24 characters)
                </p>
              </div>
              <div>
                <Label htmlFor="createdBy" className="text-sm font-medium">
                  Created By
                </Label>
                <Input
                  id="createdBy"
                  type="text"
                  value={user?.name || ""}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                value={mbFormData.description}
                onChange={(e) =>
                  setMBFormData({ ...mbFormData, description: e.target.value })
                }
                placeholder="Enter detailed description of the measurement book (minimum 10 characters)"
                className="mt-1 min-h-[100px]"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {mbFormData.description.length}/1000 characters (minimum 10
                required)
              </p>
            </div>

            <div>
              <Label htmlFor="remarks" className="text-sm font-medium">
                Remarks
              </Label>
              <Textarea
                id="remarks"
                value={mbFormData.remarks}
                onChange={(e) =>
                  setMBFormData({ ...mbFormData, remarks: e.target.value })
                }
                placeholder="Enter any additional remarks (optional)"
                className="mt-1 min-h-[80px]"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {mbFormData.remarks.length}/500 characters (optional)
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Main Measurement Book File *
              </Label>
              <div className="mt-2">
                <FileUpload
                  file={mainFile}
                  onFileSelect={handleMainFileSelect}
                  onFileRemove={() => setMainFile(null)}
                  error={mainFileError}
                  label="Upload Main MB File"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Items Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Work Item Measurements (Reference)</CardTitle>
              <Button
                onClick={addWorkItem}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Work Item
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              These work items are for reference and calculation purposes. Only
              the main file above will be used for MB creation.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {workItems.map((item, itemIndex) => (
                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">
                      Work Item {itemIndex + 1}
                    </h4>
                    {workItems.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkItem(itemIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">
                        Item Description
                      </Label>
                      <Input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...workItems];
                          updated[itemIndex].description = e.target.value;
                          setWorkItems(updated);
                        }}
                        placeholder="Enter work item description"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Unit</Label>
                      <select
                        value={item.unit}
                        onChange={(e) => {
                          const updated = [...workItems];
                          updated[itemIndex].unit = e.target.value;
                          setWorkItems(updated);
                        }}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="Cum">Cum</option>
                        <option value="Sqm">Sqm</option>
                        <option value="Rmt">Rmt</option>
                        <option value="Nos">Nos</option>
                        <option value="Kg">Kg</option>
                        <option value="MT">MT</option>
                      </select>
                    </div>
                  </div>

                  {/* File Upload for Work Item */}
                  <div className="mb-4">
                    <Label className="text-sm font-medium">
                      Work Item File (Optional)
                    </Label>
                    <div className="mt-2">
                      <FileUpload
                        file={item.uploadedFile}
                        onFileSelect={(file) =>
                          handleWorkItemFileSelect(itemIndex, file)
                        }
                        onFileRemove={() => removeWorkItemFile(itemIndex)}
                        label="Upload Work Item File"
                      />
                    </div>
                  </div>

                  {/* Measurements Table */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">
                        Measurements
                      </h4>
                      <Button
                        onClick={() => addMeasurement(itemIndex)}
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Row
                      </Button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              No.
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Length
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Width
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Height
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {item.measurements.map(
                            (measurement, measurementIndex) => (
                              <tr key={measurement.id}>
                                <td className="px-3 py-2">
                                  <Input
                                    type="text"
                                    value={measurement.description}
                                    onChange={(e) =>
                                      updateMeasurement(
                                        itemIndex,
                                        measurementIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Item description"
                                    className="text-sm"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <Input
                                    type="number"
                                    value={measurement.no}
                                    onChange={(e) =>
                                      updateMeasurement(
                                        itemIndex,
                                        measurementIndex,
                                        "no",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-20 text-sm"
                                    step="0.01"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <Input
                                    type="number"
                                    value={measurement.length}
                                    onChange={(e) =>
                                      updateMeasurement(
                                        itemIndex,
                                        measurementIndex,
                                        "length",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-20 text-sm"
                                    step="0.01"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <Input
                                    type="number"
                                    value={measurement.width}
                                    onChange={(e) =>
                                      updateMeasurement(
                                        itemIndex,
                                        measurementIndex,
                                        "width",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-20 text-sm"
                                    step="0.01"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <Input
                                    type="number"
                                    value={measurement.height}
                                    onChange={(e) =>
                                      updateMeasurement(
                                        itemIndex,
                                        measurementIndex,
                                        "height",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-20 text-sm"
                                    step="0.01"
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <span className="text-sm font-medium text-gray-900">
                                    {measurement.total.toFixed(3)}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <Button
                                    onClick={() =>
                                      deleteMeasurement(
                                        itemIndex,
                                        measurementIndex
                                      )
                                    }
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <div className="bg-blue-50 px-4 py-2 rounded-lg">
                        <span className="text-sm font-medium text-blue-900">
                          Total Quantity: {item.totalQuantity.toFixed(3)}{" "}
                          {item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateMBPage;
