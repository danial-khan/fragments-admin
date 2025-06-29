import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiFetch from "../../../utils/axios";
import { useAuthContext } from "../../../context/authContext";

const LoginPage = () => {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    let hasError = false;

    if (!email) {
      setEmailError("Email is required.");
      hasError = true;
    }

    if (!password) {
      setPasswordError("Password is required.");
      hasError = true;
    }

    if (hasError) return;
    setIsLoading(true);
    apiFetch
      .post("/admin/login", { email, password })
      .then((res) => {
        setUser(res.data.user);
        navigate("/dashboard");
      })
      .catch(() => {
        toast("Invalid email or password", { type: "error" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 items-center justify-center">
        <img
          src="/assets/feather.png"
          alt="favicon"
          width={100}
          height={100}
          className="flex self-center justify-self-center my-4"
        />
        <h2 className="text-2xl font-semibold text-center text-semiSecondary">
          Fragments Admin
        </h2>
        <h4 className="text-xl text-center text-secondary my-2">
          Please login below
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                emailError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-primary"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                passwordError
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-primary"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-semiSecondary transition"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
