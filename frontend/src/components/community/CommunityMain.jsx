import React from 'react'
import CommunityHeader from './CommunityHeader';
import CommunityPostCard from './CommunityPostCard';


const CommunityMain = () => {
  

  return (
    <div>
      <CommunityHeader />

      <div className="flex flex-col gap-4 p-4">
        <CommunityPostCard />
        <CommunityPostCard />
        <CommunityPostCard />
      </div>
    </div>
  )
}

export default CommunityMain