/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Settings, UsersRound, UserRound, CircleUserRound, ReceiptText } from 'lucide-react';
import GroupExpenseUpdate from "../../component/modal/groupexpenseupdate";

const GroupInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [modals, setModals] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [group, setGroup] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [userId, setUserId] = useState(null); // Add state for user ID
  const [groupState, setGroupState] = useState([]);

  const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';
  const groupColor = location.state?.color || '#7c3aed'; // Default color if none is passed
  const imageURL = location.state?.imageURL || 'https://www.w3schools.com/w3images/avatar2.png';

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

  const Statistics  = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/group-statistics/${id}`, {
          headers:{
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setGroupState(response.data)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    Statistics()
  },[])

  const fetchExpenseDetails = useCallback(async () => {
    try {
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

  useEffect(() => {
    getGroupApi();
    fetchExpenseDetails();
    const fetchUserId = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API}/me`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        setUserId(res.data.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    fetchUserId();
  }, [getGroupApi, fetchExpenseDetails]);

  const getUserExpenses = (userId) => {
    return expenses.map(expense => {
      const userExpense = expense.user_expenses.find(ue => ue.user_id === userId);
      return userExpense ? { expenseId: expense.id, ownedAmount: userExpense.owned_amount } : null;
    }).filter(item => item !== null);
  };

  return (
    <div className='h-screen bg-primaryColor flex flex-col'>
      <div className="flex w-full justify-between px-2 py-3">
        <button onClick={() => navigate('/')}>
          <ArrowLeft className='text-white' />
        </button>
        <Link to={`/group/${id}/settings`} state={{ color: groupColor,imageURL }}>
          <Settings className='text-white hover:text-textColor' />
        </Link>
      </div>

      <div className="relative pl-5 pt-3 flex items-center">
        <div
          className="w-14 h-14 rounded-2xl mr-4"
          style={{ backgroundColor: groupColor }}
        >
            {/* <img src={imageURL} alt='Group' className='w-full h-full object-cover rounded-2xl'/> */}
        </div>
        
        <div>
          <h1 className="text-lg text-white font-nunito">{group?.name}</h1>
          <h2 className="text-sm text-white font-nunito">{group?.description}</h2>
        </div>
      </div>
      {groupState.map((item, index) => (
          <div key={index} className="mt-1">
              {/* <span className='text-white'>{item.user.name}</span>
              <span className='text-white'>Total: {item.expense.total}</span> */}
              <p>Type:
                 <span className='text-white font-nunito text-sm font-bold' style={{ color: item.expense.type === "DEBT" ? '#09B83E' : 'red' }}>
                { item.expense.type == "DEBT" ? `You Owe ${item.user.name } ₹${item.expense.total.toFixed(2)}`:`${item.user.name} Owes you ₹${item.expense.total.toFixed(2)}`}</span>
              </p>
             
          </div>
        ))}

      <div className="flex-1 overflow-y-auto px-3 py-4 mb-20">
        {expenses.map((expense) => {
          const date = new Date(expense.date);
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const day = date.getDate();

          const createdAtDate = new Date(expense.created_at);
          const createdAtMonth = createdAtDate.toLocaleString('default', { month: 'short' });
          const createdAtYear = createdAtDate.getFullYear();
          const createdAtDay = createdAtDate.getDate();

          const userExpense = userId ? expense.user_expenses.find(ue => ue.user_id === userId) : null;
          const ownedAmount = userExpense ? userExpense.owned_amount : 0;

          // Find the user who paid the amount
          const payer = expense.user.id === expense.payer_user_id ? expense.user.name : "Unknown";

          return (
            <div key={expense.id} className="my-4 p-2 bg-stone-700 bg-opacity-30 border border-white border-opacity-20 backdrop-blur-lg shadow-lg rounded-lg">
              <Link to={`/group/${id}/expense/${expense.id}/expensedetails`} state={{ color: groupColor }}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold font-nunito text-base text-white">
                      {day}-{month}-{year}
                    </h2>
                    <span className="font-bold font-nunito text-sm text-trashColor">
                      you borrow: ₹{ownedAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-white font-nunito text-base">{expense.description}</h3>
                    <h4 className="text-white font-nunito text-base">
                      {payer} paid ₹{expense.amount.toFixed(2)}
                    </h4>
                  </div>
                  <div>
                    <h2 className='font-nunito text-white text-sm'>Created at: {createdAtDay}-{createdAtMonth}-{createdAtYear}</h2>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      <Link to={`/group/${id}/addexpense`}>
        <button className='fixed bottom-20 right-5 text-black w-40 bg-buttonColor font-bold gap-1 py-2 flex justify-center items-center rounded-full'>
          <ReceiptText className='text-black'/>Add expense
        </button>
      </Link>
      
      <div className="flex justify-around w-full fixed bottom-0 bg-primaryColor p-2">
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
          <UsersRound className={`size-5 ${isActive('/')}`} />
          <span className={`flex justify-start text-base ${isActive('/')}`}>Groups</span>
        </button>
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/friends")}>
          <UserRound className={`size-5 ${isActive('/friends')}`} />
          <span className={`flex justify-start text-base ${isActive('/friends')}`}>Friends</span>
        </button>
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/accounts")}>
          <CircleUserRound className={`size-5 ${isActive('/accounts')}`} />
          <span className={`flex justify-start text-base ${isActive('/accounts')}`}>Account</span>
        </button>
      </div>
      {modals && selectedExpense && (
        <GroupExpenseUpdate
          modals={modals}
          setModals={setModals}
          expense={selectedExpense}
        />
      )}
    </div>
  );
};

export default GroupInfo;


