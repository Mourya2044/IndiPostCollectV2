import React, { useEffect, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/inputs/Input';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import { useAuthStore } from '../../store/useAuthStore.js';

const SignUp = () => {
  const { signup, hideNav, unhideNav } = useAuthStore();

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

  const navigate = useNavigate();

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

    // TODO: Signup API call here
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

    signup(userData)

    // Simulate signup and navigate
    navigate("/login");
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          {step === 1 ? "Enter your details to create an account" : "Enter your address"}
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
                <Input
                  value={locality}
                  onChange={({ target }) => setLocality(target.value)}
                  label="Locality"
                  placeholder=""
                  type="text"
                />
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

          </div>

          {error && <p className="text-red-500 text-xs pb-2.5 pt-1">{error}</p>}

          <button type="submit" className="btn-primary mt-2">
            {step === 1 ? "Next" : "Sign Up"}
          </button>

          <p className="text-[13px] mt-3 text-slate-800">
            Already have an account?{" "}
            <Link className="font-medium text-[#da251c] underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
