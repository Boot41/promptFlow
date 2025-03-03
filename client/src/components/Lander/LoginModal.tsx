import React, { useState } from "react";
import Modal from "../UI/Modal";
import { login } from "../../services/auth"; // Import login function
import { useNavigate } from "react-router-dom";

type LoginModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  onLoginSuccess: (user: any) => void;
  onOpenSignup: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  closeModal,
  onLoginSuccess,
  onOpenSignup,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);

      // Save tokens to local storage
      localStorage.setItem("accessToken", data.tokens.access);
      localStorage.setItem("refreshToken", data.tokens.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      onLoginSuccess(data.user); // Notify parent component
      closeModal();
      navigate("/dashboard"); // Navigate to dashboard after login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} closeModal={closeModal}>
      {{
        title: "Sign in to our platform",
        body: (
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login to your account
            </button>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent page reload
                  closeModal(); // Close login modal
                  onOpenSignup(); // Open signup modal
                }}
                className="text-blue-700 hover:underline dark:text-blue-500 cursor-pointer"
              >
                Create account
              </a>
            </div>
          </form>
        ),
      }}
    </Modal>
  );
};

export default LoginModal;