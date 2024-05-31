/* eslint-disable no-unused-vars */
import { ArrowLeft, Pencil, Trash2, Settings } from 'lucide-react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import GroupExpenseUpdate from "../modal/groupexpenseupdate";


const GroupExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, expenseId } = useParams();
  const [group, setGroup] = useState(null);
  const [modals, setModals] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
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
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure you want to delete this expense?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              console.log(`Deleting expense ID: ${expenseId}`);
              const res = await axios.delete(`${import.meta.env.VITE_API}/expenses/${expenseId}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
              });
              if (res.status === 200) {
                toast.success(res.data.message);
                navigate('/')
                fetchExpenseDetails(); // Fetch updated expense details after deletion
              } else {
                toast.error(res.data.message);
              }
            } catch (error) {
              console.error("Delete Expense Error:", error);
              toast.error("Error deleting expense");
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  }, [fetchExpenseDetails]);

  useEffect(() => {
    getGroupApi();
    fetchExpenseDetails();
  }, [getGroupApi, fetchExpenseDetails]);

  const handleDeleteExpense = (expenseId) => {
    setSelectedExpenseId(expenseId);
    deleteExpense(expenseId);
  };

  const handleEditExpense = (expenseId) => {
    setSelectedExpenseId(expenseId);
    setModals(true);
  };

  return (
    <div className='h-screen bg-primaryColor flex flex-col'>
      <div className="flex w-full justify-between px-3 pt-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft className='text-white' />
          </button>
          <button className="text-white" onClick={() => handleDeleteExpense(selectedExpenseId)}>
            <Trash2 classNmae='text-white' />
          </button>
          <button className="text-white" onClick={() => handleEditExpense(selectedExpenseId)}>
            <Pencil className='text-trashColor' />
          </button>
        </div>
        <Link to={`/group/${id}/settings`} state={{ color: groupColor }}>
          <Settings className='text-white hover:text-textColor' />
        </Link>
      </div>

      <div className="relative pl-5 pt-3 flex items-center">
        <div
          className="w-14 h-14 rounded-2xl mr-4"
          style={{ backgroundColor: groupColor }}
        ></div>
        {group && (
          <h1>hello</h1>
          // <div>
          //   <h1 className="text-lg text-white">{group.name}</h1>
          //   <h2 className="text-sm text-white">{group.description}</h2>
          // </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 mb-20">
        {expenses.map((expense) => {
          const date = new Date(expense.date);
          const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`;

          return (
            <div key={expense.id} className="my-4 p-2 bg-stone-700 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="bg-stone-600 p-3 rounded-lg">
                  {/* <span className="text-white font-satoshi text-lg">{expense.description}</span> */}
                </div>
                <div className="flex items-center gap-1">
                  <button className="text-white" onClick={() => handleDeleteExpense(expense.id)}>
                      <Trash2 className='text-trashColor' />
                  </button>
                  <button className="text-white" onClick={() => handleEditExpense(expense.id)}>
                    <Pencil className='text-white' />
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="p-2 rounded-lg">
                  <div>
                    <span className="font-bold font-mono text-lg text-white">{formattedDate}</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg">
                  <span className="text-white font-satoshi text-base">You paid</span>
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
          expenseId={selectedExpenseId}
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
