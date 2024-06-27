/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { ArrowLeft, Settings, UsersRound, UserRound, CircleUserRound, ReceiptText,Banknote } from 'lucide-react';
import GroupExpenseUpdate from "../../component/modal/groupexpenseupdate";
import { CiViewList } from "react-icons/ci";
import SplashScreen from '../utils/splashscreen';
import Footer from '../ui/footer'

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
  const groupColor = location.state?.color || '#7c3aed'; // Default color if none is passed
  const imageURL = location.state?.img;
  const ImageOrIcon = ({ imageURL, icon: Icon, className }) => {
  return (
    <>
      {imageURL ? (
        <img src={imageURL} alt="Group" className={className} />
      ) : (
        <Icon className={className} />
      )}
    </>
  );
};

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

  const Statistics = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/group-statistics/${id}`, {
          headers:{
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
      });
      if (response.status === 200) {
        // toast.success(response.data.message);
        setGroupState(response.data)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response.status === 500) {
        toast.error(error.response.data.message)
      } else {
        toast.error(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    Statistics()
  },[])

  //for calling the settlement in same api
  //.user,settlements.payee 
  const fetchExpenseDetails = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/expenses/?includes=user,userExpenses.user,settlements.payee&group_id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (res.status === 200) {
       
        // const sortedExpenses = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        // setExpenses(sortedExpenses);
        setExpenses(res.data)
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
  }, [getGroupApi,fetchExpenseDetails]);

  const getUserExpenses = (userId) => {
    return expenses.map(expense => {
      const userExpense = expense.user_expenses.find(ue => ue.user_id === userId);
      return userExpense ? { expenseId: expense.id, ownedAmount: userExpense.owned_amount } : null;
    }).filter(item => item !== null);
  };
  return (
  <div className='h-screen bg-primaryColor flex flex-col'>
 
  <div>
    {userId ? (
    <> 
      <div className="flex w-full justify-between px-2 py-3">
        <button onClick={() => navigate('/')}>
          <ArrowLeft className='text-white' />
        </button>
        <Link to={`/group/${id}/settings`} state={{ color: groupColor, imageURL }}>
          <Settings className='text-white hover:text-textColor' />
        </Link>
      </div>

      <div className="relative px-4 pt-3 flex items-center">
        <div className="w-14 h-14 rounded-2xl mr-4">
          <ImageOrIcon
            imageURL={imageURL}
            icon={CiViewList}
            className='w-full h-full object-cover rounded-2xl text-white'
          />
        </div>
              
          <div>
            <h1 className="text-lg text-white font-nunito">{group?.name}</h1>
            <h2 className="text-sm text-white font-nunito">{group?.description}</h2>
          </div>
            </div>
            
      {/* <div className='px-5 pt-3'>
        <button className='font-nunito py-1 w-1/3 md:w-1/12  font-bold rounded-md text-black bg-white' onClick={() => navigate(`/group/${id}/expense/settlebalance`)}>Settle up</button>
      </div> */}
      
      {expenses.length == '' ? '' : <div className='px-5 pt-3'> <button className='font-nunito py-2 w-1/3 md:w-1/12  font-bold rounded-md text-black bg-white' onClick={() => navigate(`/group/${id}/expense/settlebalance`)}>Settle up</button></div>}

        {Array.isArray(groupState) && groupState.length > 0 ? (
          groupState.map((item, index) => (
            <div key={index} className="mb-2 h-5">
              <span>Type:
                <span
                  className='text-white flex justify-start px-5 items-center font-nunito text-sm font-semibold'
                  style={{
                    color: item.expense.type === "DEBT"
                      ? (item.expense.total === 0 ? 'white' : '#09B83E')
                      : (item.expense.type === "BALANCED" ? 'white' : 'red')
                  }}
                >
                  {item.expense.type === "DEBT"
                    ? `${item.user.name} Lent ₹${item.expense.total.toFixed(2)}`
                    : item.expense.type === "BALANCED"
                      ? `${item.user.name} and you are balanced`
                      : `${item.user.name} Borrow ₹${item.expense.total.toFixed(2)}`}
                </span>
              </span>
            </div>
          ))
        ) : (
          <div className="mt-1 px-5 text-white">
            {groupState.message}
          </div>
        )}
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
            const payer = expense.user.id === expense.payer_user_id ? expense.user.name : "Unknown";

            if (expense.type === "SETTLEMENT") {
              const settlement = expense.settlements[0];
              const payerName = settlement.payer_user_id === expense.user.id ? expense.user.name : "Unknown";
              const payeeName = settlement.payee_id === settlement.payee.id ? settlement.payee.name : "Unknown";

          
              return (
                <div key={expense.id} className="my-4 p-2  text-sm font-nunito font-medium bg-stone-600 bg-opacity-30 backdrop-blur-lg shadow-lg rounded-lg">
                  <Link to={`/group/${id}/settlement`}>
                    <div className="flex justify-center items-center lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div id="date" className="text-center lg:text-left">
                        <div className="flex flex-col items-center justify-center lg:order-1">
                          <span className="text-white">{day}</span>
                          <span className="text-white">{month}</span>
                          <span className="text-white">{year}</span>
                        </div>
                      </div>
                      <div id="data" className="flex flex-col items-center lg:items-center lg:flex-grow lg:justify-center">
                        <div className="flex gap-1 flex-col">
                          <span className="text-white flex justify-center items-center lg:justify-center gap-2">
                            <Banknote className='text-green-500 h-7 w-7' /> {payerName} paid to {payeeName} ₹{settlement.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            }
            const isPayerAndUser = userId === expense.user.id && userId === expense.payer_user_id;
            const amountToShow = isPayerAndUser ? expense.you_lent : expense.user_expenses.find(ue => ue.user_id === userId)?.owned_amount || 0;
            const textColor = isPayerAndUser ? 'text-lentColor' : 'text-borrowColor';

        
      return (
      <div key={expense.id} className="my-4 p-2 font-medium text-sm bg-stone-600 bg-opacity-30 backdrop-blur-lg shadow-lg rounded-lg">
        <Link to={`/group/${expense.group_id}/expense/${expense.id}`} state={{ color: groupColor }}>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex lg:flex-row w-full gap-5 lg:items-center">
              <div className="flex flex-col items-center justify-center lg:order-1">
                <span className="text-white">{day}</span>
                <span className="text-white">{month}</span>
                <span className="text-white">{year}</span>
              </div>

              <div className="flex flex-col justify-center items-center lg:order-2 lg:flex-grow lg:items-center">
                <span className="text-white flex justify-start items-start line-clamp-1 break-all text-center">{expense.description}</span>
                <h4 className="text-white text-center">{expense.user.name} paid ₹{expense.amount.toFixed(2)}</h4>
              </div>

              <div className="flex flex-col justify-center items-center lg:order-3 lg:self-center text-center">
                <span className={textColor}>{isPayerAndUser ? `you lent ₹${amountToShow.toFixed(2)}` : `you borrow ₹${amountToShow.toFixed(2)}`}</span>
              </div>
            </div>
          </div>
        </Link>
          </div>
          );
          })}
        </div>

    <Link to={`/group/${id}/addexpense`}>
      <button className='fixed bottom-20 right-5 text-black w-40 bg-buttonColor font-bold gap-1 py-2 flex justify-center items-center rounded-full'>
        <ReceiptText className='text-black' />Add expense
      </button>
    </Link>
      </>
      ):(
        <SplashScreen/>
        )} 
  </div>    
    
    <Footer/>
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

