import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SplashScreen  from '../utils/splashscreen';

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
    }, []);

    return (
        <div className="bg-primaryColor h-svh">
            <div className='py-3 px-2'>
                <button className='flex gap-2 items-center' onClick={() => navigate(-1)}>
                    <ArrowLeft className='text-white' />
                    <h2 className='text-white text-lg font-nunito'>Select a balance to settle</h2>
                </button>
            </div>
            <div className="px-4">
                {expenses && expenses.length > 0 ? expenses.map((expenseItem) => (
                    <div 
                        key={expenseItem.user.id} 
                        className="flex justify-between items-center my-2" 
                        onClick={() => navigate(`/group/${id}/expense/settlebalance/recordpayment`, { state: { user_id: expenseItem.user.id } })}
                    >
                        <span className='text-white'>{expenseItem.user.name}</span>
                        {expenseItem.expense.type === 'DEBT' ? (
                            <span className="text-green-500">You are owed ₹ {expenseItem.expense.total}</span>
                        ) : (
                            <span className="text-red-500">You owe ₹ {expenseItem.expense.total}</span>
                        )}
                    </div>
                )) : (
                    <SplashScreen/>
                )}
            </div>
        </div>
    );
};

export default SettleBalance;
