/* eslint-disable no-unused-vars */
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ArrowLeft} from 'lucide-react';
import GroupExpenseUpdate from "../../component/modal/groupexpenseupdate";
import { toast } from 'react-toastify';

const ExpenseDetail = () => {
    const location = useLocation();
    const { id } = useParams();
    const [modals, setModals] = useState(false);
    const navigate = useNavigate();
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [details, setDetails] = useState(null);
    const [isUpdate,setIsUpdate] = useState(false);
    const expenseId = location.pathname.split("/")[4];

    const fetchExpenseDetailgroup = useCallback(async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/expenses/?includes=user,userExpenses&group_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            if (res.status === 200) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Fetch Expense Details Error:", error);
            toast.error("Error fetching expense details");
        }
    }, [id]);

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
                } else {
                    toast.error(res.data.message);
                }
                fetchExpenseDetailgroup(); // Fetch updated expense details after deletion
            } catch (error) {
                console.error("Delete Expense Error:", error);
                toast.error("Error deleting expense");
            }
        }
    }, [fetchExpenseDetailgroup, navigate]);

    const handleDeleteExpense = (expenseId) => {
        deleteExpense(expenseId);
    };

    const handleEditExpense = (expense) => {
        setSelectedExpense(expense);
        setModals(true);
    };

     const getGroupApi = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [id]);


    useEffect(() => {
        fetchExpenseDetail();
        fetchExpenseDetailgroup();
    }, [isUpdate]);

    return (
        <div className='bg-primaryColor h-svh px-3 flex flex-col'>
            <div className='py-3 px-2 flex items-center'>
                <button className='flex items-center gap-2' onClick={() => navigate(-1)}>
                    <ArrowLeft className='text-white' />
                    <h2 className='text-white text-lg font-nunito'>Expense Details</h2>
                </button>
            </div>
            {details && (
                <div className='p-4 mt-4 rounded-lg bg-stone-700  bg-opacity-30 border border-white border-opacity-20 shadow-lg'>
                    <h1 className='text-white mb-2 font-nunito font-bold'>Description: {details.description}</h1>
                    <h2 className='text-white mb-4 font-nunito font-bold'>Paid by {details.user.name}: <span className='text-lentColor font-nunito text-lg ml-1'>{details.amount}</span></h2>
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
                    {modals && (
                        <GroupExpenseUpdate
                            onClose={() => setModals(false)}
                            expense={selectedExpense}
                            isUpdate={isUpdate}
                            setIsUpdate={setIsUpdate}
                            onUpdate={() => {
                                setModals(false);
                                fetchExpenseDetailgroup();
                            }}
                            
                        />
                    )}
                </div>
            )}
            {details && (
                <div className='flex justify-center items-center gap-5 mt-4'>
                    <button className="flex justify-center font-nunito items-center gap-2 text-white h-12 w-16 rounded-xl bg-blue-600 hover:bg-blue-800 transition duration-200 ease-in-out transform hover:scale-105" onClick={() => handleEditExpense(details)}>
                        {/* <Pencil className="text-white" /> */}
                        Edit
                    </button>
                    <button className="flex justify-center font-nunito items-center gap-2 text-white h-12 w-16 rounded-xl bg-red-600 hover:bg-red-800 transition duration-200 ease-in-out transform hover:scale-105" onClick={() => handleDeleteExpense(details.id)}>
                        {/* <Trash2 className="text-white" /> */}
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpenseDetail;
