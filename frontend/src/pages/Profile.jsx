import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { auth, db } from "../firebase";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          toast.error("Profile not found");
          return;
        }

        setProfile(snap.data());
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setNewUsername(profile.username);
    }
  }, [profile]);

  const handleUsernameUpdate = async () => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        username: newUsername,
      });

      setProfile((prev) => ({ ...prev, username: newUsername }));
      setEditingUsername(false);
      toast.success("Username updated");
    } catch {
      toast.error("Failed to update username");
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "This will permanently delete your account and all data. This cannot be undone. Continue?"
    );

    if (!confirm) return;

    try {
      const uid = user.uid;

      await deleteDoc(doc(db, "users", uid));
      await deleteUser(auth.currentUser);
      useAuthStore.getState().logout();

      toast.success("Account deleted");
      navigate("/signup");
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        toast.error("Please re-login before deleting your account.");
      } else {
        toast.error("Failed to delete account");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        Loading…
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-100 px-4 py-6">

      <div className="w-full max-w-[1550px] flex justify-center">

        <div className="bg-white shadow-lg rounded-lg p-5 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg">

          <h2 className="text-xl sm:text-2xl font-bold text-center mb-5 sm:mb-6 text-green-600">
            Your Profile
          </h2>

          <div className="space-y-4 text-sm sm:text-base">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b pb-2 gap-2">
              <span className="font-semibold">Username</span>

              {!editingUsername ? (
                <div className="flex gap-2 sm:gap-3 items-center flex-wrap">
                  <span>{profile.username}</span>
                  <button
                    onClick={() => setEditingUsername(true)}
                    className="text-blue-600 text-xs sm:text-sm cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  <input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  />
                  <button onClick={handleUsernameUpdate} className="text-green-600 text-sm">
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUsername(false)}
                    className="text-red-600 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2 gap-1">
              <span className="font-semibold">Email</span>
              <span className="break-all">{profile.email}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2 gap-1">
              <span className="font-semibold">Provider</span>
              <span>{profile.provider || "Manual"}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2 gap-1">
              <span className="font-semibold">Email Verified</span>
              <span className={profile.emailVerified ? "text-green-600" : "text-red-600"}>
                {profile.emailVerified ? "Yes" : "No"}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-2 gap-1">
              <span className="font-semibold">Account Created</span>
              <span className="text-xs sm:text-sm">
                {profile.createdAt?.toDate
                  ? profile.createdAt.toDate().toLocaleString()
                  : "N/A"}
              </span>
            </div>

          </div>

          {!profile.emailVerified && (
            <button
              onClick={() => navigate("/verify-email")}
              className="mt-5 sm:mt-6 w-full bg-orange-500 text-white py-2 rounded-md text-sm sm:text-base hover:bg-orange-600"
            >
              Verify Email
            </button>
          )}

          <button
            onClick={() => navigate("/")}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded-md text-sm sm:text-base hover:bg-green-700"
          >
            Back to Homepage
          </button>

          <button
            onClick={handleDeleteAccount}
            className="mt-3 w-full bg-red-600 text-white py-2 rounded-md text-sm sm:text-base hover:bg-red-700"
          >
            Delete Account
          </button>

        </div>
      </div>
    </div>
  );
};

export default Profile;