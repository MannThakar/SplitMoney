/* eslint-disable no-unused-vars */
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, FilePenLine, IndianRupee, Calendar } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { selectedMemberIDs } = location.state || { selectedMemberIDs: {} };

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Description is required'),
    amount: Yup.number().required('Amount is required').positive('Amount must be positive').integer('Amount must be an integer'),
    date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  });

  const handleSubmit = async ({ description, amount, date }, { setSubmitting }) => {
    const type = 'EQUALLY';
    const userExpenses = Object.keys(selectedMemberIDs).map(memberId => ({
      user_id: memberId,
      amount: amount / Object.keys(selectedMemberIDs).length,
    }));
    alert(userExpenses)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/expenses`, {
        amount,
        description,
        type,
        group_id: id,
        date,
        user_expenses:[selectedMemberIDs]
      }, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${localStorage.getItem('Token')}`
        },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
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
          <h2 className="text-white text-lg font-satoshi">Add Expense</h2>
        </button>
      </div>
      <hr className='bg-white' />

      <Formik
        initialValues={{ description: '', amount: '', date: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, handleChange, values }) => (
          <Form className="w-full max-w-md">
            <div className="flex gap-3 pt-3 justify-center items-center mb-3">
              <FilePenLine className='text-white' />
              <Field type="text" id="description" name="description" className="border-b w-full max-w-xs border-gray-400 p-2 bg-transparent text-white" placeholder="Enter the description" value={values.description} onChange={handleChange} />
            </div>
            <div className='flex justify-start md:pl-20 pl-8'>
              <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
            </div>

            <div className="flex gap-3 justify-center items-center mb-3">
              <IndianRupee className='text-white' />
              <Field type="number" id="amount" name="amount" className="border-b w-full max-w-xs border-gray-400 p-2 bg-transparent text-white" placeholder="0.00" value={values.amount} onChange={handleChange} />
            </div>
            <div className='w-full flex justify-start md:pl-20 pl-8'>
              <ErrorMessage name="amount" component="div" className="text-sm text-red-500" />
            </div>

            <div className="flex gap-3 justify-center items-center mb-3">
              <Calendar className='text-white' />
              <Field type="date" id="date" name="date" className="border-b w-full max-w-xs border-gray-400 p-2 bg-transparent text-white" value={values.date} onChange={handleChange} />
            </div>
            <div className='w-full flex justify-start md:pl-20 pl-8'>
             
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
      <div className="mt-6">
        <span className='text-xl text-white font-satoshi'>
          Paid by <Link to={`/group/${id}/addexpense`} className="bg-white text-black rounded px-2">you</Link> and split <Link to={`/group/${id}/addexpense/adjustamount`} className="bg-white text-black rounded px-2">equally</Link>
        </span>
      </div>
    </div>
  );
};

export default AddExpense;
