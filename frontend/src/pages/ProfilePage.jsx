import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import ProfilePhotoSelector from "@/components/inputs/ProfilePhotoSelector";
import ProfileLayout from "@/components/layouts/ProfileLayout";

const ProfilePage = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState(null);

  const { user, getUserInfo } = useAuthStore();

  useEffect(() => {
    if (!user) getUserInfo();
  }, []);

  const handleProfilePic = async (e) => {
    e.preventDefault();
    setError("");
    // Image upload logic here
  };

  return (
    <ProfileLayout>
      <form onSubmit={handleProfilePic} className="w-full max-w-md mx-auto">
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
      </form>

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
