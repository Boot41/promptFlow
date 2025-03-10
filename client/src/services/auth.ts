const AUTH_BASE_URL = import.meta.env.VITE_BASE_URL + "/authentication";

interface AuthResponse {
  tokens: {
    access: string;
    refresh: string;
  };
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// Helper function to handle errors
const handleError = async (response: Response) => {
  const errorData = await response.json();
  throw new Error(errorData.message || "Something went wrong");
};

// Signup function
export const signup = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) await handleError(response);

    const data = await response.json();

    return {
      tokens: {
        access: data.access,
        refresh: data.refresh,
      },
      user: data.user,
    };
  } catch (error) {
    console.error("Signup Error:", error);
    throw error;
  }
};

// Login function
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_BASE_URL}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) await handleError(response);

    const data = await response.json();

    // Save tokens securely (consider using httpOnly cookies)
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));

    return {
      tokens: {
        access: data.access,
        refresh: data.refresh,
      },
      user: data.user,
    };
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      console.warn("No refresh token found");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");

    const response = await fetch(`${AUTH_BASE_URL}/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) await handleError(response);

    // Clear tokens on logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};
