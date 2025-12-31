import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useAuthStore } from "./store/authStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import './App.css'

import Navbar from './components/Navbar'



import HomePage from './pages/HomePage.jsx'
import Signup from "./pages/Signup.jsx"
import Login from "./pages/Login.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx"


import { Routes, Route, BrowserRouter } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";


function App() {

  const setUser = useAuthStore((state) => state.setUser)
  const setLoading = useAuthStore((state) => state.setLoading)



  useEffect(() => {

    const unsubsribe = onAuthStateChanged(auth, (user) => {
      setUser(user ? user : null);
      setLoading(false);
    })

    return () => unsubsribe();

  }, [setUser, setLoading])





  return (
    <>
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

      <div className='bg-green-100 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]' >

        <BrowserRouter>
          <Navbar />

          <Routes>


            <Route path="/signup" element={<Signup />} />

            <Route path="/login" element={<Login />} />

            <Route path="/" element={<ProtectedRoute>  <HomePage /> </ProtectedRoute>} />

            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/verify-email" element={<VerifyEmail />} />


          </Routes>
        </BrowserRouter>


      </div>


      {/* <Footer/> */}


    </>
  )
}

export default App
