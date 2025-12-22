import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase.js";
import { setDoc, doc } from "firebase/firestore"; 
import { useAuthStore } from "../store/authStore.js";

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
      navigate("/login");
    }
  }, [user, navigate]);




  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
      await setDoc(doc(db, "users", newUser.uid), {
        username: formData.username,
        email: formData.email,
        uid: newUser.uid,
        createdAt: new Date()
      
      }
    )
      console.log("User and firestore profile created successfully")

    } catch (err) {
      setError(err.message);
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
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

         <p
          onClick={() => navigate("/login")}
          className="text-sm text-blue-600 cursor-pointer text-center"
        >
          ALready have an account? Login!
        </p>  
      </form>

      
    </div>
  );
};

export default Signup;
