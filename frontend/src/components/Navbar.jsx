import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile")
  }

  return (
    <nav className="bg-slate-800 text-white w-full flex justify-center">

      <div className="w-full max-w-[1550px] flex flex-col sm:flex-row justify-between items-center px-4 py-3 sm:py-4 gap-3 sm:gap-0">

        <div className="logo font-bold text-lg sm:text-xl md:text-2xl text-center sm:text-left">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </div>

        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4">

          {!user && (
            <p className="flex items-center justify-center gap-2 font-semibold ring-white ring-1 bg-green-700 rounded-4xl px-3 py-2 text-xs sm:text-sm md:text-base text-center">
              Your Trust is Our Priority!
            </p>
          )}

          {user && location.pathname === "/" && (
            <button
              onClick={handleProfile}
              className="font-bold cursor-pointer ring-white ring-1 bg-green-700 rounded-3xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base hover:bg-green-600"
            >
              Profile
            </button>
          )}

          {user && location.pathname === "/" && (
            <button
              onClick={handleLogout}
              className="font-bold cursor-pointer ring-white ring-1 bg-red-600 rounded-3xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base hover:bg-red-500"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;