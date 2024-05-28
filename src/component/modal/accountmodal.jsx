/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { X, User, Mail, Smartphone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'

function AccountModal({ onClose, setGroup, isEdit, setIsEdit, id }) {
    const modalRef = useRef();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [ids, setId] = useState('');

    // const { id } = useParams();

    // Account Owner Information
    async function viewAccountStatus() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/me`, {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setName(response.data.name);
            setEmail(response.data.email);
            setPhone(response.data.phone_no);
            setId(response.data.id)
        } catch (error) {
            toast.error(error)
            console.error("Error:", error);
        }
    }

    useEffect(() => {
        viewAccountStatus();
    }, [isEdit]);

    async function accountUpdate(e) {
        e.preventDefault();
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_API}/users/${ids}`,
                {
                    name: name,
                    email: email,
                    phone_no: phone
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
                setIsEdit(!isEdit);
                onClose();
                console.log(response)
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                toast.error(`Unauthorized: ${error.response.data.message}`);
                console.log(`Error 401: ${error.response.data.message}`);
            } else {
                toast.error('An error occurred while deleting the expense.');
                console.log(error);
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
            <div className="bg-stone-800 w-11/12 h-80 py-4 md:w-2/5 rounded-xl mx-auto p-6">
                <div className="flex justify-end">
                    <button onClick={onClose}>
                        <X className="text-white" />
                    </button>
                </div>
                <h1 className="text-center font-satoshi text-xl text-white mb-4">Account Update</h1>
                <form onSubmit={accountUpdate} className="space-y-4">
                    <div className="flex items-center gap-2">
                        <User className="text-white" />
                        <input type="text" placeholder="Enter group name" className="flex-1 p-2 font-satoshi border-b-2 bg-transparent text-white" value={name} required onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail className="text-white" />
                        <input type="email" placeholder="EMAIL" pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$" className="flex-1 p-2 font-satoshi border-b-2 bg-transparent text-white" value={email} required onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Smartphone className='text-white' />
                        <input
                            type='number'
                            placeholder="PHONE NO"
                            className='flex-1 p-2 font-mono border-b-2 bg-transparent text-white'
                            value={phone}
                            required
                            onChange={(e) => {
                                if (e.target.value.length <= 10) {
                                    setPhone(e.target.value);
                                }
                            }}
                            maxLength="10"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="w-2/4  p-2 text-black bg-buttonColor font-satoshi font-bold rounded-2xl">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AccountModal;
