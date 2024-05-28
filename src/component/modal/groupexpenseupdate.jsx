/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, FilePenLine, IndianRupee, Calendar } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function GroupExpenseUpdate({ onClose, expense }) {
    const modalRef = useRef();
    const { id } = useParams()
    console.log(id)
    const [expenseData, setExpenseData] = useState(expense);


    const fetchExpenseDetails = useCallback(async () => {
        try {
            console.log(`Fetching expense details for group ID: ${id}`);
            const res = await axios.get(`${import.meta.env.VITE_API}/expenses/?includes=user,userExpenses&group_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            console.log(res)
        }
        catch (error) {
            console.log(error)
        }
    }, []);

    // Handle form field changes
    const handleInputChange = useCallback((field, value) => {
        setExpenseData((prev) => ({ ...prev, [field]: value }));
    }, []);

    // Handle form submission
    const expenseUpdate = useCallback(async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API}/expenses/${expenseData.id}`,
                {
                    group_id: expenseData.group_id,
                    amount: expenseData.amount,
                    type: expenseData.type,
                    description: expenseData.description,
                    date: expenseData.date,
                },
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        Authorization: `Bearer ${localStorage.getItem('Token')}`
                    }
                }
            );

            if (response.status === 200) {
                onClose();
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while updating the expense.');
            console.log(error);
        }
    }, [expenseData, onClose]);

    // Handle modal close
    const closeModal = useCallback((e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        fetchExpenseDetails();
``
    })
    useEffect(() => {
        setExpenseData(expense);
    }, [expense]);

    return (
        <div ref={modalRef} onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-stone-800 w-11/12 h-80 py-4 md:w-2/5 rounded-xl mx-auto p-6">
                <div className="flex justify-end">
                    <button onClick={onClose}>
                        <X className="text-white" />
                    </button>
                </div>
                <h1 className="text-center font-satoshi text-xl text-white mb-4">Expense Update</h1>
                <form onSubmit={expenseUpdate} className="space-y-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <FilePenLine className='text-white' />
                            <input
                                type="text"
                                placeholder="Enter the description"
                                className="flex-1 p-2 font-satoshi border-b-2 bg-transparent text-white"
                                value={expenseData.description}
                                required
                                onChange={(e) => handleInputChange('description', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <IndianRupee className='text-white' />
                            <input
                                type="number"
                                placeholder="0.00"
                                className="flex-1 p-2 font-satoshi border-b-2 bg-transparent text-white"
                                value={expenseData.amount}
                                required
                                onChange={(e) => handleInputChange('amount', e.target.value)}
                            />
                        </div>
                        <div className='flex items-center gap-2'>
                            <Calendar className='text-white' />
                            <input
                                type='date'
                                className='flex-1 p-2 font-mono border-b-2 bg-transparent text-white'
                                value={expenseData.date}
                                required
                                onChange={(e) => handleInputChange('date', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="w-2/4 p-2 text-black bg-buttonColor font-satoshi font-bold rounded-2xl">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GroupExpenseUpdate;
