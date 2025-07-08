import React, { useEffect, useState } from 'react';
import { User, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from "@/store/useAuthStore";
import { Camera } from "lucide-react";
import ProfilePosts from '@/components/ProfilePosts';
import ProfileOrders from '@/components/ProfileOrders';

const ProfilePage = () => {
  const { user, updateProfilePic, isLoading, updateAddress } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfilePic(base64Image);
    };
  }

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState(user.address || {
    locality: '',
    country: '',
    city: '',
    district: '',
    pin: 0
  });

  const handleAddressEdit = () => {
    setTempAddress(user.address);
    setIsEditingAddress(true);
  };

  const handleAddressSave = async () => {
    if (!tempAddress.locality || !tempAddress.city || !tempAddress.district || !tempAddress.state || !tempAddress.pin) {
      alert("Please fill in all address fields.");
      return;
    }
    await updateAddress(tempAddress);
    setIsEditingAddress(false);
  };

  const handleAddressCancel = () => {
    setTempAddress(user.address);
    setIsEditingAddress(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">Dashboard</CardTitle>
            <p className="text-muted-foreground">Welcome back, {user.fullName}!</p>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedImage || user.profilePic || "/avatar.png"}
                      alt="Profile"
                      className="size-32 rounded-full object-cover border-4 "
                    />
                    <label
                      htmlFor="avatar-upload"
                      className={`absolute bottom-0 right-0 bg-IPCaccent hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200
                       ${isLoading ? "animate-pulse pointer-events-none" : ""}
                      `}
                    >
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-zinc-400">
                    {isLoading ? "Uploading..." : "Click the camera icon to update your photo"}
                  </p>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={user.fullName} readOnly className="bg-muted" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly className="bg-muted" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex flex-row justify-between items-center">
                      <Label htmlFor="address">Address</Label>
                      <Button
                        onClick={handleAddressEdit}
                        variant="ghost"
                        size="sm"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-2">
                      <Label className="block mb-1">Locality</Label>
                      {isEditingAddress ? (
                        <Input id="locality" value={tempAddress.locality} className="bg-muted mb-2" onChange={(e) => setTempAddress({ ...tempAddress, locality: e.target.value })} />
                      ) : (
                        <p className='p-2 text-gray-500'>{tempAddress.locality}</p>
                      )}
                      <Label className="block mb-1">City</Label>
                      {isEditingAddress ? (
                        <Input id="city" value={tempAddress.city} className="bg-muted mb-2" onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })} />
                      ) : (
                        <p className='p-2 text-gray-500'>{tempAddress.city}</p>
                      )}
                      <Label className="block mb-1">District</Label>
                      {isEditingAddress ? (
                        <Input id="district" value={tempAddress.district} className="bg-muted mb-2" onChange={(e) => setTempAddress({ ...tempAddress, district: e.target.value })} />
                      ) : (
                        <p className='p-2 text-gray-500'>{tempAddress.district}</p>
                      )}
                      <Label className="block mb-1">State</Label>
                      {isEditingAddress ? (
                        <Input id="state" value={tempAddress.state} className="bg-muted mb-2" onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })} />
                      ) : (
                        <p className='p-2 text-gray-500'>{tempAddress.state}</p>
                      )}
                      <Label className="block mb-1">Pin Code</Label>
                      {isEditingAddress ? (
                        <Input id="pin" type="number" value={tempAddress.pin} className="bg-muted mb-2" onChange={(e) => setTempAddress({ ...tempAddress, pin: e.target.value })} />
                      ) : (
                        <p className='p-2 text-gray-500'>{tempAddress.pin}</p>
                      )}
                    </div>
                    {isEditingAddress && (
                      <div className="flex space-x-2">
                        <Button onClick={handleAddressSave} size="sm">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button onClick={handleAddressCancel} variant="outline" size="sm">
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Orders Section */}
            <ProfileOrders userId={user._id} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Posts Section */}
            <ProfilePosts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;





// const ProfilePage = () => {
//   const { user, getUserInfo, updateProfilePic, isLoading } = useAuthStore();

//   useEffect(() => {
//     if (!user) getUserInfo();
//     else console.log("User profilePic:", user.profilePic); // <--- Add this
//   }, [user]);

//   const [selectedImage, setSelectedImage] = useState(null);

//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onload = async () => {
//       const base64Image = reader.result;
//       setSelectedImage(base64Image);
//       await updateProfilePic(base64Image);
//     };
//   }

//   return (
//     <ProfileLayout>
//       <div className="flex flex-col md:flex-row justify-between ">
//         <div className="w-full md:w-[48%] flex flex-col items-start pl-0 md:pl-0 ml-0">
//           {user && (
//             <div className="border rounded-4xl p-5">
//               <h2 className="text-3xl font-bold mb-6 text-IPCaccent">
//                 User Details
//               </h2>

//               <div className="space-y-4 text-lg">
//                 <div>
//                   <span className="font-semibold">Full Name:</span>{" "}
//                   <span className="font-normal">{user.fullName}</span>
//                 </div>

//                 <div>
//                   <span className="font-semibold">Email:</span>{" "}
//                   <span className="font-normal">{user.email}</span>
//                 </div>

//                 <div>
//                   <span className="font-semibold">Verified:</span>{" "}
//                   <span className="font-normal">
//                     {user.verified ? "Yes" : "No"}
//                   </span>
//                 </div>

//                 {user.address && (
//                   <div className="pt-4">
//                     <h4 className="text-xl font-semibold text-gray-700 mb-2">
//                       Address
//                     </h4>
//                     <p>
//                       {user.address.locality}, {user.address.city}
//                     </p>
//                     <p>
//                       {user.address.district}, {user.address.state} -{" "}
//                       {user.address.pin}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="w-full md:w-[40%] flex flex-col items-end">
//           {/* <div className="flex flex-col items-center gap-0.5">
            
//             {user?.profilePic?.trim() !== "" ? (
//               <div className="relative w-48 h-48">
//                 <img
//                   src={user.profilePic}
//                   alt="Profile"
//                   className="w-48 h-48 object-cover rounded-full shadow"
//                 />
//                 {uploading && (
//                   <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
//                     <SmallSpinner />
//                   </div>
//                 )}
//               </div>
//             ) : uploading ? (
//               <div className="w-48 h-48 rounded-full flex items-center justify-center bg-gray-200 shadow">
//                 <SmallSpinner />
//               </div>
//             ) : (
//               <p className="text-gray-500">No profile picture</p>
//             )}

            
//             <ProfilePhotoSelector setImage={handleFileChange} />
//           </div> */}

//           {/* profile second idea */}
//           <div className="flex flex-col items-center gap-4">
//             <div className="relative">
//               <img
//                 src={selectedImage || user.profilePic || "/avatar.png"}
//                 alt="Profile"
//                 className="size-32 rounded-full object-cover border-4 "
//               />
//               <label
//                 htmlFor="avatar-upload"
//                 className={`
//                   absolute bottom-0 right-0 
//                   bg-IPCaccent hover:scale-105
//                   p-2 rounded-full cursor-pointer 
//                   transition-all duration-200
//                   ${isLoading ? "animate-pulse pointer-events-none" : ""}
//                 `}
//               >
//                 <Camera className="w-5 h-5 text-white" />
//                 <input
//                   type="file"
//                   id="avatar-upload"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   disabled={isLoading}
//                 />
//               </label>
//             </div>
//             <p className="text-sm text-zinc-400">
//               {isLoading ? "Uploading..." : "Click the camera icon to update your photo"}
//             </p>
//           </div>
//         </div>
//       </div>
//     </ProfileLayout>
//   );
// };

// export default ProfilePage;
