import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthStore } from "../store/authStore";

import { doc, setDoc, getDoc} from "firebase/firestore";
import { db } from "../firebase";



import { signInWithPopup } from "firebase/auth";

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

  // Redirect logged-in users to homepage
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

      // Create Firestore profile only on first login
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
      navigate("/"); // protected homepage

    } catch (err) {
      toast.error(err.message, { theme: "dark" });
      console.error(err);
    }
  };





  const handleTwitterLogin = async () => {
    try {

      const result = await signInWithPopup(auth, twitterProvider);


      const user = result.user;

      console.log(user)
      //check for is user is verified in X or not



      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // Create Firestore profile only on first login
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
      navigate("/"); // protected homepage

    } catch (err) {
      toast.error(err.message, { theme: "dark" });
      console.error(err);
    }
  };



  const handleGithubLogin = async () => {
    try {

      const result = await signInWithPopup(auth, GithubProvider);


      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      // Create Firestore profile only on first login
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
      navigate("/"); // protected homepage

    } catch (err) {
      toast.error(err.message, { theme: "dark" });
      console.error(err);
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
      // Firebase login
       await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      toast.success("Logged in successfully!", { theme: "dark" });

      // proceed with navigation / state update here

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
        message = "Account disabled. Contact support.";
        break;
      case "auth/too-many-requests":
        message = "Too many attempts. Try later.";
        break;
      default:
        message = err.message;
    }
      // setError(message);

      

      toast.error("Invalid Credentials!", message , {
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

      {/* <ToastContainer
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
      /> */}

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
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="border border-gray-300 bg-gray-300 py-2 rounded-md hover:bg-gray-400 transition hover:cursor-pointer hover:font-semibold"
        >
          Continue with Google
        </button>

        <button
          onClick={handleFacebookLogin}
          className="bg-blue-600 text-white py-2 rounded-md hover:cursor-pointer hover:font-semibold"
        >
          Continue with Facebook
        </button>

        <button
          onClick={handleTwitterLogin}
          className="bg-gray-600 text-white py-2 rounded-md hover:cursor-pointer hover:font-semibold hover:bg-gray-700"
        >
          Continue with X
        </button>


        <button

          onClick={handleGithubLogin}
          className="bg-gray-800 text-white py-2 rounded-md hover:cursor-pointer hover:font-semibold hover:bg-gray-900"
        >
          Continue with Github

        </button>



        <p
          onClick={() => navigate("/signup")}
          className="text-sm text-blue-600 cursor-pointer text-center hover:font-semibold"
        >
          Don't have an account? Sign Up!
        </p>

      </form>
    </div>
  );
};

export default Login;
