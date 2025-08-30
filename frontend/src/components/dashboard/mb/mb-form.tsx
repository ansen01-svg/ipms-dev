// frontend/src/components/dashboard/mb/mb-form.tsx - Updated for backend schema

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
import { Textarea } from "@/components/ui/textarea";
import { CreateMBData } from "@/types/mb.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { File, Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form validation schema matching backend expectations
const createMBSchema = z.object({
  project: z
    .string()
    .min(1, "Project ID is required")
    .min(24, "Project ID must be a valid MongoDB ObjectId")
    .max(24, "Project ID must be a valid MongoDB ObjectId"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description cannot exceed 1000 characters"),
  remarks: z
    .string()
    .max(500, "Remarks cannot exceed 500 characters")
    .optional(),
});

type CreateMBFormData = z.infer<typeof createMBSchema>;

// Props interfaces
interface MBFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMBData) => Promise<void>;
  projectOptions?: Array<{ id: string; name: string; workOrderNumber: string }>;
  isLoading?: boolean;
  mode: "create";
}

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
export function MBForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: MBFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const form = useForm<CreateMBFormData>({
    resolver: zodResolver(createMBSchema),
    defaultValues: {
      project: "",
      description: "",
      remarks: "",
    },
  });

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setFileError("");
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFileError("");
  };

  const handleSubmit = async (data: CreateMBFormData) => {
    if (!selectedFile) {
      setFileError("File is required");
      return;
    }

    const createData: CreateMBData = {
      project: data.project,
      description: data.description,
      remarks: data.remarks,
      mbFile: selectedFile,
    };

    await onSubmit(createData);
  };

  const handleClose = () => {
    form.reset();
    setSelectedFile(null);
    setFileError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Measurement Book</DialogTitle>
          <DialogDescription>
            Upload and create a new measurement book for a project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Project ID */}
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project ID *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter MongoDB Project ID (24 characters)"
                      {...field}
                      maxLength={24}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the exact Project ID from your database
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormDescription>
                    Provide a clear description of the measurement book contents
                  </FormDescription>
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

            {/* File Upload */}
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
                Create MB
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
