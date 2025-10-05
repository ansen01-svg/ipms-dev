import {
  MBErrorResponse,
  MBListResponse,
  MBSingleResponse,
} from "@/types/mb.types";

// Constants
export const MB_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const MB_MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MB_MAX_DESCRIPTION_LENGTH = 1000;
export const MB_MIN_DESCRIPTION_LENGTH = 10;
export const MB_MAX_REMARKS_LENGTH = 500;
export const MB_MAX_BATCH_SIZE = 50;

export type MBFileType = (typeof MB_FILE_TYPES)[number];

// Helper type guards
export const isMeasurementBookError = (
  response: unknown
): response is MBErrorResponse => {
  return (
    typeof response === "object" &&
    response !== null &&
    (response as MBErrorResponse).success === false
  );
};

export const isMeasurementBookResponse = (
  response: unknown
): response is MBSingleResponse => {
  return (
    typeof response === "object" &&
    response !== null &&
    (response as MBSingleResponse).success === true &&
    (response as MBSingleResponse).data &&
    !Array.isArray((response as MBSingleResponse).data)
  );
};

export const isMeasurementBooksListResponse = (
  response: unknown
): response is MBListResponse => {
  return (
    typeof response === "object" &&
    response !== null &&
    (response as MBListResponse).success === true &&
    (response as MBListResponse).data !== undefined &&
    Array.isArray((response as MBListResponse).data.measurementBooks)
  );
};
