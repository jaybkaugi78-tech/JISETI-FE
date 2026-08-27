export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:5000";

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("jiseti_token");

  const isFormData =
    options.body instanceof FormData;

  const headers = {
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...(!isFormData && {
      "Content-Type": "application/json",
    }),
    ...options.headers,
  };

  const response = await fetch(
    `${API_BASE_URL}${url}`,
    {
      ...options,
      headers,
    }
  );

  if (response.status === 401) {
    localStorage.removeItem("jiseti_token");
    localStorage.removeItem("jiseti_user");

    window.location.href = "/login";

    throw new Error("Session expired");
  }

  return response;
}