// frontend/src/components/dashboard/measurement-books/mb-form.tsx

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreateMBData, MeasurementBook, UpdateMBData } from "@/types/mb.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { File, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema
const createMBSchema = z.object({
  projectId: z.string().min(1, "Project is required"),
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  mbNumber: z
    .string()
    .min(1, "MB number is required")
    .max(50, "MB number cannot exceed 50 characters"),
  measurementDate: z.string().min(1, "Measurement date is required"),
  workOrderNumber: z.string().optional(),
  contractorName: z.string().optional(),
  remarks: z
    .string()
    .max(500, "Remarks cannot exceed 500 characters")
    .optional(),
});

const updateMBSchema = createMBSchema.omit({ projectId: true });

type CreateMBFormData = z.infer<typeof createMBSchema>;
type UpdateMBFormData = z.infer<typeof updateMBSchema>;

// Props interfaces
interface MBFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMBData) => Promise<void>;
  projectOptions: Array<{ id: string; name: string; workOrderNumber: string }>;
  isLoading?: boolean;
  mode: "create";
}

interface MBEditFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateMBData) => Promise<void>;
  measurementBook: MeasurementBook;
  isLoading?: boolean;
  mode: "edit";
}

type MBFormUnionProps = MBFormProps | MBEditFormProps;

// File upload component
function FileUpload({
  onFileSelect,
  selectedFile,
  onFileRemove,
  error,
}: {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onFileRemove: () => void;
  error?: string;
}) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        return;
      }

      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-2">
      {!selectedFile ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-sm font-medium text-teal-600 hover:text-teal-500">
                Upload a file
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">
              PDF, JPG, JPEG, PNG up to 50MB
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center space-x-3">
            <File className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
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
}

// Main form component
export function MBForm(props: MBFormUnionProps) {
  const { isOpen, onClose, onSubmit, isLoading = false, mode } = props;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  // Determine which schema and default values to use
  const isCreateMode = mode === "create";
  const schema = isCreateMode ? createMBSchema : updateMBSchema;

  const defaultValues = isCreateMode
    ? {
        projectId: "",
        title: "",
        description: "",
        mbNumber: "",
        measurementDate: "",
        workOrderNumber: "",
        contractorName: "",
        remarks: "",
      }
    : {
        title: (props as MBEditFormProps).measurementBook.title,
        description: (props as MBEditFormProps).measurementBook.description,
        mbNumber: (props as MBEditFormProps).measurementBook.mbNumber,
        measurementDate: (
          props as MBEditFormProps
        ).measurementBook.measurementDate.split("T")[0],
        workOrderNumber:
          (props as MBEditFormProps).measurementBook.workOrderNumber || "",
        contractorName:
          (props as MBEditFormProps).measurementBook.contractorName || "",
        remarks: (props as MBEditFormProps).measurementBook.remarks || "",
      };

  const form = useForm<CreateMBFormData | UpdateMBFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFileError("");
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFileError("");
  };

  const handleSubmit = async (data: CreateMBFormData | UpdateMBFormData) => {
    if (isCreateMode) {
      if (!selectedFile) {
        setFileError("File is required");
        return;
      }

      const createData: CreateMBData = {
        ...(data as CreateMBFormData),
        mbFile: selectedFile,
      };

      await onSubmit(createData);
    } else {
      await onSubmit(data as UpdateMBData);
    }
  };

  const handleClose = () => {
    form.reset();
    setSelectedFile(null);
    setFileError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreateMode
              ? "Create New Measurement Book"
              : "Edit Measurement Book"}
          </DialogTitle>
          <DialogDescription>
            {isCreateMode
              ? "Upload and create a new measurement book for the selected project."
              : "Update the measurement book details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Project Selection - only for create mode */}
            {isCreateMode && (
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(props as MBFormProps).projectOptions.map(
                          (project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name} ({project.workOrderNumber})
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter MB title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* MB Number */}
              <FormField
                control={form.control}
                name="mbNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MB Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter MB number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Measurement Date */}
              <FormField
                control={form.control}
                name="measurementDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measurement Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Work Order Number */}
              <FormField
                control={form.control}
                name="workOrderNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Order Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter work order number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contractor Name */}
              <FormField
                control={form.control}
                name="contractorName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Contractor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contractor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter detailed description of the measurement book"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remarks */}
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional remarks"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional additional notes or comments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload - only for create mode */}
            {isCreateMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File *
                </label>
                <FileUpload
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  onFileRemove={handleFileRemove}
                  error={fileError}
                />
              </div>
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreateMode ? "Create MB" : "Update MB"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
