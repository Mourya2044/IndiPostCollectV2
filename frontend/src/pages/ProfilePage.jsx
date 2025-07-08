import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import ProfilePhotoSelector from "@/components/inputs/ProfilePhotoSelector";
import ProfileLayout from "@/components/layouts/ProfileLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
import SmallSpinner from "@/components/SmallSpinner";

const ProfilePage = () => {
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user, getUserInfo, updateProfilePic } = useAuthStore();

  useEffect(() => {
    if (!user) getUserInfo();
    else console.log("User profilePic:", user.profilePic); // <--- Add this
  }, [user]);

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const base64Image = await fileToBase64(file);
      await updateProfilePic(base64Image);
      await getUserInfo();
    } catch (err) {
      console.error("Upload failed", err);
      setError("Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ProfileLayout>
      <div className="flex flex-col md:flex-row justify-between ">
        <div className="w-full md:w-[48%] flex flex-col items-start pl-0 md:pl-0 ml-0">
          {user && (
            <div className="border rounded-4xl p-5">
              <h2 className="text-3xl font-bold mb-6 text-IPCaccent">User Details</h2>

              <div className="space-y-4 text-lg">
                <div>
                  <span className="font-semibold">Full Name:</span>{" "}
                  <span className="font-normal">{user.fullName}</span>
                </div>

                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  <span className="font-normal">{user.email}</span>
                </div>

                <div>
                  <span className="font-semibold">Verified:</span>{" "}
                  <span className="font-normal">
                    {user.verified ? "Yes" : "No"}
                  </span>
                </div>

                {user.address && (
                  <div className="pt-4">
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">
                      Address
                    </h4>
                    <p>
                      {user.address.locality}, {user.address.city}
                    </p>
                    <p>
                      {user.address.district}, {user.address.state} -{" "}
                      {user.address.pin}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-[40%] flex flex-col items-end">
          <div className="flex flex-col items-center gap-0.5">
            {/* Profile Picture */}
            {uploading ? (
              <SmallSpinner message="Uploading image..." />
            ) : user?.profilePic?.trim() !== "" ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full shadow"
              />
            ) : (
              <p className="text-gray-500">No profile picture</p>
            )}

            {/* Upload Button right below image */}
            <ProfilePhotoSelector setImage={handleFileChange} />
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
};

export default ProfilePage;
