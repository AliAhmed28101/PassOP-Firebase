import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email", { theme: "dark" });
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!", { theme: "dark" });
      setEmail("");
    } catch (err) {
      toast.error(err.message, { theme: "dark" });
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 px-4">

      <div className="w-full max-w-[1550px] flex justify-center items-center">
        <ToastContainer />

        <form
          onSubmit={handleReset}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col gap-4"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
            Forgot Password
          </h2>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm sm:text-base"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 sm:py-2.5 rounded-md hover:bg-green-500 transition text-sm sm:text-base"
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ForgotPassword;