import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import Link from "daisyui/components/link";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VerificationPage = () => {
    const { userId, uniqueString } = useParams();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);

    const verifyEmail = async () => {
        setLoading(true);
        
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
                <div className="flex flex-col items-center justify-center">
                    {/* Spinning loader */}
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-IPCprimary border-t-transparent rounded-full animate-spin"></div>
                        <div className="w-20 h-20 border-2 border-IPCprimary/30 rounded-full absolute top-0 left-0 animate-pulse"></div>
                    </div>
                    <p className="text-IPCprimary text-lg mt-6 animate-pulse">Verifying your email...</p>
                    <div className="flex space-x-1 mt-2">
                        <div className="w-2 h-2 bg-IPCprimary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-IPCprimary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-IPCprimary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                </div>
            ) : verified ? (
                <div className="flex flex-col items-center justify-center">
                    {/* Success animation */}
                    <div className="relative">
                        {/* Ping animation background */}
                        <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute inset-0 w-20 h-20 bg-green-400 rounded-full animate-ping opacity-30" style={{animationDelay: '0.5s'}}></div>
                        
                        {/* Success circle with checkmark */}
                        <div className="relative w-20 h-20 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
                            <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-green-600 text-lg font-semibold mt-6 animate-fade-in">Email verified successfully!</p>
                    <p className="text-IPCprimary text-sm mt-2 animate-fade-in opacity-70">You can now continue using your account</p>
                    <Link to="/">
                        <Button 
                            onClick={verifyEmail}
                            className="mt-4 px-6 py-2 bg-IPCprimary text-white rounded-lg hover:opacity-90 transition-all duration-200 animate-fade-in"
                        >
                            Go Home
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    {/* Error animation */}
                    <div className="relative">
                        {/* Ping animation background */}
                        <div className="absolute inset-0 w-20 h-20 bg-red-500 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute inset-0 w-20 h-20 bg-red-500 rounded-full animate-ping opacity-30" style={{animationDelay: '0.5s'}}></div>
                        
                        {/* Error circle with X mark */}
                        <div className="relative w-20 h-20 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                            <svg className="w-10 h-10 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                    <p className="text-red-600 text-lg font-semibold mt-6 animate-fade-in">Email verification failed!</p>
                    <p className="text-IPCprimary text-sm mt-2 animate-fade-in opacity-70">Please try again or contact support</p>
                    
                    <Button 
                        onClick={verifyEmail}
                        className="mt-4 px-6 py-2 bg-IPCprimary text-white rounded-lg hover:opacity-90 transition-all duration-200 animate-fade-in"
                    >
                        Try Again
                    </Button>
                </div>
            )}
            
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    )
}

export default VerificationPage