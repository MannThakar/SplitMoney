import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const ExpenseDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const expenseId = location.pathname.split("/")[4];

    const fetchExpenseDetail = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/expenses/${expenseId}?includes=user,userExpenses.user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setDetails(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchExpenseDetail();
    }, []);

    return (
        <div className='bg-primaryColor h-svh px-3 flex flex-col'>
            <div className='pt-3 flex items-center'>
                <button className='flex items-center gap-2' onClick={() => navigate(-1)}>
                    <ArrowLeft className='text-white' />
                    <h2 className='text-white text-lg font-nunito'>Expense Details</h2>
                </button>
            </div>
            {details && (
                <div className='p-4 mt-4 rounded-lg bg-stone-700 bg-opacity-30 border border-white border-opacity-20 backdrop-blur-lg shadow-lg'>
                    <h1 className='text-white mb-2 font-nunito font-bold'>Description: {details.description}</h1>
                    <h2 className='text-white mb-4 font-nunito font-bold'>Paid by {details.user.name}:<span className='text-lentColor font-nunito text-lg ml-1'>{details.amount}</span></h2>
                    <div>
                        <h2 className='text-white font-bold mb-2'>User Expenses</h2>
                        <div className='space-y-2'>
                            {details.user_expenses.map((userExpense, index) => {
                                const isPayerUser = details.payer_user_id === userExpense.user.id;
                                const textColor = isPayerUser ? '#09B83E' : '#FF0000';
                                return (
                                    <div key={index} className='p-2 rounded-lg bg-stone-600 bg-opacity-50'>
                                        <p className='text-white'>
                                            {isPayerUser ? `${userExpense.user.name} paid: ` : `${userExpense.user.name} borrowed: `}
                                            <span className={`font-bold text-lg`} style={{ color: textColor }}>
                                                {userExpense.owned_amount.toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpenseDetail;
