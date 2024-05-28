/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UsersRound, UserRound, CircleUserRound } from 'lucide-react';
import axios from 'axios';

const Friends = () => {
    const [group, setGroup] = useState([]);
    const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';

    const navigate = useNavigate();

    const getGroupApi = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setGroup(res.data);  // Assuming the data you need is in res.data
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        getGroupApi();
    }, []);

    return (
        <div className='bg-primaryColor min-h-screen'>
            <div className="py-3 px-2 flex gap-2 fixed w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
                <button className='flex gap-2'>
                    <ArrowLeft className="text-white" onClick={() => navigate(-1)} />
                    <h2 className="text-white text-base font-satoshi">back</h2>
                </button>
            </div>


            <div className='p-4 pt-14'>
                <div className='flex items-center justify-between'>
                    <h2 className='text-white text-2xl font-satoshi'>Friends List</h2>
                    <h3 className='text-white text-sm font-satoshi'>Total Friends: <span className='text-textColor'>{group.length}</span></h3>
                </div>
                {group.length > 0 ? (
                    <div className='grid grid-cols-1 gap-4'>
                        {group.map((item, index) => (
                            <div key={index} className='bg-stone-800 p-4 flex flex-col gap-2 rounded-md shadow-md'>
                                <div className='flex gap-2'>
                                    <User className='text-white' />
                                    <h3 className='text-white text-xl font-semibold'>{item.name}</h3>
                                </div>
                                <div className='flex gap-2'>
                                    <Mail className='text-white' />
                                    <p className='text-white text-sm font-satoshi'>{item.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-white font-satoshi'>No friends found.</p>
                )}
            </div>

            <div className="flex justify-around w-full fixed bottom-0 bg-primaryColor p-2">

                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
                    <UsersRound className={`size-5 ${isActive('/')}`} />
                    <span className={`flex justify-start text-base font-satoshi ${isActive('/')}`}>Groups</span>
                </button>

                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/friends")}>
                    <UserRound className={`size-5 ${isActive('/friends')}`} />
                    <span className={`flex justify-start text-base font-satoshi ${isActive('/friends')}`}>Friends</span>
                </button>

                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/accounts")}>
                    <CircleUserRound className={`size-5 ${isActive('/accounts')}`} />
                    <span className={`flex justify-start text-base font-satoshi ${isActive('/accounts')}`}>Account</span>
                </button>
            </div>

        </div>
    );
}

export default Friends;
