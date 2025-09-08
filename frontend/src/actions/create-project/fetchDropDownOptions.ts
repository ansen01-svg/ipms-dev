// Types for fund and sub fund structure
export interface SubFund {
  id: number;
  name: string;
  code: string;
}

export interface Fund {
  id: number;
  name: string;
  code: string;
  subFunds: SubFund[];
}

// Types for API response matching backend
export interface DropdownOptions {
  funds: Fund[];
  sanctionAndDepartment: string[];
  districts: string[];
  typeOfWork: string[];
  natureOfWork: string[];
}

export interface ApiResponse {
  success: boolean;
  data?: DropdownOptions;
  message?: string;
}

// Fallback options with hierarchical fund structure
function getFallbackOptions(): DropdownOptions {
  return {
    funds: [
      {
        id: 0,
        name: "Central Fund",
        code: "CF",
        subFunds: [
          { id: 0, name: "CSS", code: "CSS" },
          { id: 1, name: "Article 275(1)", code: "Art 275" },
          { id: 2, name: "EMRS (NEST)", code: "EMRS" },
          { id: 3, name: "DAJGUA", code: "DAJGUA" },
          { id: 4, name: "Others", code: "Oth" },
        ],
      },
      {
        id: 1,
        name: "State Fund",
        code: "SF",
        subFunds: [
          { id: 0, name: "SOPD", code: "SOPD" },
          { id: 1, name: "FOIGS", code: "FOIGS" },
          { id: 2, name: "GIA", code: "GIA" },
          { id: 3, name: "Others", code: "Oth" },
        ],
      },
      {
        id: 2,
        name: "Private Fund",
        code: "PF",
        subFunds: [
          { id: 0, name: "Own Source", code: "OS" },
          { id: 1, name: "Others", code: "Oth" },
        ],
      },
    ],
    sanctionAndDepartment: [
      "Department of Tribal Affairs, Plain",
      "Department of Education",
      "Department of Tea Tribes & Adivasi Welfare",
      "Department of Women & Child Development",
      "Department of Social Justice & Empowerment",
    ],
    districts: [
      "Bajali",
      "Baksa",
      "Barpeta",
      "Biswanath",
      "Bongaigaon",
      "Cachar",
      "Charaideo",
      "Chirang",
      "Darrang",
      "Dhemaji",
      "Dhubri",
      "Dibrugarh",
      "Dima Hasao",
      "Goalpara",
      "Golaghat",
      "Hailakandi",
      "Hojai",
      "Jorhat",
      "Kamrup",
      "Kamrup Metropolitan",
      "Karbi Anglong",
      "Karimganj",
      "Kokrajhar",
      "Lakhimpur",
      "Majuli",
      "Morigaon",
      "Nagaon",
      "Nalbari",
      "Sivasagar",
      "Sonitpur",
      "South Salmara-Mankachar",
      "Tamulpur",
      "Tinsukia",
      "Udalguri",
      "West Karbi Anglong",
    ],
    typeOfWork: [
      "Construction",
      "Repair & Maintenance",
      "Renovation",
      "Consultancy",
      "Survey",
      "Monitoring & Evaluation",
    ],
    natureOfWork: [
      "New Work",
      "Ongoing Work",
      "Maintenance Work",
      "Emergency Work",
    ],
  };
}

// Helper function to get sub funds for a specific main fund
export function getSubFundsForMainFund(
  funds: Fund[],
  mainFundName: string
): SubFund[] {
  const mainFund = funds.find((fund) => fund.name === mainFundName);
  return mainFund ? mainFund.subFunds : [];
}

// Helper function to get all sub fund names (useful for validation)
export function getAllSubFundNames(funds: Fund[]): string[] {
  return funds.flatMap((fund) => fund.subFunds.map((subFund) => subFund.name));
}

// Helper function to validate if a sub fund belongs to a main fund
export function isValidSubFundForMainFund(
  funds: Fund[],
  mainFundName: string,
  subFundName: string
): boolean {
  const mainFund = funds.find((fund) => fund.name === mainFundName);
  if (!mainFund) return false;

  return mainFund.subFunds.some((subFund) => subFund.name === subFundName);
}

// Helper function to get fund details by name
export function getFundByName(
  funds: Fund[],
  fundName: string
): Fund | undefined {
  return funds.find((fund) => fund.name === fundName);
}

// Helper function to get sub fund details
export function getSubFundDetails(
  funds: Fund[],
  mainFundName: string,
  subFundName: string
): SubFund | undefined {
  const mainFund = getFundByName(funds, mainFundName);
  if (!mainFund) return undefined;

  return mainFund.subFunds.find((subFund) => subFund.name === subFundName);
}

// Helper function to format fund display name
export function formatFundDisplayName(
  mainFundName: string,
  subFundName: string,
  funds?: Fund[]
): string {
  if (!funds) {
    return `${mainFundName} - ${subFundName}`;
  }

  const mainFund = getFundByName(funds, mainFundName);
  const subFund = getSubFundDetails(funds, mainFundName, subFundName);

  if (mainFund && subFund) {
    return `${mainFund.name} - ${subFund.name} (${mainFund.code}-${subFund.code})`;
  }

  return `${mainFundName} - ${subFundName}`;
}

// Server action to fetch dropdown options from backend
export async function fetchDropdownOptions(): Promise<DropdownOptions> {
  const apiUrl = process.env.NEXT_PUBLIC_PROD_API_URL;
  // const apiUrl = process.env.NEXT_PUBLIC_DEV_API_URL;

  try {
    const fullApiUrl = `${apiUrl}/project/dropdown-options`;

    // Attempt to fetch from API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(fullApiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // credentials: "include",
      cache: "no-store", // Always fetch fresh data
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const apiData: ApiResponse = await response.json();

    if (apiData.success && apiData.data) {
      // Validate that funds have the expected structure
      if (apiData.data.funds && Array.isArray(apiData.data.funds)) {
        const isValidStructure = apiData.data.funds.every(
          (fund) =>
            fund.name &&
            fund.code &&
            Array.isArray(fund.subFunds) &&
            fund.subFunds.every((subFund) => subFund.name && subFund.code)
        );

        if (isValidStructure) {
          console.log("Successfully fetched dropdown options from API");
          return apiData.data;
        } else {
          console.warn(
            "API returned funds with invalid structure, using fallback options"
          );
        }
      } else {
        console.warn("API response missing funds data, using fallback options");
      }
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

// Server action to fetch sub funds for a specific main fund
export async function fetchSubFundsForMainFund(
  mainFundName: string
): Promise<SubFund[]> {
  try {
    // First try to get from full dropdown options
    const dropdownOptions = await fetchDropdownOptions();
    return getSubFundsForMainFund(dropdownOptions.funds, mainFundName);
  } catch (error) {
    console.warn("Error fetching sub funds, using fallback:", error);
    const fallbackOptions = getFallbackOptions();
    return getSubFundsForMainFund(fallbackOptions.funds, mainFundName);
  }
}
