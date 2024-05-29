/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { Pencil, ArrowLeft, Settings, UsersRound, UserRound, CircleUserRound, ReceiptText, Trash2 } from 'lucide-react';
import GroupExpenseUpdate from "../modal/groupexpenseupdate";

const GroupInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [modals, setModals] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  

  const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';
  const groupColor = location.state?.color || '#7c3aed'; // Default color if none is passed

  const getGroupApi = useCallback(async () => {
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

  const fetchExpenseDetails = useCallback(async () => {
    try {
      console.log(`Fetching expense details for group ID: ${id}`);
      const res = await axios.get(`${import.meta.env.VITE_API}/expenses/?includes=user,userExpenses&group_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (res.status === 200) {
        setExpenses(res.data); // Update local state with the fetched data
      } else {
        toast.error('Failed to fetch expense details');
      }
    } catch (error) {
      console.error("Fetch Expense Details Error:", error);
      toast.error("Error fetching expense details");
    }
  }, [id]);

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

  useEffect(() => {
    getGroupApi();
    fetchExpenseDetails();
  }, [getGroupApi, fetchExpenseDetails]);

  return (
    <div className='h-screen bg-primaryColor flex flex-col'>
      <div className="flex w-full justify-between px-3 pt-3">
        <button className='flex items-center flex-row-reverse gap-2' onClick={() => navigate(-1)}>
          <h2 className='text-white text-base font-satoshi'>back</h2>
          <ArrowLeft className='text-white' />
        </button>
        <Link to={`/group/${id}/settings`} state={{ color: groupColor }}>
          <Settings className='text-white hover:text-textColor' />
        </Link>
      </div>

      <div className="relative pl-5 pt-3 flex items-center">
        <div
          className="w-14 h-14 rounded-2xl mr-4"
          style={{ backgroundColor: groupColor }}
        ></div>
        <div>
          <h1 className="font-satoshi text-lg text-white">{group?.name}</h1>
          <h2 className="font-satoshi text-sm text-white">{group?.description}</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 mb-20"> {/* Adjusted for spacing */}
        {expenses.map((expense) => {
          const date = new Date(expense.date);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const day = date.getDate();

          return (
            <div key={expense.id} className="my-4 p-2 bg-stone-700 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="bg-stone-600 p-3 rounded-lg">
                  <span className="text-white font-satoshi text-lg">{expense.description}</span>
                </div>
              </div>
              <button onClick={() => { setSelectedExpense(expense); setModals(true); }}>
                  <Pencil className="text-white hover:text-textColor" />
                </button>

              <div className="flex justify-between items-center">
                <div className="p-2 rounded-lg">
                  <div>
                    <span className="font-bold font-mono text-lg text-white"> {day}-{month}-{year}</span>
                  </div>
                </div>
                <div className=" p-2 rounded-lg">
                  <span className=" text-white font-satoshi text-base">You paid</span>
                  <span className="font-bold text-red-500 text-lg ml-2 font-sans">₹{expense.amount}</span>
                </div>
                <button className='flex items-center' onClick={() => deleteExpense(expense.id)}>
                  <Trash2 className="text-trashColor" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Link to={`/group/${id}/addexpense`}>
        <button className='fixed bottom-20 right-5 text-black w-40 font-satoshi bg-buttonColor font-bold gap-1 py-2 flex justify-center items-center rounded-full'>
          <ReceiptText className='text-black' />Add expense
        </button>
      </Link>

      <div className="flex justify-around w-full fixed bottom-0 bg-primaryColor p-2">
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
          <UsersRound className={`size-5 ${isActive('/')}`} />
          <span className={`flex justify-start text-base font-satoshi ${isActive('/')}`}>Groups</span>
        </button>
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/friends")}>
          <UserRound className={`size-5 ${isActive('/friends')}`} />
          <span className={`flex justify-start text-base font-satoshi ${isActive('/friends')}`}>Friends</span>
        </button>
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/accounts")}>
          <CircleUserRound className={`size-5 ${isActive('/accounts')}`} />
          <span className={`flex justify-start text-base font-satoshi ${isActive('/accounts')}`}>Account</span>
        </button>
      </div>
      {modals && <GroupExpenseUpdate onClose={() => setModals(false)} expense={selectedExpense} />}
    </div>
  );
};

export default GroupInfo;
