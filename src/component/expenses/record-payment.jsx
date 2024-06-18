import { useState, useEffect } from 'react';
import { ArrowLeft, IndianRupee, FilePenLine } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';

const RecordPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user_id, total } = location.state || {};
    console.log('user_id', user_id);
    const id = location.pathname.split("/")[2];
    const [loading, setLoading] = useState(false);
    const [payerUserId, setPayerUserId] = useState(null); // State to store payer_user_id
    console.log('payer_user_id',payerUserId);

    const fetchUserList = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            console.log(res);

            // Extract payer_user_id from the first element of the response data array
            setPayerUserId(res.data.id);
        } catch (error) {
            console.error("Fetch Expense Details Error:", error);
            toast.error("Error fetching expense details");
        }
    };

    useEffect(() => {
        fetchUserList();
    }, [id]);

    const formik = useFormik({
        initialValues: {
            description: '',
            amount: total.toFixed(2) || '', // Set the amount from the state
        },
        validationSchema: Yup.object({
            description: Yup.string()
                .required('Description is required')
                .max(20, 'Description cannot exceed 20 characters'),
            amount: Yup.number()
                .required('Amount is required')
                .positive('Amount must be positive')
                .test('len', 'Amount must be at most 7 digits', val => val && val.toString().length <= 7),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const response = await axios.post(`${import.meta.env.VITE_API}/settlements`, {
                    group_id: id,
                    payer_user_id: payerUserId, // Use the payer_user_id from the state
                    amount: values.amount,
                    description: values.description,
                    payee_id: user_id // Assuming payee_id is also user_id
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Token")}`
                    }
                });
                if (response.status === 200) {
                    toast.success(response.data.message);
                    navigate(`/group/${id}`);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                if(error.response && error.response.status == 400 ){
                    toast.error(error.response.data.message)
                }else{
                    toast.error(error.response?.data?.message || 'Failed to record payment');
                }
            } finally {
                setLoading(false);
            }
        },
    });

    const handleAmount = (e, handleChange) => {
        const { value } = e.target;
        if (value.length <= 7) {
            handleChange(e);
        }
    };

    return (
        <div className='bg-primaryColor h-svh flex flex-col items-center'>
            <div className='px-2 py-2 items-center w-full'>
                <div className='flex gap-2 items-center'>
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeft className='text-white' />
                    </button>
                    <h2 className='text-white font-nunito text-lg'>Record payment</h2>
                </div>
            </div>

            <form onSubmit={formik.handleSubmit} className='w-full max-w-md'>
                <div className="flex gap-3 pt-3 justify-center items-center mb-3">
                    <FilePenLine className='text-white' />
                    <input
                        type="text"
                        id="description"
                        name="description"
                        className="border-b md:w-full w-64 max-w-xs border-gray-400 focus:outline-none bg-transparent text-white"
                        placeholder="Enter the description"
                        maxLength={20}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                    />
                </div>
                {formik.touched.description && formik.errors.description ? (
                    <div className='text-red-500 text-sm mt-1 flex justify-start pl-20'>{formik.errors.description}</div>
                ) : null}

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
                        onChange={(e) => handleAmount(e, formik.handleChange)}
                        onBlur={formik.handleBlur}
                    />
                </div>
                {formik.touched.amount && formik.errors.amount ? (
                    <div className='text-red-500 text-sm mt-1 flex justify-start pl-20'>{formik.errors.amount}</div>
                ) : null}
                <div className='flex mt-5 justify-center'>
                    <button
                        type='submit'
                        className='text-black font-bold bg-white rounded-lg w-1/4 py-2 font-nunito'
                        disabled={loading}
                    >
                        {loading ? 'Wait...' : 'Settle'}
                    </button> 
                </div>
            </form>
        </div>
    ); 
};

export default RecordPayment;
