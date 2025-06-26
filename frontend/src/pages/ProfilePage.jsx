import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import ProfilePhotoSelector from "@/components/inputs/ProfilePhotoSelector";
import ProfileLayout from "@/components/layouts/ProfileLayout";

const ProfilePage = () => {
  const [error, setError] = useState(null);
  const { user, getUserInfo, updateProfilePic } = useAuthStore();

  useEffect(() => {
    if (!user) getUserInfo();
  }, []);

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
      const base64Image = await fileToBase64(file);
      await updateProfilePic(base64Image);
      //await getUserInfo(); // refresh user data with updated image
    } catch (err) {
      console.error("Upload failed", err);
      setError("Failed to upload profile picture");
    }
  };

  return (
    <ProfileLayout>
      <div>
        {user?.profilePic ? (
          <div className="mt-4 flex justify-center">
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full shadow"
            />
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">
            No profile image available
          </p>
        )}
      </div>

      <div className="w-full max-w-md mx-auto">
        <ProfilePhotoSelector setImage={handleFileChange} />
      </div>

      {user && (
        <div className="mt-10 px-4 md:px-16 text-[#3b3b3b]">
          <h2 className="text-3xl font-bold text-[#DA1C1C] mb-6">
            User Details
          </h2>

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
    </ProfileLayout>
  );
};

export default ProfilePage;
