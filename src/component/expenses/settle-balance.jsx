import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SplashScreen from '../utils/splashscreen';

const SettleBalance = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [expenses, setExpenses] = useState([]);

    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/group-statistics/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setExpenses(response.data);
            console.log('Response data:', response.data);
            if (response.status === 200) {
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, [id]);

    return (
        <div className="bg-primaryColor h-svh">
            <div className='py-3 px-2'>
                <button className='flex gap-2 items-center' onClick={() => navigate(-1)}>
                    <ArrowLeft className='text-white' />
                    <h2 className='text-white text-lg font-nunito'>Select a balance to settle</h2>
                </button>
            </div>
           <div className="px-2">
          {expenses && expenses.length > 0 ? expenses.map((expenseItem) => (
            <div
              key={expenseItem.user.id}
              className="flex justify-between my-1 items-center cursor-pointer hover:bg-secondaryColor p-2 rounded"
              onClick={() => navigate(`/group/${id}/expense/settlebalance/recordpayment`, { state: { user_id: expenseItem.user.id, total: expenseItem.expense.total } })}
            >
              <span className='text-white'>{expenseItem.user.name}</span>
              {expenseItem.expense.type === 'DEBT' ? (
                <span className="text-green-500">You are owed ₹ {expenseItem.expense.total.toFixed(2)}</span>
              ) : expenseItem.expense.type === 'BALANCED' ? (
                <span className="text-white">Balanced</span>
              ) : expenseItem.expense.type === 'CREDIT' ? (
                <span className="text-red-500 flex justify-end">You owe ₹ {expenseItem.expense.total.toFixed(2)}</span>
              ) : (
                <span className="text-white">No data</span>
              )}
            </div>
          )) : (
            <SplashScreen />
          )}
        </div>
      {/* <div className="px-2">
        {expenses && expenses.length > 0 ? (
          expenses.filter(expenseItem => expenseItem.expense.type === 'CREDIT').map((expenseItem) => (
            <div
              key={expenseItem.user.id}
              className="flex justify-between my-1 items-center cursor-pointer hover:bg-secondaryColor p-2 rounded"
              onClick={() => navigate(`/group/${id}/expense/settlebalance/recordpayment`, { state: { user_id: expenseItem.user.id, total: expenseItem.expense.total } })}
            >
              <span className='text-white'>{expenseItem.user.name}</span>
              <span className="text-red-500 flex justify-end">You owe ₹ {expenseItem.expense.total.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <SplashScreen />
        )}
      </div> */}
      </div>
    );
};

export default SettleBalance;
