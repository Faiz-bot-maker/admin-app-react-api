import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Hook untuk akses auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cek status auth dari localStorage
  const checkAuthStatus = () => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const userData = localStorage.getItem("user");
    
    if (authStatus && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (error) {
        // Bersihkan data jika tidak valid
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  // Login - simpan data user
  const login = (userData) => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  // Logout - bersihkan data
  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    // Cek auth saat komponen dimuat
    checkAuthStatus();

    // Listener untuk multi-tab support
    const handleStorageChange = (e) => {
      if (e.key === "isAuthenticated" || e.key === "user") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 