import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup } from "firebase/auth";
import { auth, db, googleProvider, facebookProvider, twitterProvider, GithubProvider } from "../firebase.js";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useAuthStore } from "../store/authStore.js";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {

  const [formData, setFormData] = useState({
    username: "",
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ---- ALL YOUR HANDLERS (UNCHANGED) ----
  const handleGoogleSignup = async () => {
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

      toast.success("Signed up with Google", { theme: "dark" });
    } catch (err) {
      toast.error(err.message, { theme: "dark" });
    }
  };

  const handleFacebookSignUp = async () => {
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

      toast.success("Signed Up with Facebook", { theme: "dark" });
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

      toast.success("Signed up with X", { theme: "dark" });
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

      toast.success("Signed up with Github", { theme: "dark" });
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const newUser = userCredential.user;

      if (!newUser) {
        toast.error("Profile Already Exists!", { theme: "dark" });
        return;
      }

      await sendEmailVerification(newUser);

      await setDoc(doc(db, "users", newUser.uid), {
        username: formData.username,
        email: formData.email,
        uid: newUser.uid,
        emailVerified: false,
        createdAt: new Date()
      });

      navigate("/verify-email");

    } catch (err) {
      setError(err.message);
      toast.error("Error Doing the Operation!", { theme: "dark" });
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 px-4 font-serif">

      <div className="w-full max-w-[1550px] flex justify-center items-center">

        <form
          onSubmit={handleSubmit}
          className="bg-white w-full max-w-xs sm:max-w-sm md:max-w-md p-5 sm:p-6 rounded-lg shadow-md flex flex-col gap-3 sm:gap-4"
        >

          <h2 className="text-xl sm:text-2xl  text-center mb-2">
            Sign Up
          </h2>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-2 border rounded-md text-sm sm:text-base focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-2 border rounded-md text-sm sm:text-base focus:outline-none"
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

          <button className="mt-2 bg-green-600 text-white py-2 rounded-2xl text-sm sm:text-base hover:bg-green-700 ">
            Sign Up
          </button>

          <button
            type="button"
            onClick={handleGoogleSignup}
             className="bg-white-300 py-2 rounded-2xl text-sm sm:text-base hover:bg-gray-100 border border-gray-300 flex gap-2.5  justify-center-safe items-center"
          >
            Continue with Google
            <img className="h-4.5 w-4.5 " src="google.svg" alt="" />
          </button>

          <button
            onClick={handleFacebookSignUp}
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

          <p
            onClick={() => navigate("/login")}
            className="text-xs sm:text-sm text-blue-600 cursor-pointer text-center hover:underline"
          >
            Already have an account? Login!
          </p>

        </form>
      </div>
    </div>
  );
};

export default Signup;