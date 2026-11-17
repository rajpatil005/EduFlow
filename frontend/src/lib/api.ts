
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token
                    ? { Authorization: `Bearer ${token}` }
                    : {}),
                ...options.headers,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}
