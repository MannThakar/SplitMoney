/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-vars */
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import GroupExpenseUpdate from "../../component/modal/groupexpenseupdate";
import { toast } from 'react-toastify';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SplashScreen from '../utils/splashscreen';
import DeleteConfirmation from '../modal/delete-confirmation';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExpenseDetail = () => {
    const location = useLocation();
    const { id } = useParams();
    const [modals, setModals] = useState(false);
    const navigate = useNavigate();
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [details, setDetails] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState(null);
    const expenseId = location.pathname.split("/")[4];
    const [loading,setLoading] = useState(true);

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
    }, [fetchExpenseDetailgroup, navigate]);

    const handleDeleteExpense = (expenseId) => {
        setExpenseToDelete(expenseId);
        setShowDeleteConfirmation(true);
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

      function formatDate(dateString) {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        }
        const generateChartData = (userExpenses) => {
        const labels = userExpenses.map(ue => ue.user.name);
        const data = userExpenses.map(ue => ue.owned_amount);

        return {
            labels,
            datasets: [
                {
                    label: 'Amount',
                    data,
                    backgroundColor: labels.map(name => name === details.user.name ? 'rgba(9, 184, 62, 0.8)' : 'rgba(255, 0, 0, 0.8)'),
                    borderColor: 'rgba(255, 255, 255, 1)',
                    borderWidth: 2,
                    hoverBackgroundColor: labels.map(name => name === details.user.name ? 'rgba(9, 184, 62, 1)' : 'rgba(255, 0, 0, 1)'),
                    hoverBorderColor: 'rgba(255, 255, 255, 1)',
                },
            ],
        };
    };

    const handleDeleteConfirmation = () => {
        deleteExpense(expenseToDelete);
        setShowDeleteConfirmation(false);
        setExpenseToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
        setExpenseToDelete(null);
    };

    return (
        <div className='bg-primaryColor h-svh px-2 flex flex-col'>
         
        <div>
        {details ? 
        (
            <>
                    <div className='py-3 flex items-center'>
                <div className='flex items-center gap-2'>
                    <button  onClick={() => navigate(`/group/${id}`)}>
                        <ArrowLeft className='text-white' />
                    </button>
                    <h2 className='text-white text-lg font-nunito'>Expense Details</h2>
                </div>

            </div>
        
            {details && (
                 
                <div className='p-2 rounded-lg bg-stone-700 bg-opacity-30 border border-white border-opacity-20 flex-grow shadow-lg'>
                    <h1 className='text-white mb-1 font-nunito font-bold'>Description: {details.description}</h1>
                    <h2 className='text-white mb-1 font-nunito font-bold'>Paid by {details.user.name}: <span className='text-lentColor font-nunito font-normal text-lg'>{details.amount}</span></h2>
                    <div className='space-y-2'>
                        <h2 className='text-white font-nunito font-bold'>User Expenses</h2>
                        <h3 className='text-white font-nunito font-bold'>Created At:<span className='ml-1'>{formatDate(details.user.created_at)}</span></h3>
                        <div className='space-y-3'>
                            {details.user_expenses.map((userExpense, index) => {
                                const isPayerUser = details.payer_user_id === userExpense.user.id;
                                const textColor = isPayerUser ? '#09B83E' : '#FF0000';
                                return (
                                    <div key={index} className='p-1 rounded-md mb-2 bg-stone-600 bg-opacity-50'>
                                        <p className='text-white font-bold'>
                                            {isPayerUser ? `${userExpense.user.name} paid: ` : `${userExpense.user.name} borrowed: `}
                                            <span className={`font-normal text-lg`} style={{ color: textColor }}>
                                                {userExpense.owned_amount.toFixed(2)}
                                            </span>
                                        </p>
                                    </div>
                            );
                            })}
                        </div>
                         <div className='overflow-x-auto overflow-y-hidden'>
                        <div className='mx-auto' style={{ maxWidth: '100%', overflowX: 'auto' }}>
                            <Bar
                                data={generateChartData(details?.user_expenses || [])}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            titleFont: { size: 16 },
                                            bodyFont: { size: 14 },
                                            bodySpacing: 6,
                                            borderColor: 'rgba(255, 255, 255, 0.8)',
                                            borderWidth: 1,
                                            cornerRadius: 4,
                                            padding: 10,
                                            displayColors: false,
                                        },
                                    },
                                    animation: {
                                        duration: 1000,
                                        easing: 'easeInOutQuad',
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                color: 'white',
                                                font: {
                                                    size: 12,
                                                },
                                            },
                                            grid: {
                                                display: false,
                                            },
                                        },
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                color: 'white',
                                                font: {
                                                    size: 10,
                                                },
                                                callback: function (value, index, values) {
                                                    if (Math.max(...values) > 20) {
                                                        // Reduce the number of y-axis ticks if the max value is greater than 20
                                                        if (value % 5 === 0) {
                                                            return value;
                                                        } else {
                                                            return '';
                                                        }
                                                    } else {
                                                        return value;
                                                    }
                                                },
                                            },
                                            grid: {
                                                color: 'rgba(255, 255, 255, 0.2)',
                                            },
                                        },
                                    },
                                }}
                                className='w-full'
                            />
                        </div>
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
                <div className='flex justify-center items-center gap-5 my-1 md:my-2 '>
                    <button className="flex justify-center font-nunito items-center gap-2 text-white h-8 w-16 rounded-md bg-blue-600 hover:bg-blue-800 transition duration-200 ease-in-out transform" onClick={() => navigate(`/group/${id}/expense/${expenseId}/edit`)} >
                        Edit
                    </button>
                    <button className="flex justify-center font-nunito items-center gap-2 text-white h-8 w-16 rounded-md bg-red-600 hover:bg-red-800 transition duration-200 ease-in-out transform" onClick={() => handleDeleteExpense(details.id)}>
                        Delete
                    </button>
                </div>
            )}         
            </>
                
        ): (
           <SplashScreen/>     
        )}
        </div>
            
            {showDeleteConfirmation && (
                <DeleteConfirmation
                    onLogout={handleDeleteConfirmation}
                    onCancel={handleCancelDelete}
                />
            )}
        </div>
    );
};

export default ExpenseDetail;
