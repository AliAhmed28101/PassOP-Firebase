import { useState } from "react";
import { auth } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { getIdToken, sendEmailVerification, signOut } from "firebase/auth";

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

  const handleBack = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      toast.error("Failed to sign out. Please try again.", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const userEmail = auth.currentUser?.email;

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 px-4">

      <ToastContainer theme="dark" />

      <div className="w-full max-w-[1550px] flex justify-center items-center">

        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col gap-3 sm:gap-4">

          {/* Email icon */}
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-3 sm:p-4">
              <svg
                className="w-7 h-7 sm:w-8 sm:h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-center">
            Verify Your Email
          </h2>

          {/* Show which email the link was sent to */}
          {userEmail && (
            <p className="text-xs sm:text-sm text-center text-gray-500 break-all">
              Sent to:{" "}
              <span className="font-medium text-gray-700">{userEmail}</span>
            </p>
          )}

          <p className="text-xs sm:text-sm text-gray-600 text-center">
            A verification link has been sent to your email. Please verify to continue.
          </p>

          <button
            onClick={handleCheckVerification}
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded-md text-sm sm:text-base hover:bg-green-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Checking..." : "I have verified"}
          </button>

          <button
            onClick={handleResend}
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded-md text-sm sm:text-base hover:bg-blue-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Resend Verification Email
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Back / change account button */}
          <button
            onClick={handleBack}
            disabled={loading}
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-600 py-2 rounded-md text-sm sm:text-base hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Use a different account
          </button>

        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;