import ProfilePhotoSelector from '@/components/inputs/ProfilePhotoSelector';
import ProfileLayout from '@/components/layouts/ProfileLayout'
import React, { useState } from 'react'

const ProfilePage = () => {
  const [profilePic,setProfilePic] = useState(null);
  const [error,setError] = useState(null);

  const handleProfilePic = async(e)=>{
    let profileImageUrl = "";

    setError("");
  }

  return (
    <ProfileLayout>
      <form onSubmit={handleProfilePic}>
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}/>
      </form>
    </ProfileLayout>
  )
}

export default ProfilePage
