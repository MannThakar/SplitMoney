import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "../utils/auth";
import { toast } from 'react-toastify'

function Otp() {
  const [codes, setCodes] = useState(["", "", "", "", "", ""]);
  const codeInputs = useRef([]);
  const location = useLocation();
  const { otps, name, email, phone_no, type } = location.state;
  const navigate = useNavigate();
  const [otp, setOtp] = useState(otps);
  const [loading, setLoading] = useState(false);
  const inviteToken = localStorage.getItem('inviteToken');

  async function resendOtps() {
    const type = 'verification';
    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/resend-otp?phone_no=${phone_no}&type=${type}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      setOtp(response.data.otp);
    } catch (error) {
      toast.error('This is an error!');
      console.error('Error:', error);
    }
  }
  const { storeToken } = useAuth();

  useEffect(() => {
    codeInputs.current[0].focus();

  }, []);

  const handleChange = (index, e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);
      if (value !== "" && index < 5) {
        codeInputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && codes[index] === "") {
      codeInputs.current[index - 1].focus();
    }
  };

  const handleOtp = async () => {
    setLoading(true);
    const otp = codes.join("");

    try {
      if (type === 'verification') {
        const response = await axios.post(`${import.meta.env.VITE_API}/signup`, {
          otp, name, email, phone_no
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (response.status === 200) {
          if (localStorage.getItem('inviteToken')) {
            let data = {
              token_data: response.data.token,
            };
            storeToken(data.token_data);
            navigate(`/group-invite?token=${inviteToken}`);
            localStorage.removeItem('inviteToken');
          } else {
            let data = {
              token_data: response.data.token,
            };
            storeToken(data.token_data);
            toast.success(response.data.message);
            navigate('/', { state: data });
          }
        } else {
          toast.error(response.data.message);
        }

      }
      if (type === "login") {
        const response = await axios.post(`${import.meta.env.VITE_API}/login`, {
          phone_no, otp
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        const save = response.data.token;
        if (response.status === 200) {
          localStorage.setItem('Token', save)
          navigate('/');
          toast.success(response.data.message)
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally {
      setLoading(false);
    }
  };


  const isButtonDisabled = codes.some(code => code === "");

  return (
    <div className="bg-primaryColor h-svh flex flex-col items-center justify-center mx-auto p-4">
      <div className='p-3 flex justify-center mx-auto text-lg bg-stone-800 rounded-md w-32 text-white text-bold tracking-widest'>
        {otp}
      </div>

      <div className="flex flex-col justify-center items-center mt-5 w-full max-w-md">
        <div className="p-8 bg-stone-800 rounded-2xl w-full">
          <h1 className="text-2xl text-center text-white font-nunito mb-2">Verification Code</h1>
          <p className="text-sm font-normal text-center text-white font-nunito mb-3">OTP sent to +91 {phone_no}</p>
          <div className="flex justify-center space-x-1 mt-3">
            {codes.map((code, index) => (
              <input
                key={index}
                type="number"
                id={`verificationCode${index}`}
                name={`verificationCode${index}`}
                value={code}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(input) => (codeInputs.current[index] = input)}
                maxLength="1"
                autoComplete="off"
                className="w-10 h-10 md:w-16 md:h-16 text-2xl text-center border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            ))}
          </div>
          <div className="flex justify-center mt-5">
            <button
              type="submit"
              className="text-lg font-bold bg-buttonColor rounded-full py-2 font-nunito w-2/4 md:w-1/3 text-black"
              onClick={handleOtp}
              disabled={loading || isButtonDisabled}
            >
              {loading ? 'Wait...' : 'Verify'}
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <button className='font-nunito font-bold text-base rounded-md text-textColor' onClick={resendOtps}>Resend Otp</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Otp;