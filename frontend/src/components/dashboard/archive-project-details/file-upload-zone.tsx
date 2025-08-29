"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, ImageIcon, Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

interface FileUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  required?: boolean;
  error?: string;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
}

export function FileUploadZone({
  files,
  onFilesChange,
  required = false,
  error,
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/gif",
  ],
}: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateAndAddFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newFiles = Array.from(fileList);
    const validFiles: File[] = [];

    // Filter valid files
    for (const file of newFiles) {
      if (acceptedTypes.includes(file.type) && file.size <= maxFileSize) {
        validFiles.push(file);
      }
    }

    // Check total file count
    const totalFiles = files.length + validFiles.length;
    const filesToAdd =
      totalFiles > maxFiles
        ? validFiles.slice(0, maxFiles - files.length)
        : validFiles;

    if (filesToAdd.length > 0) {
      onFilesChange([...files, ...filesToAdd]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    validateAndAddFiles(event.target.files);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const handleZoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onFilesChange(updatedFiles);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />;
    }
    return <FileText className="h-4 w-4 text-green-500 flex-shrink-0" />;
  };

  const getFileTypeDisplay = (mimeType: string) => {
    const type = mimeType.split("/")[1];
    return type ? type.toUpperCase() : "Unknown";
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? "border-teal-400 bg-teal-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleZoneClick}
      >
        <Upload
          className={`h-8 w-8 mx-auto mb-2 transition-colors duration-200 ${
            dragActive ? "text-teal-500" : "text-gray-400"
          }`}
        />
        <p className="text-sm text-gray-600 mb-2">
          {dragActive
            ? "Drop files here"
            : "Drag files here or click to upload"}
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
        <p className="text-xs text-gray-500">
          PDF, Word, Excel, PNG, JPEG, GIF (Max{" "}
          {Math.floor(maxFileSize / 1024 / 1024)}MB per file, {maxFiles} files
          max)
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg,.gif"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">
            Selected Files ({files.length}/{maxFiles})
          </h5>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium text-gray-900 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} •{" "}
                    {getFileTypeDisplay(file.type)}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-100 text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Count Warning */}
      {files.length >= maxFiles && (
        <div className="text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded p-2">
          Maximum file limit reached ({maxFiles} files)
        </div>
      )}
    </div>
  );
}
