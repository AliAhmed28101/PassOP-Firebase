import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthStore } from "../store/authStore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const user = useAuthStore((state) => state.user);
  const setError = useAuthStore((state) => state.setError);
  const navigate = useNavigate();


  const ref = useRef()
  const passwordRef = useRef()

  // Redirect logged-in users to homepage
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showPassword = () => {
    const input = passwordRef.current;
    const icon = ref.current;

    if (input.type === "password") {
      input.type = "text";
      icon.src = "/eye.png";
    } else {
      input.type = "password";
      icon.src = "/eyecross.png";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase login
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
    } catch (err) {
      // Set error in Zustand store
      setError(err.message);

      // Show toast notification
      toast.error("Invalid Credentials!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-80 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border border-black-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          required
        />
        <div className="relative w-full">
          <input
            ref={passwordRef}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-black-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:border-indigo-500"
            required
          />
          <span className='absolute top-0 right-0 text-black'>
            <img ref={ref} className='p-1 py-2 m-1 cursor-pointer  ' width={25} src="/eyecross.png" alt="" onClick={showPassword} /></span>


        </div>


        <p
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-blue-600 cursor-pointer text-center"
        >
          Forgot Password?
        </p>


        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-500 transition hover:cursor-pointer"
        >
          Login
        </button>
        <p
          onClick={() => navigate("/signup")}
          className="text-sm text-blue-600 cursor-pointer text-center"
        >
          Don't have an account? Sign Up!
        </p>

      </form>
    </div>
  );
};

export default Login;
