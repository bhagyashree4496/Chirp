import React, { useState } from "react";
import { loginapi, signupapi } from "../api/api";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const [activeTab, setActiveTab] = useState("signIn");

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <h1 className="flex-1 text-center text-primary font-bold text-4xl mb-8">
        Chirp
      </h1>
      <div className="max-w-md w-[50vw] mx-auto p-6 border rounded-lg shadow-lg ">
        {/* Tabs */}
        <div className="tabs mb-4">
          <a
            className={`tab tab-bordered ${
              activeTab === "signIn" ? "tab-active" : ""
            }`}
            onClick={() => handleTabSwitch("signIn")}
          >
            Log In
          </a>
          <a
            className={`tab tab-bordered ${
              activeTab === "register" ? "tab-active" : ""
            }`}
            onClick={() => handleTabSwitch("register")}
          >
            Sign Up
          </a>
        </div>

        {/* Forms */}
        {activeTab === "signIn" ? <SignInForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

const SignInForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser } = useUser();
  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await loginapi(loginDetails);
      setUser(user);
      localStorage.setItem("chirpuser", JSON.stringify(user));

      navigate("/chats");
      toast.success("Login successful!");
    } catch (er) {
      toast.error(`Invalid email or password!,${er.message}`);
    }
    setLoading(false);
  };
  return (
    <>
      {loading ? (
        <span className="loading loading-ring loading-lg"></span>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input input-bordered w-full"
              placeholder="Enter your email"
              value={loginDetails.email}
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, email: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              onChange={(e) =>
                setLoginDetails({ ...loginDetails, password: e.target.value })
              }
              value={loginDetails.password}
              type="password"
              id="password"
              name="password"
              className="input input-bordered w-full"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">
            Sign In
          </button>
        </form>
      )}
    </>
  );
};

const RegisterForm = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [signupDetails, setsignupDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signupapi(signupDetails);
      setUser(user);
      localStorage.setItem("chirpuser", JSON.stringify(user));
      toast.success("Sign up is successful !");
      navigate("/chats");
    } catch (er) {
      toast.error(er.message);
    }
    setLoading(false);
  };
  return (
    <>
      {loading ? (
        <span className="loading loading-ring loading-lg"></span>
      ) : (
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold">
              Full Name
            </label>
            <input
              value={signupDetails.name}
              type="text"
              id="name"
              name="name"
              className="input input-bordered w-full"
              placeholder="Enter your full name"
              onChange={(e) => setsignupDetails({ name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>
            <input
              value={signupDetails.email}
              type="email"
              id="email"
              name="email"
              className="input input-bordered w-full"
              placeholder="Enter your email"
              onChange={(e) =>
                setsignupDetails({ ...signupDetails, email: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              value={signupDetails.password}
              type="password"
              id="password"
              name="password"
              className="input input-bordered w-full"
              placeholder="Enter your password"
              onChange={(e) =>
                setsignupDetails({ ...signupDetails, password: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">
            Register
          </button>
        </form>
      )}
    </>
  );
};

export default Home;
