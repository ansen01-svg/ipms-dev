// Types for API response matching backend
export interface DropdownOptions {
  funds: { name: string }[];
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

// Fallback options
function getFallbackOptions(): DropdownOptions {
  return {
    funds: [
      { name: "Central Fund" },
      { name: "State Fund" },
      { name: "Private Fund" },
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
      console.log("Successfully fetched dropdown options from API");
      return apiData.data;
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
