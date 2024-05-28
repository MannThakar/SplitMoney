import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { Users } from 'lucide-react';
import { ReceiptText } from 'lucide-react';

const CreateGroup = () => {
    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
            .required('Group Name is required'),
        description: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
            .required('Description is required'),
    });

    const HandleSubmit = async ({ name, description }, { setSubmitting }) => {
        const type = 'group_expenses';
        if (type === 'group_expenses') {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API}/groups`, {
                    name,
                    description,
                    type
                }, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        Authorization: `Bearer ${localStorage.getItem('Token')}`
                    },

                })
                console.log(response);
                if (response.status === 200) {
                    toast.success('Group Created')
                    const data = {
                        ids: response.data.group.id,
                        name: response.data.name,
                        info: response.data.description,
                    };
                    setTimeout(() => navigate('/'), 5000);
                    navigate('/', { state: data });

                }
            } catch (error) {
                toast.error(error.response.data.messsage);
            }
            setSubmitting(false);
        }

    }
    return (
        <div className="bg-primaryColor min-h-screen flex flex-col items-center">
            <div className="py-3 flex gap-2 px-2 w-full">
                <button className='flex items-center flex-row-reverse gap-2' onClick={() => navigate(-1)}>
                    <h2 className='text-white text-base font-satoshi'>back</h2>
                    <ArrowLeft className='text-white' />
                </button>
            </div>
            <h1 className="font-santoshi text-white text-3xl flex justify-center items-center mb-4">Create a group</h1>
            <div className="w-full max-w-md px-4">
                <Formik
                    initialValues={{ name: '', description: '' }}
                    validationSchema={validationSchema}
                    onSubmit={HandleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="w-full">
                            <div className='py-4 flex flex-col gap-4'>
                                <div className='flex items-center gap-3'>
                                    <Users className='text-white' />
                                    <Field type='text' name="name" className="w-full p-2 border-b-2 bg-transparent font-satoshi text-white" placeholder="Group name" />
                                </div>
                                <div className='flex justify-start ml-8'>
                                    <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
                                </div>

                                <div className='flex items-center gap-3'>
                                    <ReceiptText className='text-white' />
                                    <Field type='text' name="description" className="w-full p-2 border-b-2 bg-transparent font-satoshi text-white" placeholder="Group description" />
                                </div>
                                <div className='flex justify-start ml-8'>
                                    <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button type='submit' className="text-xl w-2/4 py-2 md:py-4 h-10 flex items-center justify-center rounded-full bg-buttonColor font-santoshi font-semibold text-black" disabled={isSubmitting}>
                                    {isSubmitting ? 'Wait...' : 'Done'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default CreateGroup;
