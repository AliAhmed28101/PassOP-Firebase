import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInAnonymously, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthStore } from "../store/authStore";

import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import { googleProvider, facebookProvider, twitterProvider, GithubProvider } from "../firebase";

import { toast } from "react-toastify";
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

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "Anonymous",
          email: user.email,
          uid: user.uid,
          createdAt: new Date(),
          provider: "google",
        });
      }

      toast.success("Logged in with Google", { theme: "dark" });
    } catch (err) {
      toast.error(err.message, { theme: "dark" });
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "Facebook User",
          email: user.email,
          uid: user.uid,
          provider: "facebook",
          createdAt: new Date(),
        });
      }

      toast.success("Logged in with Facebook", { theme: "dark" });
      navigate("/");
    } catch (err) {
      toast.error(err.message, { theme: "dark" });
    }
  };

  const handleTwitterLogin = async () => {
    try {
      const result = await signInWithPopup(auth, twitterProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "X User",
          email: user.email,
          uid: user.uid,
          provider: "X",
          createdAt: new Date(),
        });
      }

      toast.success("Logged in with X", { theme: "dark" });
      navigate("/");
    } catch (err) {
      toast.error(err.message, { theme: "dark" });
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, GithubProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName || "Github User",
          email: user.email,
          uid: user.uid,
          provider: "Github",
          createdAt: new Date(),
        });
      }

      toast.success("Logged in with Github", { theme: "dark" });
      navigate("/");
    } catch (err) {
      toast.error(err.message, { theme: "dark" });
    }
  };

  const handleGuestLogin = async () => {
    try {
      const result = await signInAnonymously(auth);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          isAnonymous: true,
          provider: "anonymous",
          createdAt: new Date(),
        });
      }

      toast.success("You are browsing as a guest", { theme: "dark" });
      navigate("/");
    } catch (err) {
      toast.error(err.message, { theme: "dark" });
    }
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
      await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      toast.success("Logged in successfully!", { theme: "dark" });

    } catch (err) {
      let message = "Something went wrong!";
      switch (err.code) {
        case "auth/invalid-credential":
          message = "Invalid password!";
          break;
        case "auth/user-not-found":
          message = "Email not registered!";
          break;
        case "auth/invalid-email":
          message = "Invalid email format!";
          break;
        case "auth/user-disabled":
          message = "Account disabled.";
          break;
        case "auth/too-many-requests":
          message = "Too many attempts.";
          break;
        default:
          message = err.message;
      }

      setError(message);

      toast.error("Invalid Credentials!", {
        theme: "dark",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 px-4 font-serif ">

      <div className="w-full max-w-[1550px] flex justify-center items-center">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md flex flex-col gap-3 sm:gap-4"
        >

          <h2 className="text-xl sm:text-2xl text-center mb-2">
            Login
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-md px-3 py-2 text-sm sm:text-base focus:outline-none"
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
              className="w-full border rounded-md px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none"
              required
            />
            <span className='absolute top-1/2 -translate-y-1/2 right-3'>
              <img
                ref={ref}
                className='cursor-pointer w-5 sm:w-6'
                src="/eyecross.png"
                alt=""
                onClick={showPassword}
              />
            </span>
          </div>

          <p
            onClick={() => navigate("/forgot-password")}
            className="text-xs sm:text-sm text-blue-600 cursor-pointer text-center"
          >
            Forgot Password?
          </p>

          <button className="bg-green-600 text-white py-2 rounded-2xl text-sm sm:text-base  hover:bg-green-700">
            Login
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="bg-white-300 py-2 rounded-2xl text-sm sm:text-base hover:bg-gray-100 border border-gray-300 flex gap-2.5  justify-center-safe items-center"
          >
            Continue with Google
            <img className="h-4.5 w-4.5 " src="google.svg" alt="" />
          </button>

          <button
            onClick={handleFacebookLogin}
            className="bg-blue-600 text-white py-2 rounded-2xl text-sm sm:text-base hover:bg-blue-700 flex gap-2 justify-center-safe items-center"
          >
            Continue with Facebook
                        <img className="h-4.5 w-4.5 invert" src="facebook.svg" alt="" />

          </button>

          <button
            onClick={handleTwitterLogin}
            className="bg-sky-400 text-white py-2 rounded-2xl gap-3 text-sm sm:text-base hover:bg-sky-500 flex justify-center-safe items-center "
          >
            Continue with Twitter

                                    <img className="h-4.5 w-4.5 invert" src="twitter.svg" alt="" />

          </button>

          <button
            onClick={handleGithubLogin}
            className="bg-gray-800 text-white py-2 rounded-2xl text-sm sm:text-base flex items-center justify-center-safe gap-3 hover:bg-gray-900"
          >
            Continue with Github
                                                <img className="h-4.5 w-4.5 invert" src="github.svg" alt="" />

          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="bg-purple-500 text-white py-2 rounded-2xl text-sm sm:text-base flex justify-center-safe items-center gap-2 hover:bg-purple-600"
          >
            Continue as Guest

                                                <img className="h-4.5 w-4.5 invert" src="guest.svg" alt="" />

          </button>

          <p
            onClick={() => navigate("/signup")}
            className="text-xs sm:text-sm text-blue-600 cursor-pointer text-center hover:underline"
          >
            Don't have an account? Sign Up!
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;