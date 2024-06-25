/* eslint-disable react/no-unescaped-entities */
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoginImg from '../../assets/Login.svg';
import { Smartphone } from 'lucide-react';
import { toast } from 'react-toastify';
import "../../App.css"

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
        navigate('/otp', { state: data })
      }
      if (response.data.original === 'User does not exist') {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-primaryColor h-svh flex items-center justify-center">
      <div className="container mx-auto px-6 flex flex-col items-center justify-center">
        <div className="flex justify-center">
          <img src={LoginImg} alt="Login" className="w-40 h-40 md:w-52 md:h-52" />
        </div>
        <div className="font-nunito text-center">
          <h1 className="text-4xl font-semibold font-nunito text-white">Login</h1>
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
                    type="number"
                    id="phone_no"
                    name="phone_no"
                    inputMode="numeric"
                  className="w-full p-2 bg-transparent text-base border-b-2 text-white md:max-w-xs focus:outline-none"
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
                  className="font-nunito text-lg py-2 rounded-full w-1/2 md:w-1/3  text-black mt-8 bg-buttonColor font-bold mx-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Wait...' : 'Get OTP'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <div className="flex justify-center mt-4">
          <h2 className="text-sm gap-1 flex justify-center font-medium text-white font-nunito">
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
