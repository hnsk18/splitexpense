const API_URL = "http://localhost:3000";

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...options.headers,
            },
        }
    );
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "API request failed");
    }

    return response.json();
}