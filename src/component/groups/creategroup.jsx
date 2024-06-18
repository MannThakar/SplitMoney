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

    // Validation Schema using Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
            .required('Group Name is required')
            .max(20,'Group name cannot exceed 20 characters'),
        description: Yup.string()
            .matches(/^[a-zA-Z\s!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/, 'Description can only contain letters, spaces, and special characters')
            .required('Description is required')
            .max(35,'Group Description cannot exceed 35 characters'),
    });

    const capitalizeFirstLetter = (value) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const handleBlur = (event, setFieldValue) => {
        const { name, value } = event.target;
        setFieldValue(name, capitalizeFirstLetter(value));
    };

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
                });
                if (response.status === 200) {
                    toast.success('Group Created');
                    const data = {
                        ids: response.data.group.id,
                        name: response.data.name,
                        info: response.data.description,
                    };
                    navigate('/', { state: data });
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-primaryColor min-h-screen flex flex-col items-center">
            <div className="py-3 flex gap-2 px-2 w-full">
                <div className='flex items-center flex-row-reverse gap-2'>
                    <h2 className='text-white text-lg font-nunito'>Create a group</h2>
                    <button  onClick={() => navigate(-1)}>
                        <ArrowLeft className='text-white' />
                    </button>
                </div>
            </div>
            <div className="w-full max-w-md px-4">
                <Formik
                    initialValues={{ name: '', description: '' }}
                    validationSchema={validationSchema}
                    onSubmit={HandleSubmit}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form className="w-full">
                            <div className='py-4 flex flex-col gap-4'>
                                <div className='flex items-center gap-3'>
                                    <Users className='text-white' />
                                    <Field
                                        type='text'
                                        name="name"
                                        className="w-full border-b-2 border-white bg-transparent font-nunito text-white focus:outline-none"
                                        placeholder="Group name"
                                        onBlur={(e) => handleBlur(e, setFieldValue)}
                                        maxLength={20}
                                    />
                                </div>
                                <div className='flex justify-start ml-8'>
                                    <ErrorMessage name="name" component="div" className="text-sm text-red-500" />
                                </div>

                                <div className='flex items-center gap-3'>
                                    <ReceiptText className='text-white' />
                                    <Field
                                        type='text'
                                        name="description"
                                        className="w-full border-b-2 bg-transparent font-nunito text-white focus:outline-none"
                                        placeholder="Group description"
                                        onBlur={(e) => handleBlur(e, setFieldValue)}
                                        maxLength={35}
                                    />
                                </div>
                                <div className='flex justify-start ml-8'>
                                    <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <button type='submit' className="text-xl w-1/3 py-2 md:py-4 h-10 flex items-center justify-center rounded-full bg-buttonColor font-nunito font-semibold text-black" disabled={isSubmitting}>
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
