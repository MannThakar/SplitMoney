/* eslint-disable no-unused-vars */
/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
import { X, Mail } from 'lucide-react';
import { useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Modal({ onClose }) {
    const modalRef = useRef();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    const groupInvite = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading state to true
        try {
            const response = await axios.post(`${import.meta.env.VITE_API}/invite-group-member`,
                { email, group_id: id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('Token')}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message);
                
                onClose(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 422) {
                toast.error(error.response.data.message)
            }
            console.error('Error:', error);
            toast.error('An error occurred. Please try again.');
        } finally {
            setLoading(false); // Set loading state back to false
        }
    };

    function closeModal(e) {
        if (modalRef.current === e.target) {
            onClose();
        }
    }

    return (
        <div ref={modalRef} onClick={closeModal} className="fixed inset-0 bg-opacity-30 backdrop-blur-sm">
            <div className='grow h-44'></div>
            <div className='w-11/12 md:w-1/5 h-56 py-3 px-4 rounded-xl mx-auto bg-stone-800'>
                <div className='flex justify-end w-full'>
                    <button onClick={onClose}>
                        <X className='text-white' />
                    </button>
                </div>
                <div className='flex flex-col gap-3'>
                    <div>
                        <h1 className='font-nunito text-base text-white'>Invite other members too.</h1>
                        <p className='font-nunito text-base text-white'>Invite the other members via mail.</p>
                    </div>
                    <form onSubmit={groupInvite} className='pt-2 flex flex-col justify-center gap-3'>
                        <div className='flex gap-3 items-center'>
                            <Mail className='text-white' />
                            <input
                                type="email"
                                placeholder='Enter the email'
                                className='p-2 border-b-2 text-white bg-transparent w-full font-nunito'
                                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='flex justify-center'>
                            <button
                                type="submit"
                                className='p-2 text-black w-24 flex justify-center items-center font-nunito bg-buttonColor rounded-2xl'
                                disabled={loading}>
                                {loading ? "Sending..." : "Invite"} 
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Modal;
