import React, { useEffect, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/inputs/Input';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import { useAuthStore } from '../../store/useAuthStore.js';

const SignUp = () => {
  const { signup, resendVerification, hideNav, unhideNav, isLoading } = useAuthStore();

  useEffect(() => {
    hideNav();

    return () => {
      unhideNav()
    }
  }, [hideNav, unhideNav]);

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locality, setLocality] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);
  const [resendStatus, setResendStatus] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleNext = async (e) => {
    e.preventDefault();
    // Basic validations
    if (!fullName || !validateEmail(email) || password.length < 8) {
      return setError("Please enter valid full name, email and password (min 8 chars)");
    }
    setError('');
    setStep(2);
  }

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!locality || !district || !state || !city || !pin) {
      return setError("Please fill in all address fields");
    }

    setError("");

    const userData = {
      fullName,
      email,
      password,
      address: {
        locality,
        district,
        state,
        city,
        pin
      }
    }

    try {
      await signup(userData);
      setError("");
      setStep(3);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Signup failed. Please try again.";
      setError(errorMsg);
      console.error("Signup error:", err);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError("");
    setResendStatus("");
    try {
      await resendVerification(email);
      setResendStatus("Verification email sent! Please check your inbox and spam folder.");
      setResendCountdown(60);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend verification email.";
      setError(msg);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-IPCaccent">Create  Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          {step === 1 ? "Enter your details to create an account" : step === 2 ? "Enter your address details" : "Email Verification"}
        </p>

        <form onSubmit={step === 1 ? handleNext : handleSignup}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {step === 1 && (
              <>
                <Input
                  placeholder="Stamp Kumar"
                  label="Full Name"
                  type="text"
                  value={fullName}
                  onChange={({ target }) => setFullName(target.value)}
                />
                <Input
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  label="Email Address"
                  placeholder="philatelist@stamp.com"
                  type="text"
                />
                <div className="col-span-2">
                  <Input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    label="Password"
                    placeholder="Min 8 characters"
                    type="password"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className='col-span-2'>
                  <Input
                    value={locality}
                    onChange={({ target }) => setLocality(target.value)}
                    label="Locality"
                    placeholder=""
                    type="text"
                  />
                </div>
                <Input
                  value={district}
                  onChange={({ target }) => setDistrict(target.value)}
                  label="District"
                  placeholder=""
                  type="text"
                />
                <Input
                  value={state}
                  onChange={({ target }) => setState(target.value)}
                  label="State"
                  placeholder=""
                  type="text"
                />
                <Input
                  value={city}
                  onChange={({ target }) => setCity(target.value)}
                  label="City"
                  placeholder=""
                  type="text"
                />
                <Input
                  value={pin}
                  onChange={({ target }) => setPin(target.value)}
                  label="PIN Code"
                  placeholder=""
                  type="number"
                />
              </>
            )}

            {step === 3 && (
              <div className="col-span-2 bg-green-50 border border-green-200 rounded-xl p-4 text-center my-2">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-base font-semibold text-green-900 mb-1">Verify Your Email</h4>
                <p className="text-xs text-green-800 mb-3">
                  We've sent a verification link to <span className="font-semibold">{email}</span>. Please click the link to activate your account.
                </p>
                <div className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-lg border border-green-150 mb-3">
                  ⚠️ <strong>Didn't receive the email?</strong> Be sure to check your <strong>Spam / Junk</strong> folder.
                </div>
                {resendStatus && (
                  <p className="text-xs text-green-700 font-medium mb-3">{resendStatus}</p>
                )}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading || resendCountdown > 0}
                  className="text-xs font-semibold text-IPCaccent hover:text-IPCprimary disabled:text-gray-400 underline transition-colors cursor-pointer"
                >
                  {resendCountdown > 0
                    ? `Resend available in ${resendCountdown}s`
                    : isLoading
                    ? "Sending..."
                    : "Resend verification email"}
                </button>
              </div>
            )}

          </div>

          {error && <p className="text-red-500 text-xs pb-2.5 pt-1">{error}</p>}

          {step < 3 && (
            <button type="submit" disabled={isLoading} className="btn-primary mt-2">
              {isLoading ? "Please wait..." : step === 1 ? "Next" : "Sign Up"}
            </button>
          )}


          <p className="text-[13px] mt-3 text-slate-800">
            Already have an account?{" "}
            <Link className="font-medium text-IPCaccent underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
