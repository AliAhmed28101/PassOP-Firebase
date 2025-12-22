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

  return (
    <nav className="bg-slate-800 text-white">
      <div className="flex justify-around items-center px-4 py-4 mycontainer">
        
        <div className="logo font-bold text-2xl">
          <span className="text-green-500">&lt;</span>
          Pass
          <span className="text-green-500">OP/&gt;</span>
        </div>

        <ul>
          <li className="flex gap-6">
            <Link
              to="/"
              className="hover:font-bold hover:text-green-500 transition-all"
            >
              Home
            </Link>

            <Link
              to="#"
              className="hover:font-bold hover:text-green-500 transition-all"
            >
              About
            </Link>

            <Link
              to="#"
              className="hover:font-bold hover:text-green-500 transition-all"
            >
              Contact
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center gap-2 cursor-pointer ring-white ring-1 bg-green-600 rounded-3xl px-2 hover:bg-green-500">
            <span className="invert w-12">
              <img className="p-1" src="/github.svg" alt="Github" />
            </span>
            <span className="font-bold">Github</span>
          </button>

          {user && location.pathname === "/" && (
            <button
              onClick={handleLogout}
              className=" font-bold cursor-pointer ring-white ring-1 bg-red-600 rounded-3xl px-4  py-3 hover:bg-red-500"
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
