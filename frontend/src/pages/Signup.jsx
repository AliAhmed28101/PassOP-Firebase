import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db, googleProvider, facebookProvider, twitterProvider, GithubProvider } from "../firebase.js";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useAuthStore } from "../store/authStore.js";

import { signInWithPopup } from "firebase/auth";
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

  //Redirect after successful signup (auth-driven)
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


  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      //  Create Firestore profile only on first signup
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

      toast.success("Signed Up with Facebook", { theme: "dark" });
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

      toast.success("Signed up with X", { theme: "dark" });
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

      toast.success("Signed up with Github", { theme: "dark" });
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      //for username collection and data saving in database 
      const newUser = userCredential.user


      if(!newUser){

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
      }
      )

      navigate("/verify-email")

      console.log("User and firestore profile created successfully")

    } catch (err) {
      setError(err.message);
      toast.error("Error Doing the Operation!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* 
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
      /> */}

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-sm p-6 rounded-lg shadow-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Sign Up</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
        <button
          type="submit"
          className="mt-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition hover:cursor-pointer"
        >
          Sign Up

        </button>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="border border-gray-300 bg-gray-300 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-400 hover:cursor-pointer hover:font-semibold"
        >
          Continue with Google
        </button>

        <button
          onClick={handleFacebookSignUp}
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
          onClick={() => navigate("/login")}
          className="text-sm text-blue-600 cursor-pointer text-center hover:font-semibold"
        >
          Already have an account? Login!

        </p>

      </form>

    </div>
  );

};

export default Signup;