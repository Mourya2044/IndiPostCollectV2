import React, { useEffect, useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/inputs/Input';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import { useAuthStore } from '../../store/useAuthStore.js';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const SignUp = () => {
  const { signup, resendVerification, hideNav, unhideNav, isLoading } = useAuthStore();

  useEffect(() => {
    hideNav();
    return () => unhideNav();
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

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleNext = async (e) => {
    e.preventDefault();
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

    const userData = { fullName, email, password, address: { locality, district, state, city, pin } };
    try {
      await signup(userData);
      setError("");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setError(""); setResendStatus("");
    try {
      await resendVerification(email);
      setResendStatus("Verification email sent! Please check your inbox and spam folder.");
      setResendCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification email.");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-in slide-in-from-bottom-4 fade-in duration-700">
        <h3 className="text-3xl font-light text-foreground mb-2">Create Account</h3>
        <p className="text-sm text-muted-foreground mb-8">
          {step === 1 ? "Enter your details to create an account" : step === 2 ? "Enter your address details" : "Email Verification"}
        </p>

        <form onSubmit={step === 1 ? handleNext : handleSignup} className="space-y-2">
          {step === 1 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <Input placeholder="John Doe" label="Full Name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} label="Email Address" placeholder="philatelist@stamp.com" type="text" />
              <Input value={password} onChange={(e) => setPassword(e.target.value)} label="Password" placeholder="Min 8 characters" type="password" />
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-4 fade-in duration-300">
              <Input value={locality} onChange={(e) => setLocality(e.target.value)} label="Locality" placeholder="Street name" type="text" />
              <div className="grid grid-cols-2 gap-4">
                <Input value={city} onChange={(e) => setCity(e.target.value)} label="City" placeholder="City" type="text" />
                <Input value={district} onChange={(e) => setDistrict(e.target.value)} label="District" placeholder="District" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input value={state} onChange={(e) => setState(e.target.value)} label="State" placeholder="State" type="text" />
                <Input value={pin} onChange={(e) => setPin(e.target.value)} label="PIN Code" placeholder="ZIP/PIN" type="number" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 border border-border p-6 bg-muted/10 text-center">
              <div className="w-12 h-12 bg-IPCprimary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-IPCprimary" />
              </div>
              <h4 className="text-base font-semibold text-foreground mb-2">Verify Your Email</h4>
              <p className="text-sm text-muted-foreground mb-6">
                We've sent a verification link to <span className="font-semibold text-foreground">{email}</span>.
              </p>
              <div className="text-xs text-muted-foreground/80 p-3 bg-muted/30 border border-border mb-4">
                ⚠️ Didn't receive the email? Check your Spam / Junk folder.
              </div>
              {resendStatus && <p className="text-xs font-semibold text-green-600 mb-4">{resendStatus}</p>}
              
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading || resendCountdown > 0}
                className="text-[10px] font-bold uppercase tracking-widest text-IPCprimary hover:text-IPCsecondary disabled:opacity-50 transition-colors"
              >
                {resendCountdown > 0 ? `Resend available in ${resendCountdown}s` : isLoading ? "Sending..." : "Resend verification email"}
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-xs font-semibold mt-2">{error}</p>}

          {step < 3 && (
            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity mt-4">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{step === 1 ? "Next" : "Complete Sign Up"} <ArrowRight className="h-3.5 w-3.5" /></>}
            </button>
          )}

          <p className="text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link className="text-xs font-semibold uppercase tracking-widest text-IPCprimary hover:text-IPCsecondary transition-colors" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
