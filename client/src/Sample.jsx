import React, { useState } from 'react';

function Sample() {
  // Registration state
  const [registerData, setRegisterData] = useState({
    accName: '',
    accType: '',
    mobile: '',
    email: '',
    password: '',
    cpassword: '',
    initialDeposit: ''
  });

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    alert('Registered successfully!');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert('Logged in successfully!');
  };

  const inputClass =
    'w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400';

  const sectionClass =
    'bg-white shadow-sm border border-gray-200 rounded-xl p-6';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-1/2">
        {/* Registration */}
        <div className={sectionClass}>
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Open New Account
          </h2>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <input
              type="text"
              name="accName"
              placeholder="Account Name"
              value={registerData.accName}
              onChange={handleRegisterChange}
              className={inputClass}
            />
            <select
              name="accType"
              value={registerData.accType}
              onChange={handleRegisterChange}
              className={inputClass}
            >
              <option value="">Select Account Type</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
            </select>
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={registerData.mobile}
              onChange={handleRegisterChange}
              className={inputClass}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={handleRegisterChange}
              className={inputClass}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerData.password}
              onChange={handleRegisterChange}
              className={inputClass}
            />
            <input
              type="password"
              name="cpassword"
              placeholder="Confirm Password"
              value={registerData.cpassword}
              onChange={handleRegisterChange}
              className={inputClass}
            />
            <input
              type="number"
              name="initialDeposit"
              placeholder="Initial Deposit"
              value={registerData.initialDeposit}
              onChange={handleRegisterChange}
              className={inputClass}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md py-2 transition-colors"
            >
              Register
            </button>
          </form>
        </div>

        
      </div>
    </div>
  );
}

export default Sample;
