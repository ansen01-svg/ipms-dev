import {
  MeasurementBookError,
  MeasurementBookResponse,
  MeasurementBooksListResponse,
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
): response is MeasurementBookError => {
  return (
    typeof response === "object" &&
    response !== null &&
    (response as MeasurementBookError).success === false
  );
};

export const isMeasurementBookResponse = (
  response: unknown
): response is MeasurementBookResponse => {
  return (
    typeof response === "object" &&
    response !== null &&
    (response as MeasurementBookResponse).success === true &&
    (response as MeasurementBookResponse).data &&
    !Array.isArray((response as MeasurementBookResponse).data)
  );
};

export const isMeasurementBooksListResponse = (
  response: unknown
): response is MeasurementBooksListResponse => {
  return (
    typeof response === "object" &&
    response !== null &&
    (response as MeasurementBooksListResponse).success === true &&
    (response as MeasurementBooksListResponse).data !== undefined &&
    Array.isArray(
      (response as MeasurementBooksListResponse).data.measurementBooks
    )
  );
};
