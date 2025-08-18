"use server";

import {
  budgetHeadOptions,
  departmentOptions,
  districtOptions,
  functionOptions,
  fundOptions,
  modeOfExecutionOptions,
  natureOfWorkOptions,
  subTypeOfWorkOptions,
  typeOfWorkOptions,
} from "@/utils/create-project/constants";

// Types for API response
export interface DropdownOptions {
  fundOptions: string[];
  functionOptions: string[];
  budgetHeadOptions: string[];
  departmentOptions: string[];
  typeOfWorkOptions: string[];
  subTypeOfWorkOptions: string[];
  natureOfWorkOptions: string[];
  modeOfExecutionOptions: string[];
  districtOptions: string[];
}

export interface ApiResponse {
  success: boolean;
  data?: {
    funds?: string[];
    functions?: string[];
    budgetHeads?: string[];
    departments?: string[];
    typeOfWork?: string[];
    subTypeOfWork?: string[];
    natureOfWork?: string[];
    modeOfExecution?: string[];
    districts?: string[];
  };
  message?: string;
}

// Helper function to get fallback options
function getFallbackOptions(): DropdownOptions {
  return {
    fundOptions,
    functionOptions,
    budgetHeadOptions,
    departmentOptions,
    typeOfWorkOptions,
    subTypeOfWorkOptions,
    natureOfWorkOptions,
    modeOfExecutionOptions,
    districtOptions,
  };
}

// Server action to fetch dropdown options
export async function fetchDropdownOptions(): Promise<DropdownOptions> {
  // Get API URL from environment variables
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  // If no API URL is configured or we're in build mode, return fallback immediately
  if (
    !apiUrl ||
    (process.env.NODE_ENV === "production" && !process.env.VERCEL_URL)
  ) {
    console.log(
      "Using fallback dropdown options (no API URL configured or build time)"
    );
    return getFallbackOptions();
  }

  // Skip API calls during build time (detected by lack of runtime environment)
  if (typeof window === "undefined" && !global.fetch) {
    console.log("Skipping API call during build time");
    return getFallbackOptions();
  }

  try {
    // Construct the full API URL
    const fullApiUrl = `${apiUrl}/projects/dropdown-options`;

    console.log(`Attempting to fetch dropdown options from: ${fullApiUrl}`);

    // Attempt to fetch from API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(fullApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Remove force-cache during build, use no-store for fresh data
      cache: process.env.NODE_ENV === "development" ? "no-store" : "default",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const apiData: ApiResponse = await response.json();

    if (apiData.success && apiData.data) {
      console.log("Successfully fetched dropdown options from API");

      // Map API response to our dropdown options format
      return {
        fundOptions: apiData.data.funds || fundOptions,
        functionOptions: apiData.data.functions || functionOptions,
        budgetHeadOptions: apiData.data.budgetHeads || budgetHeadOptions,
        departmentOptions: apiData.data.departments || departmentOptions,
        typeOfWorkOptions: apiData.data.typeOfWork || typeOfWorkOptions,
        districtOptions: apiData.data.districts || districtOptions,
        subTypeOfWorkOptions:
          apiData.data.subTypeOfWork || subTypeOfWorkOptions,
        natureOfWorkOptions: apiData.data.natureOfWork || natureOfWorkOptions,
        modeOfExecutionOptions:
          apiData.data.modeOfExecution || modeOfExecutionOptions,
      };
    } else {
      throw new Error(apiData.message || "API returned unsuccessful response");
    }
  } catch (error) {
    // Log the error for debugging but don't throw it
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("API request timed out, using fallback options");
      } else {
        console.warn("Error fetching dropdown options:", error.message);
      }
    } else {
      console.warn("Unknown error fetching dropdown options:", error);
    }
  }

  // Always return fallback options if API fails
  console.log("Using fallback dropdown options");
  return getFallbackOptions();
}
