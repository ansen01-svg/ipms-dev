export const setCookie = (
  name: string,
  value: string,
  options: {
    maxAge?: number;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
    httpOnly?: boolean;
    path?: string;
  } = {}
) => {
  const {
    maxAge = 24 * 60 * 60, // 24 hours default
    secure = true,
    sameSite = "strict",
    path = "/",
  } = options;

  let cookieString = `${name}=${value}; path=${path}; max-age=${maxAge}`;

  if (secure) cookieString += "; secure";
  if (sameSite) cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};
