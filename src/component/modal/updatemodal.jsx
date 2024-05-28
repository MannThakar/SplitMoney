/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, User, FilePenLine } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function UpdateModal({ onClose, setGroup }) {
    const modalRef = useRef();
    const [groupName, setGroupName] = useState('');
    const [groupDescr, setGroupDescription] = useState('');
    const { id } = useParams();

    async function viewGroup() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setGroupName(response.data.name);
            setGroupDescription(response.data.description);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        viewGroup();
    }, [id]);

    async function groupUpdate(e) {
        e.preventDefault();
        const type = 'group_expenses'
        if (type == 'group_expenses') {
            try {
                const response = await axios.put(
                    `${import.meta.env.VITE_API}/groups/${id}`,
                    {
                        name: groupName,
                        description: groupDescr,
                        type: type
                    },
                    {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            Authorization: `Bearer ${localStorage.getItem('Token')}`
                        }
                    }
                );
                onClose(false);
                if (response.status === 200) {
                    setGroup(groupName);
                    toast.success('Group updated successfully');
                } else {
                    toast.error('Error while updating group');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }




    function closeModal(e) {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    return (
        <div ref={modalRef} onClick={closeModal} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: "#363636",
                        color: "#fff",
                    },
                }}
            />
            <div className="bg-stone-800 w-11/12 h-64 py-4 md:w-2/5 rounded-xl mx-auto p-6">
                <div className="flex justify-end">
                    <button onClick={onClose}>
                        <X className="text-white hover:text-textColor" />
                    </button>
                </div>
                <h1 className="text-center font-satoshi text-xl text-white mb-4">Update group details</h1>
                <form onSubmit={groupUpdate} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="text-white" />
                        <input type="text" placeholder="Enter group name" className="flex-1 p-2 font-satoshi border-b-2 bg-transparent text-white" value={groupName} required onChange={(e) => setGroupName(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilePenLine className="text-white" />
                        <input type="text" placeholder="Enter group description" className="flex-1 p-2 font-satoshi border-b-2 bg-transparent text-white" value={groupDescr} required onChange={(e) => setGroupDescription(e.target.value)} />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="w-2/4 p-2 font-bold text-black bg-buttonColor font-satoshi rounded-2xl">Update</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateModal;
