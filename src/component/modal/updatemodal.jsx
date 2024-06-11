/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, User, FilePenLine } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

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
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                if (error.response && error.response.status === 500) {
                    toast.error(error.response.data.message)
                } else {
                    toast.error(error);
                }
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
          
            <div className="bg-stone-800 w-11/12 h-64 py-4 md:w-2/5 rounded-xl mx-auto p-6">
                <div className="flex justify-end">
                    <button onClick={onClose}>
                        <X className="text-white hover:text-textColor" />
                    </button>
                </div>
                <h1 className="text-center font-nunito text-xl text-white mb-4">Update group details</h1>
                <form onSubmit={groupUpdate} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="text-white" />
                        <input type="text" placeholder="Enter group name" className="flex-1 p-2 font-nunito border-b-2 bg-transparent text-white" value={groupName} required onChange={(e) => setGroupName(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <FilePenLine className="text-white" />
                        <input type="text" placeholder="Enter group description" className="flex-1 p-2 font-nunito border-b-2 bg-transparent text-white" value={groupDescr} required onChange={(e) => setGroupDescription(e.target.value)} />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="md:w-1/4 w-1/3 p-2 font-bold text-black bg-buttonColor font-nunito rounded-2xl">
                           {groupUpdate ? 'Update':'Updating'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateModal;
