/* eslint-disable no-unused-vars */
import { ArrowLeft, Banknote, Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import axios from 'axios';
import DeleteConfirmation from '../modal/delete-confirmation';
import { useState, useEffect } from 'react';
import SplashScreen from '../utils/splashscreen';

const Settlement = () => {
    const navigate = useNavigate();
    const [settleId, setSettleId] = useState([]);
    const [settlementId, setSettlementId] = useState(null);
    const { id } = useParams();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state

    // Settlement list /settlements/?includes=group,payer,payee&group_id=81
    const SettlementList = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/settlements?includes=group,payer,payee&group_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('Token')}`
                }
            });
            setSettleId(response.data);
            if (response.data.length > 0) {
                setSettlementId(response.data[0].id);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false); // Set loading to false once data is fetched
        }
    };

    useEffect(() => {
        SettlementList();
    }, []);

    // Settlement Delete
    const handleSettleDelete = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API}/settlements/${settlementId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('Token')}`
                }
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate(`/group/${id}`);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const confirmDelete = () => {
        setShowDeleteConfirmation(true);
    };

    const onConfirmDelete = () => {
        handleSettleDelete();
        setShowDeleteConfirmation(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <div className="bg-primaryColor h-svh">
            {loading ? (
                <SplashScreen /> // Display SplashScreen while loading
            ) : (
                <>
                    <div className="flex gap-2 py-3 px-2">
                        <button onClick={() => navigate(-1)}>
                            <ArrowLeft className='text-white' />
                        </button>
                        <div className='flex justify-between w-screen'>
                            <h2 className="font-nunito text-lg text-white">Settlement</h2>
                            <button onClick={confirmDelete}>
                                <Trash className='text-white' />
                            </button>
                        </div>
                    </div>
                    <div>
                        <span className='flex justify-center items-center'><Banknote className='text-green-500 size-12' /></span>
                        {settleId.map((item, index) => {
                            const date = new Date(item.date);
                            const month = date.toLocaleString('default', { month: 'short' });
                            const year = date.getFullYear();
                            const day = date.getDate();

                            return (
                                <div key={index}>
                                    <div className='flex justify-center items-center mx-auto'>
                                        <h1 className='text-white text-base font-nunito px-2'>{item.payer.name} paid {item.payee.name}</h1>
                                    </div>
                                    <h2 className='text-white font-nunito text-base flex justify-center'>INR <span className=' pl-2 text-base text-white font-nunito font-extrabold'>₹{item.amount}</span></h2>
                                    <div className='mt-4'>
                                        <h3 className='text-white font-nunito text-base flex justify-center items-center mx-auto px-2'>Added by {item.payee.name} on {day}-{month}-{year}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {showDeleteConfirmation && (
                        <DeleteConfirmation
                            onLogout={onConfirmDelete}
                            onCancel={cancelDelete}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Settlement;






