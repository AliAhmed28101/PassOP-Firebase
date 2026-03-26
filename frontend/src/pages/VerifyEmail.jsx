
import { useState } from "react";
import { auth } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { getIdToken, sendEmailVerification } from "firebase/auth";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckVerification = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;

      await user.reload();

      if (!user.emailVerified) {
        toast.info("Email not verified yet. Please check your inbox.", { theme: "dark" });
        return;
      }

      await getIdToken(user, true);

      await updateDoc(doc(db, "users", user.uid), {
        emailVerified: true,
      });

      toast.success("Email verified! Redirecting...", { theme: "dark" });

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      toast.error(err.message, { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email resent!", { theme: "dark" });
    } catch (err) {
      toast.info("Can't send the verification email, try after some minutes", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 px-4">

      <ToastContainer theme="dark" />

      <div className="w-full max-w-[1550px] flex justify-center items-center">

        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col gap-3 sm:gap-4">

          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
            Verify Your Email
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 text-center">
            A verification link has been sent to your email. Please verify to continue.
          </p>

          <button
            onClick={handleCheckVerification}
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded-md text-sm sm:text-base hover:bg-green-500 transition"
          >
            {loading ? "Checking..." : "I have verified"}
          </button>

          <button
            onClick={handleResend}
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-md text-sm sm:text-base hover:bg-blue-500 transition"
          >
            Resend Verification Email
          </button>

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;