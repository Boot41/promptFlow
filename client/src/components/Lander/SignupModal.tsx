import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../UI/Modal"; // Common Modal component
import { signup } from "../../services/auth";

interface SignupModalProps {
  isOpen: boolean;
  closeModal: () => void;
  onLoginSuccess: (user: { id: number; username: string; email: string }) => void;
}

interface SignupResponse {
  user: { id: number; username: string; email: string };
  tokens: { access: string; refresh: string };
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, closeModal, onLoginSuccess }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const data: SignupResponse = await signup(username, email, password);

      // Save tokens to local storage & auto-login
      localStorage.setItem("accessToken", data.tokens.access);
      localStorage.setItem("refreshToken", data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLoginSuccess(data.user); // Notify parent component
      closeModal();
      navigate("/dashboard"); // Navigate to dashboard after signup
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      {{
        title: "Create an account",
        body: (
          <form className="space-y-4" onSubmit={handleSignupSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="username"
                required
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700"
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="min 8 characters"
                minLength={8}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Sign up
            </button>
          </form>
        ),
      }}
    </Modal>
  );
};

export default SignupModal;
