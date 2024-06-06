/* eslint-disable no-unused-vars */

import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import GroupExpenseUpdate from '../../component/modal/groupexpenseupdate';

const GroupExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, expenseId } = useParams();
  const [group, setGroup] = useState(null);
  const [modals, setModals] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [getExpenseId, setExpenseId] = useState([]);
  const groupColor = location.state?.color || '#7c3aed'; // Default color if none is passed

  const getGroupApi = (async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setGroup(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [id]);

  const fetchExpenseDetails = (async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/expenses/?includes=user,userExpenses&group_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setExpenseId(res.data)
      if (res.status === 200) {
        setExpenses(res.data); // Update local state with the fetched data
        toast.success(res.data.message)
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Fetch Expense Details Error:", error);
      toast.error("Error fetching expense details");
    }
  }, [id]);

  const ExpenseDetail = async (expenseId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/expenses/${expenseId}?includes=userExpenses.user`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  

  const deleteExpense = useCallback(async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        console.log(`Deleting expense ID: ${expenseId}`);
        const res = await axios.delete(`${import.meta.env.VITE_API}/expenses/${expenseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        if (res.status === 200) {
          toast.success(res.data.message);
          navigate(`/group/${id}`);
          fetchExpenseDetails(); // Fetch updated expense details after deletion
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error("Delete Expense Error:", error);
        toast.error("Error deleting expense");
      }
    }
  }, [fetchExpenseDetails, navigate]);

  useEffect(() => {
    getGroupApi();
    fetchExpenseDetails();
  }, []);

  const handleDeleteExpense = (expenseId) => {
    deleteExpense(expenseId);
  };

  const handleExpenseDetail = (expenseId) => {
    ExpenseDetail(expenseId);
  };

  const handleEditExpense = (expense) => {
    setSelectedExpense(expense);
    setModals(true);
  };

  return (
    <div className='h-screen bg-primaryColor flex flex-col'>
      <div className="flex w-full justify-between px-3 pt-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className='text-white' />
          </button>
          <h2 className='text-white font-nunito text-lg'>Expense Actions</h2>
        </div>
      </div>

      <div className="relative pl-5 flex items-center">
        {group && (
          <h1>{group.name}</h1>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 space-y-4 mb-20">
        {expenses.map((expense) => {
          const date = new Date(expense.date);
          const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;
          const payer = expense.user.id === expense.payer_user_id ? expense.user.name : "Unknown";
          return (
            <div key={expense.id} className="p-2 bg-stone-700 bg-opacity-30 border border-white border-opacity-20 backdrop-blur-lg shadow-lg rounded-lg" onClick={() => navigate(`/group/${id}/expense/${expense.id}/expensedetails`, { state: { expenseId: expense.id } })}>
              <div className="flex justify-between items-center mb-2">
                <div className="bg-stone-600 bg-opacity-50 p-2 rounded-lg">
                  <span className="font-nunito text-lg text-white">{expense.description}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="text-white" onClick={(e) => { e.stopPropagation(); handleEditExpense(expense); }}>
                    <Pencil className="text-white" />
                  </button>
                  <button className="text-white" onClick={(e) => { e.stopPropagation(); handleDeleteExpense(expense.id); }}>
                    <Trash2 className="text-trashColor" />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="p-2 rounded-lg">
                  <div>
                    <span className="font-bold font-nunito text-lg text-white">{formattedDate}</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg">
                  <span className="text-white font-nunito text-base">{payer} paid</span>
                  <span className="font-bold text-red-500 text-lg ml-2 font-sans">₹{expense.amount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modals && (
        <GroupExpenseUpdate
          onClose={() => setModals(false)}
          expense={selectedExpense}
          onUpdate={() => {
            setModals(false);
            fetchExpenseDetails();
          }}
        />
      )}
    </div>
  );
};

export default GroupExpense;
