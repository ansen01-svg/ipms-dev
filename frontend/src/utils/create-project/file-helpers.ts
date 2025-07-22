// utils/file-helpers.ts

export class FileHelpers {
  static readonly ALLOWED_FILE_TYPES = {
    "application/pdf": { extension: ".pdf", category: "document" },
    "image/jpeg": { extension: ".jpg", category: "image" },
    "image/jpg": { extension: ".jpg", category: "image" },
    "image/png": { extension: ".png", category: "image" },
  };

  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (
      !this.ALLOWED_FILE_TYPES[
        file.type as keyof typeof this.ALLOWED_FILE_TYPES
      ]
    ) {
      return {
        isValid: false,
        error: `Invalid file type: ${file.type}. Only PDF and image files (JPG, PNG) are allowed.`,
      };
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size too large: ${this.formatFileSize(
          file.size
        )}. Maximum allowed size is ${this.formatFileSize(
          this.MAX_FILE_SIZE
        )}.`,
      };
    }

    return { isValid: true };
  }

  static getFileCategory(file: File): "document" | "image" | "unknown" {
    const fileInfo =
      this.ALLOWED_FILE_TYPES[
        file.type as keyof typeof this.ALLOWED_FILE_TYPES
      ];
    return (fileInfo?.category as "document" | "image") || "unknown";
  }

  static generateFilePreview(file: File): Promise<string | null> {
    return new Promise((resolve) => {
      if (this.getFileCategory(file) === "image") {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  }

  static async compressImage(
    file: File,
    maxWidth: number = 1200,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      if (this.getFileCategory(file) !== "image") {
        resolve(file);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: file.lastModified,
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  static getFileExtension(fileName: string): string {
    return fileName.split(".").pop()?.toLowerCase() || "";
  }

  static isImageFile(file: File): boolean {
    return this.getFileCategory(file) === "image";
  }

  static isPdfFile(file: File): boolean {
    return file.type === "application/pdf";
  }

  static validateFileExtension(fileName: string): boolean {
    const extension = this.getFileExtension(fileName);
    const allowedExtensions = ["pdf", "jpg", "jpeg", "png"];
    return allowedExtensions.includes(extension);
  }

  static createFileList(files: File[]): FileList {
    const dt = new DataTransfer();
    files.forEach((file) => dt.items.add(file));
    return dt.files;
  }
}
