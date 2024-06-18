
// import { useState, useEffect } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { FilePenLine, IndianRupee, Calendar, ArrowLeft } from 'lucide-react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';

// function GroupExpenseUpdate() {
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const { selectedMemberIDs, amounts, tab } = location.state || { selectedMemberIDs: {}, amounts: {}, tab: 'equally' };
//   const [initialValues, setInitialValues] = useState({
//     description: '',
//     amount: '',
//     date: '',
//     type:'',
//   });
//   const [type, setType] = useState(tab.toUpperCase());
 
//   useEffect(() => {
//     const expenseId = location.pathname.split("/")[4];
//     localStorage.setItem('expenseId',expenseId);
//   }, [location.pathname]);
//   const expenseId = location.pathname.split("/")[4];
//   const id = location.pathname.split("/")[2];
//   const validationSchema = Yup.object().shape({
//     description: Yup.string().required('Description is required'),
//     amount: Yup.number().required('Amount is required').positive('Amount must be positive').integer('Amount must be an integer'),
//     date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
//   });

//   const fetchExpenseDetail = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_API}/expenses/${expenseId}?includes=user,userExpenses.user`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("Token")}`,
//         },
//       });
//       setInitialValues({
//         description: response.data.description,
//         amount: response.data.amount,
//         date: response.data.date,
//         type: response.data.type,
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchExpenseDetail();
//   }, []);

//   const handleSubmit = async (values, { setSubmitting, amount }) => {
//     setIsLoading(true);
//     let userExpenses = [];

//     if (type === 'EQUALLY') {
//       userExpenses = Object.keys(selectedMemberIDs).map(memberId => ({
//         user_id: memberId,
//         amount: amount / Object.keys(selectedMemberIDs).length,
//       }));
//     } else if (type === 'UNEQUALLY') {
//       userExpenses = amounts && Object.keys(amounts).length > 0
//         ? Object.keys(amounts).map(memberId => ({
//           user_id: memberId,
//           owned_amount: amounts[memberId],
//         }))
//         : [];
//     }

//     try {
//         console.log('expenseId::::::::::::::',expenseId)
//       const response = await axios.put(`${import.meta.env.VITE_API}/expenses/${expenseId}`,
//         {
//           group_id: id,
//           amount: values.amount,
//           type,
//           description: values.description,
//           date: values.date,
//           user_expenses: userExpenses,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('Token')}`,
//           },
//         });

//       if (response.status === 200) {
//         toast.success(response.data.message);
//         navigate(`/group/${id}/expense/${expenseId}/expensedetails`);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 400) {
//         toast.error(error.response.data.message);
//       } else if (error.response && error.response.status === 500) {
//         toast.error(error.response.data.message);
//       } else if (error.response && error.response.status === 422) { 
//         toast.error(error.response.data.message);
//       }else {
//         toast.error(error);
//       }
//     }
//     setIsLoading(false);
//     setSubmitting(false);
//   };

//   return (
//     <>
//       <div className='bg-primaryColor h-screen px-3 flex flex-col items-center'>
//         <div className='py-3 items-center w-full'>
//           <button className='flex gap-2 items-center' onClick={() => navigate(-1)}>
//             <ArrowLeft className='text-white' />
//             <h2 className='text-white text-lg font-nunito'>Edit Expense</h2>
//           </button>
//         </div>

//         <Formik
//           initialValues={initialValues}
//           enableReinitialize={true}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <Form className="w-full max-w-md ">
//               <div className="flex gap-3 my-3 justify-center items-center">
//                 <FilePenLine className='text-white' />
//                 <Field type="text" id="description" name="description" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white"
//                   placeholder="Enter the description" />
//               </div>
//               <div className='flex justify-start pl-8 md:pl-20'>
//                 <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
//               </div>

//               <div className="flex gap-3 justify-center items-center my-3">
//                 <IndianRupee className='text-white' />
//                 <Field type="number" id="amount" name="amount" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white"
//                   placeholder="0.00" />
//               </div>
//               <div className="flex justify-start pl-8 md:pl-20">
//                 <ErrorMessage name="amount" component="div" className="text-sm text-red-500" />
//               </div>

//               <div className="flex gap-3 justify-center items-center my-3">
//                 <Calendar className='text-white' />
//                 <Field type="date" id="date" name="date" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white" />
//               </div>
//               <div className='flex justify-start pl-8 md:pl-20'>
//                 <ErrorMessage name="date" component="div" className="text-sm text-red-500" />
//               </div>

//               <div className="mt-4 flex justify-center">
//                 <button type="submit" className="w-36 py-2 font-bold text-black rounded-full bg-buttonColor font-nunito" disabled={isSubmitting}>
//                   {isLoading ? 'Updating...' : 'Update'}
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//         <div className="mt-6 md:flex md:justify-center flex justify-center mx-2">
//           <span className='text-base text-white font-nunito'>
//             Paid by <Link className="bg-white text-black rounded px-2" to={`/group/${id}/expense/${expenseId}/expensedetails/updatepayer`}>you</Link> and split <Link to={`/group/${id}/expense/${expenseId}/expensedetails/editexpense/updateamount`} className="bg-white text-black rounded px-2">{tab === 'equally' ? 'equally' : 'unequally'}</Link>
//           </span>
//         </div>
//       </div>
//     </>
//   );
// }

// export default GroupExpenseUpdate;

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FilePenLine, IndianRupee, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function GroupExpenseUpdate() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  
  const { selectedMemberIDs = {}, amounts = {}, tab = 'equally' } = location.state || {};
  const { user_id = {}, selectedMemberName = 'you' } = state || { user_id: {}, tab: 'equally', selectedMemberName: 'you' };
  const payerUserData = JSON.parse(localStorage.getItem('payer_user_id'));
  const user_name = payerUserData ? payerUserData.selectedMemberName || selectedMemberName : selectedMemberName;
  const payerUserId = payerUserData ? payerUserData.user_id || user_id : user_id;
  const uid = localStorage.getItem('USER-ID');
  console.log('payerid',payerUserId);


  console.log('memberid:::::',user_id,selectedMemberName);
  const [initialValues, setInitialValues] = useState({
    description: '',
    amount: '',
    date: '',
    type: '',
  });
  const [type, setType] = useState(tab.toUpperCase());
 
  useEffect(() => {
    const expenseId = location.pathname.split("/")[4];
    localStorage.setItem('expenseId', expenseId);
  }, [location.pathname]);

  const expenseId = location.pathname.split("/")[4];
  const id = location.pathname.split("/")[2];

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Description is required'),
    amount: Yup.number().required('Amount is required').positive('Amount must be positive').integer('Amount must be an integer'),
    date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  });

  const fetchExpenseDetail = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/expenses/${expenseId}?includes=user,userExpenses.user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setInitialValues({
        description: response.data.description,
        amount: response.data.amount,
        date: response.data.date,
        type: response.data.type,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExpenseDetail();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    let userExpenses = [];

    if (type === 'EQUALLY') {
      userExpenses = Object.keys(selectedMemberIDs).map(memberId => ({
        user_id: memberId,
        amount: values.amount / Object.keys(selectedMemberIDs).length,
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
      const response = await axios.put(`${import.meta.env.VITE_API}/expenses/${expenseId}`,
        {
          group_id: id,
          amount: values.amount,
          type,
          description: values.description,
          date: values.date,
          user_expenses: userExpenses,
          payer_user_id:uid || payerUserId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
          },
        });

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate(`/group/${id}/expense/${expenseId}/expensedetails`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 422) { 
        toast.error(error.response.data.message);
      } else {
        toast.error(error);
      }
    }
    setIsLoading(false);
    setSubmitting(false);
  };

  return (
    <div className='bg-primaryColor h-screen px-3 flex flex-col items-center'>
      <div className='py-3 items-center w-full'>
        <button className='flex gap-2 items-center' onClick={() => navigate(`/group/${id}/expense/${expenseId}/expensedetails`)}>
          <ArrowLeft className='text-white' />
          <h2 className='text-white text-lg font-nunito'>Edit Expense</h2>
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="w-full max-w-md">
            <div className="flex gap-3 my-3 justify-center items-center">
              <FilePenLine className='text-white' />
              <Field type="text" id="description" name="description" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white"
                placeholder="Enter the description" />
            </div>
            <div className='flex justify-start pl-8 md:pl-20'>
              <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
            </div>

            <div className="flex gap-3 justify-center items-center my-3">
              <IndianRupee className='text-white' />
              <Field type="number" id="amount" name="amount" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white"
                placeholder="0.00" />
            </div>
            <div className="flex justify-start pl-8 md:pl-20">
              <ErrorMessage name="amount" component="div" className="text-sm text-red-500" />
            </div>

            <div className="flex gap-3 justify-center items-center my-3">
              <Calendar className='text-white' />
              <Field type="date" id="date" name="date" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white" />
            </div>
            <div className='flex justify-start pl-8 md:pl-20'>
              <ErrorMessage name="date" component="div" className="text-sm text-red-500" />
            </div>

            <div className="mt-4 flex justify-center">
              <button type="submit" className="w-36 py-2 font-bold text-black rounded-full bg-buttonColor font-nunito" disabled={isSubmitting}>
                {isLoading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-6 md:flex md:justify-center flex justify-center mx-2">
        <span className='text-base text-white font-nunito'>
          Paid by <Link className="bg-white text-black rounded px-2" to={`/group/${id}/expense/${expenseId}/expensedetails/updatepayer`}>{user_name}</Link> and split <Link to={`/group/${id}/expense/${expenseId}/expensedetails/editexpense/updateamount`} className="bg-white text-black rounded px-2">{tab === 'equally' ? 'equally' : 'unequally'}</Link>
        </span>
      </div>
    </div>
  );
}

export default GroupExpenseUpdate;