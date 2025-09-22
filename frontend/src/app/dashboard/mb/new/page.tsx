"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthToken } from "@/lib/rbac-config/auth-local";
import {
  fetchUnifiedProjectDetails,
  UnifiedProjectDetails,
} from "@/utils/combined-projects/fetch-project-details";
import {
  Calculator,
  Calendar,
  File,
  IndianRupee,
  MapPin,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  remarks: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

const CreateMBPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingProject, setIsFetchingProject] = useState(false);
  const [projectDetails, setProjectDetails] =
    useState<UnifiedProjectDetails | null>(null);

  // Form data for the main MB
  const [projectId, setProjectId] = useState("");

  // Work items for measurement calculations - each will become a separate MB
  const [workItems, setWorkItems] = useState<WorkItem[]>([
    {
      id: 1,
      description: "",
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
      remarks: "",
    },
  ]);

  // Fetch project details when projectId changes
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId.trim() || projectId.length < 3) {
        setProjectDetails(null);
        return;
      }

      setIsFetchingProject(true);
      try {
        const details = await fetchUnifiedProjectDetails(projectId.trim());
        if (details) {
          setProjectDetails(details);
        } else {
          setProjectDetails(null);
          toast.error(
            `Project with ID '${projectId}' not found in either Project or ArchiveProject collections`
          );
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        setProjectDetails(null);
        toast.error("Error fetching project details");
      } finally {
        setIsFetchingProject(false);
      }
    };

    const debounceTimer = setTimeout(fetchProjectDetails, 500);
    return () => clearTimeout(debounceTimer);
  }, [projectId]);

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
      remarks: "",
    };
    setWorkItems([...workItems, newItem]);
  };

  const removeWorkItem = (itemIndex: number) => {
    if (workItems.length > 1) {
      const updatedItems = workItems.filter((_, index) => index !== itemIndex);
      setWorkItems(updatedItems);
    } else {
      toast.error("At least one measurement book is required");
    }
  };

  const handleWorkItemFileSelect = (itemIndex: number, file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a PDF, JPG, JPEG, PNG, or WebP file");
      return;
    }

    // Validate file size (10MB max for MB files)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
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

  const updateWorkItemField = (
    itemIndex: number,
    field: keyof WorkItem,
    value: string
  ) => {
    const updatedItems = [...workItems];
    updatedItems[itemIndex][field] = value as never;
    setWorkItems(updatedItems);
  };

  const validateForm = (): boolean => {
    if (!projectId.trim()) {
      toast.error("Project ID is required");
      return false;
    }

    if (!projectDetails) {
      toast.error(
        "Please enter a valid Project ID and wait for project details to load"
      );
      return false;
    }

    // Validate each work item
    for (let i = 0; i < workItems.length; i++) {
      const item = workItems[i];

      if (!item.description.trim()) {
        toast.error(`Measurement Book ${i + 1}: Description is required`);
        return false;
      }

      if (item.description.trim().length < 10) {
        toast.error(
          `Measurement Book ${
            i + 1
          }: Description must be at least 10 characters`
        );
        return false;
      }

      if (!item.uploadedFile) {
        toast.error(`Measurement Book ${i + 1}: File upload is required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    const token = getAuthToken();

    try {
      // Create FormData for batch file upload
      const formData = new FormData();

      // Add all files
      workItems.forEach((item) => {
        if (item.uploadedFile) {
          formData.append("mbFiles", item.uploadedFile);
        }
      });

      // Create measurement books data array
      const measurementBooksData = workItems.map((item) => ({
        project: projectId.trim(),
        description: item.description.trim(),
        remarks: item.remarks?.trim() || undefined,
      }));

      formData.append("measurementBooks", JSON.stringify(measurementBooksData));

      const response = await fetch(`${API_BASE_URL}/mb/batch`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create measurement books");
      }

      if (!data.success) {
        throw new Error(data.message || "Failed to create measurement books");
      }

      toast.success(
        `${data.data.summary.totalCreated} Measurement Books created successfully`
      );

      // Show additional success details
      if (data.data.summary.projectTypes) {
        const { regular, archive } = data.data.summary.projectTypes;
        if (regular > 0 && archive > 0) {
          toast.info(
            `Created for ${regular} regular project(s) and ${archive} archive project(s)`
          );
        }
      }

      router.push("/dashboard/mb");
    } catch (error) {
      console.error("Error creating measurement books:", error);

      // Show specific error messages if available
      if (error instanceof Error && error.message.includes("validation")) {
        toast.error(`Validation Error: ${error.message}`);
      } else if (
        error instanceof Error &&
        error.message.includes("not found")
      ) {
        toast.error(`Project Error: ${error.message}`);
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create measurement books"
        );
      }
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
    const fileInputId = useState(
      `file-upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    )[0];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
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
                id={fileInputId}
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                {isDragOver
                  ? "Release to upload"
                  : "PDF, JPG, JPEG, PNG, WebP up to 10MB or drag and drop"}
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
    <div className="w-full mb-5 space-y-4">
      {/* Header */}
      <div className="">
        <div className="">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Create Measurement Books
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-6 space-y-6">
        {/* Project Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Project Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="projectId" className="text-sm font-medium">
                  Project ID *
                </Label>
                <Input
                  id="projectId"
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  placeholder="Enter Project ID (e.g., PRJ-2024-001 or ARC-2023-042)"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  E
                  {`nter the Project ID string. System will automatically detect
                  if it's a regular project or archive project.`}
                </p>
                {isFetchingProject && (
                  <p className="text-xs text-blue-600 mt-1">
                    Loading project details...
                  </p>
                )}
              </div>
            </div>

            {/* Project Details Display */}
            {projectDetails && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Project Details ({projectDetails.projectType})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Label className="text-xs font-medium text-gray-500">
                      Project Name
                    </Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {projectDetails.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Label className="text-xs font-medium text-gray-500 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      Contractor
                    </Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {projectDetails.contractorName}
                      {projectDetails.contractorPhone && (
                        <span className="text-xs text-gray-600 block">
                          {projectDetails.contractorPhone}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Label className="text-xs font-medium text-gray-500 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      Location
                    </Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {projectDetails.location}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Label className="text-xs font-medium text-gray-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Start Date
                    </Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {new Date(projectDetails.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  {projectDetails.endDate && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <Label className="text-xs font-medium text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        End Date
                      </Label>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {new Date(projectDetails.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <Label className="text-xs font-medium text-gray-500 flex items-center">
                      <IndianRupee className="h-3 w-3 mr-1" />
                      Work Value
                    </Label>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      ₹{projectDetails.workValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Measurement Books Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                Measurement Books ({workItems.length})
              </CardTitle>
              <Button
                onClick={addWorkItem}
                variant="outline"
                size="sm"
                className="text-green-600 border-green-600 hover:bg-green-50"
                disabled={!projectDetails}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Measurement Book
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Each measurement book below will be created as a separate MB for
              the selected project.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {workItems.map((item, itemIndex) => (
                <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">
                      Measurement Book {itemIndex + 1}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <Label className="text-sm font-medium">
                        MB Description *
                      </Label>
                      <Input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateWorkItemField(
                            itemIndex,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Enter measurement book description (min 10 characters)"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This will be the main description for this measurement
                        book
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        Unit (Reference)
                      </Label>
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          updateWorkItemField(itemIndex, "unit", e.target.value)
                        }
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
                    <div>
                      <Label className="text-sm font-medium">
                        Remarks (Optional)
                      </Label>
                      <Input
                        type="text"
                        value={item.remarks}
                        onChange={(e) =>
                          updateWorkItemField(
                            itemIndex,
                            "remarks",
                            e.target.value
                          )
                        }
                        placeholder="Additional remarks for this MB"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Measurements Table - For Reference/Calculation Only */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-gray-900">
                        Measurements (Reference Only)
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

                  {/* File Upload for Measurement Book */}
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium">
                      Measurement Book File *
                    </Label>
                    <div className="mt-2">
                      <FileUpload
                        file={item.uploadedFile}
                        onFileSelect={(file) =>
                          handleWorkItemFileSelect(itemIndex, file)
                        }
                        onFileRemove={() => removeWorkItemFile(itemIndex)}
                        label="Upload Measurement Book File"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            variant="outline"
            size="lg" // Add this line
            onClick={() => router.push("/dashboard/mb")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !projectDetails || workItems.length === 0}
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-sm hover:from-teal-700 hover:to-teal-800 px-8"
          >
            {isSubmitting ? (
              <>
                <Calculator className="h-5 w-5 mr-2 animate-spin" />
                Creating {workItems.length} MB{workItems.length > 1 ? "s" : ""}
                ...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Create {workItems.length} Measurement Book
                {workItems.length > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateMBPage;
