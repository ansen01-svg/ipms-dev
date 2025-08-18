// // Temporary function for logout
// const clearUserData = (): void => {
//   // Clear cookies
//   const cookies = document.cookie.split(";");
//   cookies.forEach((cookie) => {
//     const eqPos = cookie.indexOf("=");
//     const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

//     // Clear cookie for current domain
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

//     // Clear cookie for current domain with leading dot
//     document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;

//     // Clear cookie for parent domain (if subdomain)
//     const hostnameParts = window.location.hostname.split(".");
//     if (hostnameParts.length > 2) {
//       const parentDomain = "." + hostnameParts.slice(-2).join(".");
//       document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${parentDomain}`;
//     }
//   });
// };

// export const logout = (): void => {
//   try {
//     clearUserData();
//     // Use window.location.replace instead of router.replace to force page refresh
//     // This ensures complete cleanup of all React state, caches, and stale data
//     window.location.replace("/login");
//   } catch (error) {
//     console.error("Error during logout:", error);
//     // Fallback: Still force page refresh even if clearUserData fails
//     window.location.replace("/login");
//   }
// };

export const logout = async (): Promise<void> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PROD_API_URL}/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`);
    }

    // Clear any local storage data
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page
    window.location.replace("/login");
  } catch (error) {
    console.error("Logout error:", error);

    // Even if API fails, clear local data and redirect
    localStorage.clear();
    sessionStorage.clear();
    window.location.replace("/login");
  }
};
