// export const logout = async (): Promise<void> => {
//   try {
//     const response = await fetch(
//       // `${process.env.NEXT_PUBLIC_PROD_API_URL}/logout`,
//       `http://localhost:5000/api/auth/logout`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Logout failed with status: ${response.status}`);
//     }

//     // Clear any local storage data
//     localStorage.clear();
//     sessionStorage.clear();

//     // Redirect to login page
//     window.location.replace("/login");
//   } catch (error) {
//     console.error("Logout error:", error);

//     // Even if API fails, clear local data and redirect
//     localStorage.clear();
//     sessionStorage.clear();
//     window.location.replace("/login");
//   }
// };

import { clearAuthData } from "./auth-local";

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/auth/logout`,
      // `${process.env.NEXT_PUBLIC_DEV_API_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.warn(`Logout API failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("Logout API error:", error);
  } finally {
    // Always clear local data regardless of API response
    clearAuthData();

    // Redirect to login page
    window.location.replace("/login");
  }
};
