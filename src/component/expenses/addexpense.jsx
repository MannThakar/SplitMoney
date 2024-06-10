/* eslint-disable no-unused-vars */

import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, FilePenLine, IndianRupee, Calendar } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import UseLocalStorage from './uselocalstorage'; // Make sure to import the custom hook

const AddExpense = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { state } = location;
  const amounts = state && state.amounts ? state.amounts : {};
  const { selectedMemberIDs = {}, tab = 'equally' } = state || { tab: 'equally' };
  const { user_id = {}, selectedMemberName = 'you' } = state || { user_id: {}, tab: 'equally', selectedMemberName: 'you' };

  const payerUserData = JSON.parse(localStorage.getItem('payer_user_id'));
  const user_name = payerUserData ? payerUserData.selectedMemberName || selectedMemberName : selectedMemberName;
  const payerUserId = payerUserData ? payerUserData.user_id || user_id : user_id;

  // console.log(user_name);
  // console.log(payerUserId)


  const [type, setType] = useState(tab.toUpperCase());

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Description is required'),
    amount: Yup.number().required('Amount is required').positive('Amount must be positive').integer('Amount must be an integer'),
    date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  });

  const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentDate = getCurrentDate();
  const handleSubmit = async ({ description, amount, date }, { setSubmitting }) => {
    let userExpenses = [];
    
    if (type === 'EQUALLY') {
      userExpenses = Object.keys(selectedMemberIDs).map(memberId => ({
        user_id: memberId,
        amount: amount / Object.keys(selectedMemberIDs).length,
      }));
    } else if (type === 'UNEQUALLY') {
      userExpenses = amounts && Object.keys(amounts).length > 0
        ? Object.keys(amounts).map(memberId => ({
          user_id: memberId,
          owned_amount: amounts[memberId],
        }))
        : [];
    }


    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/expenses`, {
        amount,
        description,
        payer_user_id: payerUserId,
        type,
        group_id: id,
        date,
        user_expenses: userExpenses,
      }, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          Authorization: `Bearer ${localStorage.getItem('Token')}`
        },
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate(`/group/${id}`);
        localStorage.removeItem('expenseFormData');
        localStorage.removeItem('payer_user_id');
      } else {
        toast.error(response.data.message);
      }
      setSubmitting(false);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 422) {
        toast.error(error.response.data.message)
      } else {
        toast.error(error.message);
      }
    }
  };

  const initialFormData = JSON.parse(localStorage.getItem('expenseFormData')) || { description: '', amount: '', date: currentDate, payer_user_id: localStorage.getItem('payer_user_id') || user_id };

  return (
    <div className="bg-primaryColor h-screen px-3 flex flex-col items-center">
      <div className="py-3 items-center w-full">
        <button className='flex gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className="text-white flex items-center" />
          <h2 className="text-white text-lg font-nunito">Add Expense</h2>
        </button>
      </div>
      <hr className='bg-white' />

      <Formik
        initialValues={initialFormData}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange
      >
        {({ values, isSubmitting, handleChange }) => {
          UseLocalStorage('expenseFormData', values);

          return (
            <Form className="w-full max-w-md ">
              <div className="flex gap-3 pt-3 justify-center items-center mb-3">
                <FilePenLine className='text-white' />
                <Field type="text" id="description" name="description" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white" placeholder="Enter the description" value={values.description} onChange={handleChange} />
              </div>
              <div className='flex justify-start md:pl-20 pl-10'>
                <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
              </div>

              <div className="flex gap-3 justify-center items-center my-3">
                <IndianRupee className='text-white' />
                <Field type="number" id="amount" name="amount" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white" placeholder="0.00" value={values.amount} onChange={handleChange} />
              </div>
              <div className='w-full flex justify-start md:pl-20 pl-10'>
                <ErrorMessage name="amount" component="div" className="text-sm text-red-500" />
              </div>

              <div className="flex gap-3 justify-center items-center my-3">
                <Calendar className='text-white' />
                <Field type="date" id="date" name="date" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white" value={values.date} onChange={handleChange} />
              </div>

              <div className='w-full flex justify-start md:pl-20 pl-10'>
                <ErrorMessage name="date" component="div" className="text-sm text-red-500" />
              </div>

              <div className="mt-4 flex justify-center">
                <button type="submit" className="w-36 py-2 font-bold text-black rounded-full bg-buttonColor font-nunito" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add'}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
      <div className="mt-6">
        <span className='text-base text-white font-nunito'>Paid by <Link to={`/group/${id}/addexpense/paying`} className='bg-white text-black rounded px-2' >{user_name}</Link>
          and split <Link to={`/group/${id}/addexpense/adjustamount`} className="bg-white text-black rounded px-2">{tab ? tab.toLowerCase() : 'equally'}</Link>
  </span>
</div>
</div>
);
};

export default AddExpense;









