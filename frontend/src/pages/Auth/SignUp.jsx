import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/inputs/Input';
import { useNavigate, Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validations
    if (!validateEmail(email)) return setError("Invalid email address");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    if (!fullName || !address || !district || !state || !city || !pin) {
      return setError("Please fill in all fields");
    }

    setError("");

    // TODO: Signup API call here
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Enter your details to create an account
        </p>

        <form onSubmit={handleSignup}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Virat Kohli"
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
            <Input
              value={address}
              onChange={({ target }) => setAddress(target.value)}
              label="Address"
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
            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                label="Password"
                placeholder="Min 8 characters"
                type="password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5 pt-1">{error}</p>}

          <button type="submit" className="btn-primary mt-2">Sign Up</button>

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
