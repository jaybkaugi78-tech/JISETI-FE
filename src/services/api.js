export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("jiseti_token");

  const response = await fetch(`http://127.0.0.1:5000${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("jiseti_token");
    localStorage.removeItem("jiseti_user");

    window.location.href = "/login";

    throw new Error("Session expired");
  }

  return response;
}