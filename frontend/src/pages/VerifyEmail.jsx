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

      // Reload user to get latest emailVerified status
      await user.reload();



      //  Check verification
      if (!user.emailVerified) {

        toast.info("Email not verified yet. Please check your inbox.", { theme: "dark" });
        return;
      }
      // setting the emailverified: true if email is verified by the user!
      console.log(auth.currentUser)

      //to hard refresh firebase token so it can receive true value instead of false for emailverification
      await getIdToken(user, true);

      await updateDoc(doc(db, "users", user.uid), {
        emailVerified: true,
      });

      toast.success("Email verified! Redirecting...", { theme: "dark" });
      //redirecting to homepage
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }


    catch (err) {
      console.log(err)
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

      console.log(err)
      toast.info("Can't send the verification email, try after some minutes", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="h-screen flex items-center justify-center bg-gray-100">

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


      <div className="bg-white p-8 rounded-lg shadow-md w-96 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-center">Verify Your Email</h2>
        <p className="text-sm text-gray-600 text-center">
          A verification link has been sent to your email. Please verify to continue.
        </p>

        <button
          onClick={handleCheckVerification}
          disabled={loading}
          className="bg-green-600 text-white py-2 rounded-md hover:bg-green-500 transition"
        >
          {loading ? "Checking..." : "I have verified"}
        </button>

        <button
          onClick={handleResend}
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-500 transition"
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;