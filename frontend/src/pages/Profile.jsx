import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const Profile = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  // Fetch profile ONCE
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
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate]);

  // Sync username input when profile loads
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
    } catch (err) {
      toast.error("Failed to update username");
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading…</div>;
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-600">
          Your Profile
        </h2>

        <div className="space-y-4">

          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold">Username</span>

            {!editingUsername ? (
              <div className="flex gap-3 items-center">
                <span>{profile.username}</span>
                <button
                  onClick={() => setEditingUsername(true)}
                  className="text-blue-600 text-sm cursor-pointer"
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <button onClick={handleUsernameUpdate} className="text-green-600 cursor-pointer">
                  Save
                </button>
                <button
                  onClick={() => setEditingUsername(false)}
                  className="text-red-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email</span>
            <span>{profile.email}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Provider</span>
            <span>{profile.provider || "Manual"}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email Verified</span>
            <span className={profile.emailVerified ? "text-green-600" : "text-red-600"}>
              {profile.emailVerified ? "Yes" : "No"}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Account Created</span>
            <span>
              {profile.createdAt?.toDate
                ? profile.createdAt.toDate().toLocaleString()
                : "N/A"}
            </span>
          </div>
        </div>

        {!profile.emailVerified && (
          <button
            onClick={() => navigate("/verify-email")}
            className="mt-6 w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
          >
            Verify Email
          </button>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full cursor-pointer bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default Profile;
