/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const GroupExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modals, setModals] = useState(false);
  const groupColor = location.state?.color || '#7c3aed';
  const [expenses, setExpenses] = useState([]);

  const deleteExpense = useCallback(async (expenseId) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API}/expenses/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (response.status === 200) {
        setExpenses(expenses.filter(expense => expense.id !== expenseId));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error(`Unauthorized: ${error.response.data.message}`);
        console.log(`Error 401: ${error.response.data.message}`);
      } else {
        toast.error('An error occurred while deleting the expense.');
        console.log(error);
      }
    }
  }, [expenses]);

  return (
    <div className="bg-primaryColor h-svh">
      <div className='pt-3 pl-2 bg-stone-900 h-10 relative'>
        <button className='flex gap-3' onClick={() => navigate(-1)}>
          <ArrowLeft className='text-white' />
          <div className='w-14 h-14 rounded-2xl flex justify-start' style={{ backgroundColor: groupColor }}></div>
          <div className='flex gap-6 absolute right-3'>
                      {/* Add a delete button for each expense dynamically */}
             <button className='flex items-center' onClick={() => deleteExpense(expense.id)}>
            <Trash2 className="text-trashColor" />
            </button>
            <Pencil className="text-white hover:text-textColor" />
          </div>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4 mb-20">
        {expenses.map((expense) => {
          const date = new Date(expense.date);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const day = date.getDate();

          return (
            <Link key={expense.id} to={`/group/${expense.id}/expense`} state={{ color: groupColor }}>
              <div className="my-4 p-2 bg-stone-700 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="bg-stone-600 p-3 rounded-lg">
                    <span className="text-white font-satoshi text-lg">{expense.description}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="p-2 rounded-lg">
                    <div>
                      <span className="font-bold font-mono text-lg text-white">{day}-{month}-{year}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg">
                    <span className="text-white font-satoshi text-base">You paid</span>
                    <span className="font-bold text-red-500 text-lg ml-2 font-sans">₹{expense.amount}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GroupExpense;




 {/* <button onClick={() => { setSelectedExpense(expense); setModals(true); }}>

                </button> */}
                {/* <button className='flex items-center' onClick={() => deleteExpense(expense.id)}>
                </button> */}