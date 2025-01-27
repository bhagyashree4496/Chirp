import { toast } from "react-toastify";

const url = "https://chirp-delta-dun.vercel.app";
export const loginapi = async (logindetails) => {
  try {
    const res = await fetch(`${url}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logindetails),
    });

    if (!res.ok) {
      // Handle non-2xx HTTP responses (e.g., 400, 500, etc.)
      const errorData = await res.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Handle network or other unexpected errors
    console.error("Login Error:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
};

export const signupapi = async (signindetails) => {
  try {
    const res = await fetch(`${url}/api/user/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signindetails),
    });

    if (!res.ok) {
      // Handle non-2xx HTTP responses (e.g., 400, 500, etc.)
      const errorData = await res.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Handle network or other unexpected errors
    console.error("Signup Error:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
};
export const GetUsersApi = async (query, token) => {
  try {
    const res = await fetch(`${url}/api/user?search=${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.log("hello");
      throw new Error("Unauthorized: Please login again");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching protected data:", error);
    throw error;
    // Optionally, redirect to login page or handle token expiration
  }
};
export const GetAllChats = async (token) => {
  try {
    const res = await fetch(`${url}/api/chats`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Unauthorized: Please login again");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching protected data:", error);
  }
};
export const CreateChat = async (id, token) => {
  try {
    const res = await fetch(`${url}/api/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ otherUserId: id }),
    });

    if (!res.ok) {
      // Handle non-2xx HTTP responses (e.g., 400, 500, etc.)
      const errorData = await res.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Handle network or other unexpected errors
    console.error("Signup Error:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
};
export const CreateGroupChat = async (name, users, token) => {
  try {
    const res = await fetch(`${url}/api/chats/group`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, users }),
    });

    if (!res.ok) {
      // Handle non-2xx HTTP responses (e.g., 400, 500, etc.)
      const errorData = await res.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Handle network or other unexpected errors
    console.error("Signup Error:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
};
export const UpdateGrpName = async (chatId, chatName, token) => {
  try {
    const res = await fetch(`${url}/api/chats/grouprename`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId, chatName }),
    });

    if (!res.ok) {
      // Handle non-2xx HTTP responses (e.g., 400, 500, etc.)
      const errorData = await res.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Handle network or other unexpected errors
    console.error("Signup Error:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
};
export const RemoeUserGroup = async (chatId, userId, token) => {
  try {
    const res = await fetch(`${url}/api/chats/groupremoveuser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId, userId }),
    });

    if (!res.ok) {
      // Handle non-2xx HTTP responses (e.g., 400, 500, etc.)
      const errorData = await res.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Handle network or other unexpected errors
    console.error("Signup Error:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
};
export const AddUserGroup = async (chatId, userId, token) => {
  try {
    const res = await fetch(`${url}/api/chats/groupadduser`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId, userId }),
    });

    if (!res.ok) {
      // Handle non-2xx HTTP responses (e.g., 400, 500, etc.)
      const errorData = await res.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Handle network or other unexpected errors
    console.error("Signup Error:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
};
export const CreateMessage = async (content, chatId, token) => {
  try {
    const res = await fetch(`${url}/api/messages/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, chatId }),
    });

    if (!res.ok) {
      // Handle non-2xx HTTP responses (e.g., 400, 500, etc.)
      const errorData = await res.json();
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    // Handle network or other unexpected errors
    console.error("Signup Error:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
};
export const GetAllMessages = async (chatId, token) => {
  try {
    const res = await fetch(`${url}/api/messages/${chatId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Unauthorized: Please login again");
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error("Error fetching protected data:", error);
  }
};
