/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { ArrowLeft, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const RecordPayment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues: {
            amount: '',
        },
        validationSchema: Yup.object({
            amount: Yup.number()
                .required('Amount is required')
                .positive('Amount must be positive')
                .test('len', 'Amount must be at most 7 digits', val => val && val.toString().length <= 7),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise((resolve) => setTimeout(resolve, 2000));
                toast.success('Payment recorded successfully');
                navigate(-1); // Navigate back after success
            } catch (error) {
                toast.error('Failed to record payment');
            } finally {
                setLoading(false);
            }
        },
    });
    
    const handleAmount = (e,handleChange) => {
        const { value } = e.target;
        if (value.length <= 7) {
            handleChange(e)
        }
    }
    return (
        <div className='bg-primaryColor h-svh flex flex-col items-center'>
            <div className='px-2 py-2 items-center w-full'>
                <button className='flex gap-2 items-center' onClick={() => navigate(-1)}>
                    <ArrowLeft className='text-white' />
                    <h2 className='text-white font-nunito text-lg'>Record payment</h2>
                </button>
            </div>

            <form onSubmit={formik.handleSubmit} className='w-full max-w-md'>
                <div className='flex gap-3 justify-center items-center'>
                    <IndianRupee className='text-white' />
                    <input
                        type='number'
                        placeholder='0.00'
                        className={`border-b bg-transparent w-64 md:w-full max-w-xs border-gray-400 text-white focus:outline-none ${
                            formik.touched.amount && formik.errors.amount ? 'border-red-500' : ''
                        }`}
                        name='amount'
                        value={formik.values.amount}
                        onChange={(e) => handleAmount(e,formik.handleChange)}
                        onBlur={formik.handleBlur}
                    />
                </div>
                {formik.touched.amount && formik.errors.amount ? (
                    <div className='text-red-500 text-sm mt-1 flex justify-start pl-20'>{formik.errors.amount}</div>
                ) : null}
                <div className='flex mt-5 justify-center'>
                    <button
                        type='submit'
                        className='text-black bg-white rounded-xl w-28 py-2 font-nunito'
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Settle'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecordPayment;
