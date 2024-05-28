/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, FilePenLine, IndianRupee, Calendar } from 'lucide-react';
import { toast } from 'react-toastify'

const AddExpense = () => {
    console.log("Current Path:", location.pathname);
    const navigate = useNavigate();
    const { id } = useParams();  // Retrieve group_id from URL parameters
    console.log(id)
    const group_id = id;
    console.log(group_id)
    const payer_user_id = 2; // Assuming payer_user_id is stored in localStorage

    const validationSchema = Yup.object().shape({
        description: Yup.string().required('Description is required'),
        amount: Yup.number().required('Amount is required').positive('Amount must be positive').integer('Amount must be an integer'),
        date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
    });

    const handleSubmit = async ({ description, amount, date }, { setSubmitting }) => {
        const type = 'EQUALLY';
        try {
            const response = await axios.post(`${import.meta.env.VITE_API}/expenses`, {
                amount,
                description,
                type,
                group_id,
                date,
            }, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    Authorization: `Bearer ${localStorage.getItem('Token')}`
                },
            });
            if (response.status === 200) {
                toast.success(response.data.message)
            } else {
                toast.error(message.data.message)
            }

            setSubmitting(false);
            navigate(-1);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-primaryColor h-screen px-3 flex flex-col items-center">
            <div className="pt-3 items-center w-full">
                <button className='flex gap-2'>
                    <ArrowLeft className="text-white" onClick={() => navigate(-1)} />
                    <h2 className="text-white text-base font-satoshi">back</h2>
                </button>
            </div>
            <h2 className="text-3xl my-5 font-satoshi text-center text-white">Add Expense</h2>
            <hr className='bg-white' />
            <Formik
                initialValues={{ description: '', amount: '', date: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, handleChange, values }) => (
                    <Form className="w-full max-w-md">
                        <div className="flex gap-3 justify-center items-center mb-3">
                            <FilePenLine className='text-white' />
                            <Field type="text" id="description" name="description" className="border-b w-full max-w-xs border-gray-400 p-2 bg-transparent text-white" placeholder="Enter the description" value={values.description} onChange={handleChange} />
                        </div>
                        <div className='flex justify-start pl-8'>
                            <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
                        </div>

                        <div className="flex gap-3 justify-center items-center mb-3">
                            <IndianRupee className='text-white' />
                            <Field type="number" id="amount" name="amount" className="border-b w-full max-w-xs border-gray-400 p-2 bg-transparent text-white" placeholder="0.00" value={values.amount} onChange={handleChange} />
                        </div>
                        <div className='w-full flex justify-start pl-8'>
                            <ErrorMessage name="amount" component="div" className="text-sm text-red-500" />
                        </div>

                        <div className="flex gap-3 justify-center items-center mb-3">
                            <Calendar className='text-white' />
                            <Field type="date" id="date" name="date" className="border-b w-full max-w-xs border-gray-400 p-2 bg-transparent text-white" value={values.date} onChange={handleChange} />
                        </div>
                        <div className='w-full flex justify-start pl-8'>
                            <ErrorMessage name="date" component="div" className="text-sm text-red-500" />
                        </div>

                        <div className="mt-4 flex justify-center">
                            <button type="submit" className="w-36 py-2 font-bold text-black rounded-full bg-buttonColor font-satoshi" disabled={isSubmitting}>
                                {isSubmitting ? 'Adding...' : 'Add'}
                            </button>
                        </div>
                    </Form>

                )}
            </Formik>
            <div>
                <span>Split</span>
            </div>
        </div>
    );
};

export default AddExpense;
