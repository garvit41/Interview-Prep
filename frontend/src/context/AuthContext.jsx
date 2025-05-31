import { createContext, useContext, useState, useEffect } from "react";
import { getUserProfile } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(localStorage.getItem("token") || null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
			fetchUserProfile();
		} else {
			setLoading(false);
		}
	}, []);


	const fetchUserProfile = async () => {
		try {
			const data = await getUserProfile(logout); // ✅ Pass logout here
			// console.log("🎯 /me API response:", data);
			if (data.user) {
				// console.log("✅ Setting user to:", data.user);
				setUser(data.user);
			}
		} catch (error) {
			console.error("❌ Error fetching user profile:", error);
		} finally {
			setLoading(false);
		}
	};

	const login = (newToken) => {
		localStorage.setItem("token", newToken);
		setToken(newToken);
		fetchUserProfile();
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		setUser(null);
	};

	return <AuthContext.Provider value={{ token, user, login, logout, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		console.error("useAuth must be used within an AuthProvider!");
		return { token: null, user: null, login: () => {}, logout: () => {}, loading: true };
	}
	return context;
};
