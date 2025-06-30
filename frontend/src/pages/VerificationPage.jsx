import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const VerificationPage = () => {
    const { userId, uniqueString } = useParams();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    const verifyEmail = async () => {
        try {
            const response = await axiosInstance.post(`/auth/verify/${userId}/${uniqueString}`);
            if (response.status === 200) {
                setVerified(true);
                console.log("Email verified successfully:", response.data);
            } else {
                console.error("Email verification failed:", response.data.message);
            }
        } catch (error) {
            console.error("Error verifying email:", error);            
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        verifyEmail();
    });

  return (
    <div className='h-screen bg-IPClight-bg flex items-center justify-center'>
        {loading ? (
            <p>Loading...</p>
        ) : verified ? (
            <p>Email verified successfully!</p>
        ) : (
            <p>Email verification failed. Please try again.</p>
        )}
    </div>
  )
}

export default VerificationPage