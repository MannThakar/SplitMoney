/* eslint-disable react/no-unescaped-entities */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import LoginImg from '../../assets/Login.svg';
import { Smartphone } from 'lucide-react';

const SignIn = () => {
  const navigate = useNavigate();
  const type = 'login';

  const validationSchema = Yup.object().shape({
    phone_no: Yup.string()
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits')
      .required('Mobile number is required'),
  });

  const handleSubmit = async ({ phone_no }, { setSubmitting }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/send-otp?phone_no=${phone_no}&type=${type}`,
        {
          phone_no,
          type,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        }
      );
      if (response.status === 200) {
        const data = {
          otps: response.data.otp,
          phone_no,
          type,
        };
        setTimeout(() => navigate('/otp', { state: data }), 1000);
      }
      if (response.data.original === 'User does not exist') {
        toast.error('Please signup first');
      }
    } catch (error) {
      toast.error(error);
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-primaryColor h-svh flex items-center justify-center">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <div className="container mx-auto px-6 flex flex-col items-center justify-center">
        <div className="flex justify-center">
          <img src={LoginImg} alt="Login" className="w-40 h-40 md:w-52 md:h-52" />
        </div>
        <div className="font-satoshi text-center">
          <h1 className="text-3xl font-bold text-white">Login</h1>
        </div>
        <Formik
          initialValues={{ phone_no: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="w-full max-w-sm mt-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <Smartphone className="text-white" />
                  <Field
                    type="text"
                    id="phone_no"
                    name="phone_no"
                    inputMode="numeric"
                    className="w-full p-2 bg-transparent text-base border-b-2 text-white md:max-w-xs"
                    placeholder="Phone"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) && value.length <= 10) {
                        setFieldValue('phone_no', value);
                      }
                    }}
                  />
                </div>
                <ErrorMessage
                  name="phone_no"
                  component="div"
                  className="text-sm text-red-500 pl-8 md:pl-8 flex justify-start"
                />
                <button
                  type="submit"
                  className="font-satoshi text-lg py-2 rounded-full w-2/4  text-black mt-8 bg-buttonColor font-bold mx-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending OTP...' : 'Get OTP'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="flex justify-center mt-4">
          <h2 className="text-sm gap-1 flex justify-center font-medium text-white font-satoshi">
            Don't have an account?{' '}
            <Link to="/signup" className="text-textColor">
              Register
            </Link>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
