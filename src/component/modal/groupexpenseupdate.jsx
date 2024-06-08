/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// /* eslint-disable react/prop-types */
// import { X, FilePenLine, IndianRupee, Calendar } from 'lucide-react';
// import { useState, useRef, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// function GroupExpenseUpdate({ onClose, expense, onUpdate,isUpdate,setIsUpdate }) {
//     const modalRef = useRef();
//     const [expenseData, setExpenseData] = useState(expense);

//     const handleInputChange = useCallback((field, value) => {
//         setExpenseData((prev) => ({ ...prev, [field]: value }));
//     }, []);

//     const expenseUpdate = useCallback(async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.put(
//                 `${import.meta.env.VITE_API}/expenses/${expenseData.id}`,
//                 {
//                     group_id: expenseData.group_id,
//                     amount: expenseData.amount,
//                     type: expenseData.type,
//                     description: expenseData.description,
//                     date: expenseData.date,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('Token')}`
//                     }
//                 }
//             );

//             if (response.status === 200) {
//                 onUpdate();
//                 toast.success(response.data.message);
//                 setIsUpdate(!isUpdate);

//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             toast.error('An error occurred while updating the expense.');
//             console.log(error);
//         }
//     }, [expenseData, onUpdate]);

//     const closeModal = useCallback((e) => {
//         if (modalRef.current === e.target) {
//             onClose();
//         }
//     }, [onClose]);

//     useEffect(() => {
//         setExpenseData(expense);
//     }, [expense]);

//     return (
//         <>
//             <div ref={modalRef} onClick={closeModal} className="fixed inset-0 z-10 bg-black bg-opacity-40 backdrop-blur-2xl flex items-center justify-center">
//                 <div className="bg-stone-800 w-11/12 h-80 py-4 md:w-2/5 rounded-xl mx-auto p-6">
//                     <div className="flex justify-end">
//                         <button onClick={onClose}>
//                             <X className="text-white" />
//                         </button>
//                     </div>
//                     <h1 className="text-center font-nunito text-xl text-white mb-4">Expense Update</h1>
//                     <form onSubmit={expenseUpdate} className="space-y-4">
//                         <div>
//                             <div className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
//                                 <Calendar className="text-white ml-3" />
//                                 <input
//                                     type="date"
//                                     name="date"
//                                     value={expenseData.date}
//                                     onChange={(e) => handleInputChange('date', e.target.value)}
//                                     className="w-full p-2 text-white bg-transparent border-none outline-none"
//                                 />
//                             </div>
//                         </div>
//                         <div>
//                             <div className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
//                                 <IndianRupee className="text-white ml-3" />
//                                 <input
//                                     type="text"
//                                     name="amount"
//                                     value={expenseData.amount}
//                                     onChange={(e) => handleInputChange('amount', e.target.value)}
//                                     placeholder="Amount"
//                                     className="w-full p-2 text-white bg-transparent border-none outline-none"
//                                 />
//                             </div>
//                         </div>
//                         <div>
//                             <div className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
//                                 <FilePenLine className="text-white ml-3" />
//                                 <input
//                                     type="text"
//                                     name="description"
//                                     value={expenseData.description}
//                                     onChange={(e) => handleInputChange('description', e.target.value)}
//                                     placeholder="Description"
//                                     className="w-full p-2 text-white bg-transparent border-none outline-none"
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex justify-center">
//                             <button
//                                 type="submit"
//                                 className="bg-white w-40 font-bold text-black font-nunito p-2 rounded-md"
//                             >
//                                 Update
//                             </button>
//                         </div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default GroupExpenseUpdate;




// import { X, FilePenLine, IndianRupee, Calendar, User } from 'lucide-react';
// import { useState, useRef, useEffect, useCallback } from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// function GroupExpenseUpdate({ onClose, expense, onUpdate, isUpdate, setIsUpdate }) {
//   const modalRef = useRef();
//   const location = useLocation();
//   const id = location.pathname.split("/")[4];
//   console.log(id);

//   const [members, setMembers] = useState([]);
//   const { selectedMemberIDs = [], amounts: initialAmounts = {}, tab } = location.state || {};
//   const [amounts, setAmounts] = useState(initialAmounts);
//   console.log(selectedMemberIDs);

//   const viewMember = useCallback(async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("Token")}`,
//         },
//       });
//       const membersData = res.data.members;
//       setMembers(membersData);
//     } catch (error) {
//       console.error("Group Members", error);
//     }
//   }, [id]);

//   useEffect(() => {
//     viewMember();
//   }, [viewMember]);

//   const [expenseData, setExpenseData] = useState(expense);

//   const handleInputChange = useCallback((field, value) => {
//     setExpenseData((prev) => ({ ...prev, [field]: value }));
//   }, []);

//   const handleAmountChange = (memberId, amount) => {
//     if (amount.length <= 4 && /^\d{0,4}$/.test(amount)) {
//       setAmounts((prevAmounts) => ({
//         ...prevAmounts,
//         [memberId]: amount,
//       }));
//     }
//   };

//   const expenseUpdate = useCallback(async (e) => {
//     e.preventDefault();
//     let userExpenses = selectedMemberIDs.map(memberId => ({
//       user_id: memberId,
//     }));

//     try {
//       const response = await axios.put(
//         `${import.meta.env.VITE_API}/expenses/${expenseData.id}`,
//         {
//           group_id: expenseData.group_id,
//           amount: expenseData.amount,
//           type: expenseData.type,
//           description: expenseData.description,
//           date: expenseData.date,
//           user_expenses: userExpenses,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('Token')}`
//           }
//         }
//       );

//       if (response.status === 200) {
//         onUpdate();
//         toast.success(response.data.message);
//         setIsUpdate(!isUpdate);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error('An error occurred while updating the expense.');
//       console.log(error);
//     }
//   }, [expenseData, onUpdate, selectedMemberIDs, amounts, tab, setIsUpdate, isUpdate]);

//   const closeModal = useCallback((e) => {
//     if (modalRef.current === e.target) {
//       onClose();
//     }
//   }, [onClose]);

//   useEffect(() => {
//     setExpenseData(expense);
//   }, [expense]);

//   return (
//     <>
//       <div ref={modalRef} onClick={closeModal} className="fixed inset-0 z-10 bg-black bg-opacity-40 backdrop-blur-2xl flex items-center justify-center">
//         <div className="bg-stone-800 w-11/12 h-80 py-4 md:w-2/5 rounded-md shadow-lg">
//           <div className="flex justify-end px-5">
//             <button onClick={onClose}>
//               <X className="text-white" />
//             </button>
//           </div>
//           <h1 className="text-center font-nunito text-xl text-white mb-4">Expense Update</h1>
//           <form onSubmit={expenseUpdate} className="space-y-4">
//             <div>
//               <div className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
//                 <Calendar className="text-white ml-3" />
//                 <input
//                   type="date"
//                   name="date"
//                   onChange={(e) => handleInputChange('date', e.target.value)}
//                   className="w-full p-2 text-white bg-transparent border-none outline-none"
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
//                 <IndianRupee className="text-white ml-3" />
//                 <input
//                   type="text"
//                   name="amount"
//                   onChange={(e) => handleInputChange('amount', e.target.value)}
//                   placeholder="Amount"
//                   className="w-full p-2 text-white bg-transparent border-none outline-none"
//                 />
//               </div>
//             </div>
//             {tab === 'unequally' ? (
//               members.map((member) => (
//                 <div key={member.id} className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
//                   <User className="text-white ml-3" />
//                   <span className="text-white ml-3">{member.name}</span>
//                   <input
//                     type="text"
//                     value={amounts[member.id] || ''}
//                     onChange={(e) => handleAmountChange(member.id, e.target.value)}
//                     placeholder="Amount"
//                     className="w-full p-2 text-white bg-transparent border-none outline-none"
//                   />
//                 </div>
//               ))
//             ) : (
//               <div>
//                 <div className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
//                   <FilePenLine className="text-white ml-3" />
//                   <input
//                     type="text"
//                     name="description"
//                     onChange={(e) => handleInputChange('description', e.target.value)}
//                     placeholder="Description"
//                     className="w-full p-2 text-white bg-transparent border-none outline-none"
//                   />
//                 </div>
//               </div>
//             )}
//             <div className="flex justify-center">
//               <button
//                 type="submit"
//                 className="bg-white w-40 font-bold text-black font-nunito p-2 rounded-md"
//               >
//                 Update
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default GroupExpenseUpdate;

/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FilePenLine, IndianRupee, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function ExpenseForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { selectedMemberIDs, amounts, tab } = location.state || { selectedMemberIDs: {}, amounts: {}, tab: 'equally' };
  const [initialValues, setInitialValues] = useState({
    description: '',
    amount: '',
    date: '',
    type:'',
  });
  const [type, setType] = useState(tab.toUpperCase());
  console.log(selectedMemberIDs)
  console.log(tab)
  console.log(amounts)
  const id = location.pathname.split("/")[2];
  const expenseId = location.pathname.split("/")[4];

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

  const handleSubmit = async (values, { setSubmitting,amount }) => {
    setIsLoading(true);
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
        const response = await axios.put(`${import.meta.env.VITE_API}/expenses/${expenseId}`,
        {
          group_id: id,
          amount: values.amount,
          type,
          description: values.description,
          date: values.date,
          user_expenses: userExpenses,
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
      } else {
        toast.error(error);
      }
    }
    setIsLoading(false);
    setSubmitting(false);
  };

  return (
    <>
      <div className='bg-primaryColor h-svh px-3 flex flex-col'>
        <div className='py-2'>
          <button className='flex gap-2 items-center' onClick={() => navigate(-1)}>
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
            <Form>
              <div className="flex gap-3 pt-3 justify-center items-center mb-3">
                <FilePenLine className='text-white' />
                <Field type="text" id="description" name="description" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white"
                  placeholder="Enter the description" />
              </div>
              <div className='flex justify-start md:pl-20 pl-10'>
                <ErrorMessage name="description" component="div" className="text-sm text-red-500" />
              </div>

              <div className="flex gap-3 justify-center items-center my-3">
                <IndianRupee className='text-white' />
                <Field type="number" id="amount" name="amount" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white"
                  placeholder="0.00" />
              </div>
              <div className='w-full flex justify-start md:pl-20 pl-10'>
                <ErrorMessage name="amount" component="div" className="text-sm text-red-500" />
              </div>

              <div className="flex gap-3 justify-center items-center my-3">
                <Calendar className='text-white' />
                <Field type="date" id="date" name="date" className="border-b w-full max-w-xs border-gray-400 focus:outline-none bg-transparent text-white" />
              </div>
              <div className='w-full flex justify-start md:pl-20 pl-10'>
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
            Paid by <Link to={`/group/${id}/addexpense`} className="bg-white text-black rounded px-2">you</Link> and split <Link to={`/group/${id}/expense/${expenseId}/expensedetails/editexpense/updateamount`} className="bg-white text-black rounded px-2">{tab === 'equally' ? 'equally' : 'unequally'}</Link>
          </span>
        </div>
      </div>                                              
    </>
  );
}

export default ExpenseForm;



