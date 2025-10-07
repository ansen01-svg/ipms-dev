"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuthToken } from "@/lib/rbac-config/auth-local";
import { FormMeasurementItem, UnifiedProjectDetails } from "@/types/mb.types";
import { fetchUnifiedProjectDetails } from "@/utils/combined-projects/fetch-project-details";
import {
  Calendar,
  File,
  FileText,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

const CreateMBPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingProject, setIsFetchingProject] = useState(false);
  const [projectDetails, setProjectDetails] =
    useState<UnifiedProjectDetails | null>(null);

  // Project ID input
  const [projectId, setProjectId] = useState("");

  // MB Details Form
  const [mbNo, setMbNo] = useState("");
  const [nameOfWork, setNameOfWork] = useState("");
  const [location, setLocation] = useState("");
  const [contractor, setContractor] = useState("");
  const [tenderAgreement, setTenderAgreement] = useState("");
  const [workOrderNo, setWorkOrderNo] = useState("");
  const [aaOrFsNo, setAaOrFsNo] = useState("");
  const [aaOrFsDate, setAaOrFsDate] = useState("");
  const [slNoOfBill, setSlNoOfBill] = useState("");
  const [dateOfCommencement, setDateOfCommencement] = useState("");
  const [dateOfCompletion, setDateOfCompletion] = useState("");
  const [dateOfMeasurement, setDateOfMeasurement] = useState("");

  // Measurements array
  const [measurements, setMeasurements] = useState<FormMeasurementItem[]>([
    {
      id: `MEAS_${Date.now()}`,
      description: "",
      unit: "Cum",
      uploadedFile: null,
      no: 1,
      length: 0,
      width: 0,
      height: 0,
      total: 0,
    },
  ]);

  // Fetch project details when projectId changes
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId.trim() || projectId.length < 3) {
        setProjectDetails(null);
        // Reset form when no project
        resetFormFields();
        return;
      }

      setIsFetchingProject(true);
      try {
        const details = await fetchUnifiedProjectDetails(projectId.trim());
        if (details) {
          setProjectDetails(details);
          // Populate form fields from project details
          populateFormFromProject(details);
        } else {
          setProjectDetails(null);
          resetFormFields();
          toast.error(
            `Project with ID '${projectId}' not found in either Project or ArchiveProject collections`
          );
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        setProjectDetails(null);
        resetFormFields();
        toast.error("Error fetching project details");
      } finally {
        setIsFetchingProject(false);
      }
    };

    const debounceTimer = setTimeout(fetchProjectDetails, 500);
    return () => clearTimeout(debounceTimer);
  }, [projectId]);

  const populateFormFromProject = (details: UnifiedProjectDetails) => {
    setNameOfWork(details.name || "");
    setLocation(details.location || details.district || "");
    setContractor(details.contractorName || "");
    setWorkOrderNo(details.workOrderNumber || "");
    if (details.startDate) {
      setDateOfCommencement(
        new Date(details.startDate).toISOString().split("T")[0]
      );
    }
    if (details.endDate) {
      setDateOfCompletion(
        new Date(details.endDate).toISOString().split("T")[0]
      );
    }
  };

  const resetFormFields = () => {
    setNameOfWork("");
    setLocation("");
    setContractor("");
    setTenderAgreement("");
    setWorkOrderNo("");
    setAaOrFsNo("");
    setAaOrFsDate("");
    setSlNoOfBill("");
    setDateOfCommencement("");
    setDateOfCompletion("");
    setDateOfMeasurement("");
  };

  const addMeasurement = () => {
    const newMeasurement: FormMeasurementItem = {
      id: `MEAS_${Date.now()}`,
      description: "",
      unit: "Cum",
      uploadedFile: null,
      no: 1,
      length: 0,
      width: 0,
      height: 0,
      total: 0,
    };
    setMeasurements([...measurements, newMeasurement]);
  };

  const updateMeasurement = (
    index: number,
    field: keyof FormMeasurementItem,
    value: string | number | File | null
  ) => {
    const updated = [...measurements];
    updated[index] = { ...updated[index], [field]: value as never };

    // Auto-calculate total
    if (["no", "length", "width", "height"].includes(field as string)) {
      const m = updated[index];
      m.total =
        Number(m.no) * Number(m.length) * Number(m.width) * Number(m.height);
    }

    setMeasurements(updated);
  };

  const deleteMeasurement = (index: number) => {
    if (measurements.length > 1) {
      const updated = measurements.filter((_, i) => i !== index);
      setMeasurements(updated);
    } else {
      toast.error("At least one measurement item is required");
    }
  };

  const handleMeasurementFileSelect = (index: number, file: File) => {
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

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    updateMeasurement(index, "uploadedFile", file);
  };

  const removeMeasurementFile = (index: number) => {
    updateMeasurement(index, "uploadedFile", null);
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

    if (!mbNo.trim()) {
      toast.error("M.B. No. is required");
      return false;
    }

    if (!nameOfWork.trim() || nameOfWork.trim().length < 5) {
      toast.error("Name of Work is required (minimum 5 characters)");
      return false;
    }

    if (!location.trim()) {
      toast.error("Location is required");
      return false;
    }

    if (!contractor.trim()) {
      toast.error("Name of Contractor is required");
      return false;
    }

    if (!dateOfCommencement) {
      toast.error("Date of Commencement is required");
      return false;
    }

    if (!dateOfCompletion) {
      toast.error("Date of Completion is required");
      return false;
    }

    if (!dateOfMeasurement) {
      toast.error("Date of Measurement is required");
      return false;
    }

    if (new Date(dateOfCommencement) > new Date(dateOfCompletion)) {
      toast.error("Date of Commencement cannot be after Date of Completion");
      return false;
    }

    // Validate measurements
    for (let i = 0; i < measurements.length; i++) {
      const m = measurements[i];
      if (!m.description.trim() || m.description.trim().length < 5) {
        toast.error(
          `Measurement ${i + 1}: Description is required (minimum 5 characters)`
        );
        return false;
      }
      if (!m.unit.trim()) {
        toast.error(`Measurement ${i + 1}: Unit is required`);
        return false;
      }
      if (!m.uploadedFile) {
        toast.error(`Measurement ${i + 1}: File upload is required`);
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
      const formData = new FormData();

      // Add all measurement files
      measurements.forEach((m) => {
        if (m.uploadedFile) {
          formData.append("mbFiles", m.uploadedFile);
        }
      });

      // Create MB data
      const mbData = {
        project: projectId.trim(),
        mbNo: mbNo.trim(),
        nameOfWork: nameOfWork.trim(),
        location: location.trim(),
        contractor: contractor.trim(),
        tenderAgreement: tenderAgreement.trim() || undefined,
        aaOrFsNo: aaOrFsNo.trim() || undefined,
        aaOrFsDate: aaOrFsDate || undefined,
        slNoOfBill: slNoOfBill.trim() || undefined,
        dateOfCommencement,
        dateOfCompletion,
        dateOfMeasurement,
        measurements: measurements.map((m) => ({
          id: m.id,
          description: m.description.trim(),
          unit: m.unit.trim(),
        })),
      };

      formData.append("measurementBooks", JSON.stringify([mbData]));

      const response = await fetch(`${API_BASE_URL}/mb/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create measurement book");
      }

      toast.success(`Measurement Book created successfully`);
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
    label = "Upload File",
  }: {
    file: File | null;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    label?: string;
  }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputId = useState(`file-${Date.now()}-${Math.random()}`)[0];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
      event.target.value = "";
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
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              const files = e.dataTransfer.files;
              if (files[0]) onFileSelect(files[0]);
            }}
            onClick={() => document.getElementById(fileInputId)?.click()}
          >
            <Upload
              className={`mx-auto h-8 w-8 ${
                isDragOver ? "text-teal-500" : "text-gray-400"
              }`}
            />
            <div className="mt-2">
              <span className="text-sm font-medium text-teal-600">{label}</span>
              <input
                id={fileInputId}
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
              />
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG, WebP up to 10MB
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
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full mb-5 space-y-4">
      <div className="flex justify-between items-center py-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Create Measurement Book
        </h1>
      </div>

      <div className="py-6 space-y-6">
        {/* Project Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Project Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="projectId" className="text-sm font-medium">
                Project ID *
              </Label>
              <Input
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="Enter Project ID"
                className="mt-1"
              />
              {isFetchingProject && (
                <p className="text-xs text-blue-600 mt-1">
                  Loading project details...
                </p>
              )}
              {projectDetails && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Project found: {projectDetails.name} (
                  {projectDetails.projectType})
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* MB Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Measurement Book Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Auto-populated fields - Always disabled */}
              <div>
                <Label>(1) Name of Work: *</Label>
                <Input
                  value={nameOfWork}
                  onChange={(e) => setNameOfWork(e.target.value)}
                  disabled // Always disabled - auto-populated
                  placeholder="Enter name of work"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>(2) Location: *</Label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled // Always disabled - auto-populated
                  placeholder="Enter location"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>(3) Name of Contractor: *</Label>
                <Input
                  value={contractor}
                  onChange={(e) => setContractor(e.target.value)}
                  disabled // Always disabled - auto-populated
                  placeholder="Enter contractor name"
                  className="mt-1"
                />
              </div>

              {/* Manual entry fields - Enabled when project is selected */}
              <div>
                <Label>(4) Tender Agreement:</Label>
                <Input
                  value={tenderAgreement}
                  onChange={(e) => setTenderAgreement(e.target.value)}
                  disabled={!projectDetails}
                  placeholder="Enter tender agreement"
                  className="mt-1"
                />
              </div>

              {/* Auto-populated field - Always disabled */}
              <div>
                <Label>(5) Work Order No:</Label>
                <Input
                  value={workOrderNo}
                  onChange={(e) => setWorkOrderNo(e.target.value)}
                  disabled // Always disabled - auto-populated
                  placeholder="Enter work order number"
                  className="mt-1"
                />
              </div>

              {/* Manual entry fields - Enabled when project is selected */}
              <div>
                <Label>(6) A.A. or F.S. No. and Date:</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    value={aaOrFsNo}
                    onChange={(e) => setAaOrFsNo(e.target.value)}
                    disabled={!projectDetails}
                    placeholder="No."
                  />
                  <Input
                    type="date"
                    value={aaOrFsDate}
                    onChange={(e) => setAaOrFsDate(e.target.value)}
                    disabled={!projectDetails}
                  />
                </div>
              </div>
              <div>
                <Label>(7) SL No. of Bill:</Label>
                <Input
                  value={slNoOfBill}
                  onChange={(e) => setSlNoOfBill(e.target.value)}
                  disabled={!projectDetails}
                  placeholder="Enter SL No."
                  className="mt-1"
                />
              </div>

              {/* Auto-populated fields - Always disabled */}
              <div>
                <Label>(8) Date of Commencement: *</Label>
                <Input
                  type="date"
                  value={dateOfCommencement}
                  onChange={(e) => setDateOfCommencement(e.target.value)}
                  disabled // Always disabled - auto-populated
                  className="mt-1"
                />
              </div>
              <div>
                <Label>(9) Date of Completion: *</Label>
                <Input
                  type="date"
                  value={dateOfCompletion}
                  onChange={(e) => setDateOfCompletion(e.target.value)}
                  disabled // Always disabled - auto-populated
                  className="mt-1"
                />
              </div>

              {/* Manual entry fields - Enabled when project is selected */}
              <div>
                <Label>(10) Date of Measurement: *</Label>
                <Input
                  type="date"
                  value={dateOfMeasurement}
                  onChange={(e) => setDateOfMeasurement(e.target.value)}
                  disabled={!projectDetails}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>(11) M.B. No.: *</Label>
                <Input
                  value={mbNo}
                  onChange={(e) => setMbNo(e.target.value)}
                  disabled={!projectDetails}
                  placeholder="Enter MB number"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Measurements */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <CardTitle>Measurements ({measurements.length})</CardTitle>
              <Button
                onClick={addMeasurement}
                variant="outline"
                size="sm"
                disabled={!projectDetails}
                className="text-green-600 border-green-600 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Measurement
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {measurements.map((m, index) => (
                <div
                  key={m.id}
                  className="border rounded-lg p-3 sm:p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-sm sm:text-base">
                      Measurement Item {index + 1}
                    </h4>
                    {measurements.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteMeasurement(index)}
                        className="text-red-600 -mr-2 sm:mr-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <Label>Description of Items *</Label>
                      <Input
                        value={m.description}
                        onChange={(e) =>
                          updateMeasurement(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Enter item description"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Unit *</Label>
                      <select
                        value={m.unit}
                        onChange={(e) =>
                          updateMeasurement(index, "unit", e.target.value)
                        }
                        className="mt-1 w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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

                  {/* Calculation Table */}
                  <div className="mb-4 overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                      <table className="min-w-full text-xs sm:text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-2 sm:px-3 py-2.5 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
                              No.
                            </th>
                            <th className="px-2 sm:px-3 py-2.5 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
                              Length
                            </th>
                            <th className="px-2 sm:px-3 py-2.5 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
                              Width
                            </th>
                            <th className="px-2 sm:px-3 py-2.5 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
                              Height
                            </th>
                            <th className="px-2 sm:px-3 py-2.5 text-left font-semibold text-gray-700 border border-gray-200 whitespace-nowrap">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-1.5 sm:p-2 border border-gray-200 bg-white">
                              <Input
                                type="number"
                                value={m.no}
                                onChange={(e) =>
                                  updateMeasurement(
                                    index,
                                    "no",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full min-w-[60px] sm:min-w-[80px] text-xs sm:text-sm h-8 sm:h-10"
                                step="0.01"
                              />
                            </td>
                            <td className="p-1.5 sm:p-2 border border-gray-200 bg-white">
                              <Input
                                type="number"
                                value={m.length}
                                onChange={(e) =>
                                  updateMeasurement(
                                    index,
                                    "length",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full min-w-[60px] sm:min-w-[80px] text-xs sm:text-sm h-8 sm:h-10"
                                step="0.01"
                              />
                            </td>
                            <td className="p-1.5 sm:p-2 border border-gray-200 bg-white">
                              <Input
                                type="number"
                                value={m.width}
                                onChange={(e) =>
                                  updateMeasurement(
                                    index,
                                    "width",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full min-w-[60px] sm:min-w-[80px] text-xs sm:text-sm h-8 sm:h-10"
                                step="0.01"
                              />
                            </td>
                            <td className="p-1.5 sm:p-2 border border-gray-200 bg-white">
                              <Input
                                type="number"
                                value={m.height}
                                onChange={(e) =>
                                  updateMeasurement(
                                    index,
                                    "height",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full min-w-[60px] sm:min-w-[80px] text-xs sm:text-sm h-8 sm:h-10"
                                step="0.01"
                              />
                            </td>
                            <td className="p-1.5 sm:p-2 border border-gray-200 bg-gray-50">
                              <div className="font-semibold text-gray-900 px-2 py-1.5 sm:py-2 min-w-[60px] sm:min-w-[80px] text-xs sm:text-sm">
                                {m.total.toFixed(3)}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div>
                    <Label>Measurement File *</Label>
                    <div className="mt-2">
                      <FileUpload
                        file={m.uploadedFile}
                        onFileSelect={(file) =>
                          handleMeasurementFileSelect(index, file)
                        }
                        onFileRemove={() => removeMeasurementFile(index)}
                        label="Upload Measurement File"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/dashboard/mb")}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !projectDetails}
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Calendar className="h-5 w-5 mr-2 animate-spin" />
                Creating MB...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Create Measurement Book
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateMBPage;
