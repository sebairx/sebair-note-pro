const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

async function register(data) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function login(email, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return await res.json();
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export { register, login };