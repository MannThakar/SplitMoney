/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, FilePenLine, IndianRupee, Calendar } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function GroupExpenseUpdate({ onClose, expense, onUpdate }) {
    const modalRef = useRef();
    const [expenseData, setExpenseData] = useState(expense);

    const handleInputChange = useCallback((field, value) => {
        setExpenseData((prev) => ({ ...prev, [field]: value }));
    }, []);

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
                        Authorization: `Bearer ${localStorage.getItem('Token')}`
                    }
                }
            );

            if (response.status === 200) {
                onUpdate();
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error('An error occurred while updating the expense.');
            console.log(error);
        }
    }, [expenseData, onUpdate]);

    const closeModal = useCallback((e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    }, [onClose]);

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
                        <div className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
                            <Calendar className="text-white ml-3" />
                            <input
                                type="date"
                                name="date"
                                value={expenseData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="w-full p-2 text-white bg-transparent border-none outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
                            <IndianRupee className="text-white ml-3" />
                            <input
                                type="text"
                                name="amount"
                                value={expenseData.amount}
                                onChange={(e) => handleInputChange('amount', e.target.value)}
                                placeholder="Amount"
                                className="w-full p-2 text-white bg-transparent border-none outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 border rounded-lg border-gray-600 bg-gray-700">
                            <FilePenLine className="text-white ml-3" />
                            <input
                                type="text"
                                name="description"
                                value={expenseData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Description"
                                className="w-full p-2 text-white bg-transparent border-none outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="bg-white w-40 font-bold text-black font-satoshi p-2 rounded-md"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default GroupExpenseUpdate;
