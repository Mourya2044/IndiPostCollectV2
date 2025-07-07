import React from 'react';

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md animate-bounce">
        <strong className="font-bold">Payment Failed</strong>
        <span className="block">Please try again or use a different payment method.</span>
      </div>
    </div>
  );
};

export default PaymentFailed;
