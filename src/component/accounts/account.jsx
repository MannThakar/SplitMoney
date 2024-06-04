/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UsersRound, UserRound, CircleUserRound, LogOut, User, Mail, Smartphone, Pencil } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import AccountModal from '../modal/accountmodal';
import axios from 'axios';
import { toast } from 'react-toastify';
import LogoutModal from '../modal/logoutmodal';

const Account = () => {
    // Function to check if the path is active
    const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';

    // Get the id from the URL
    const { id } = useParams();

    const [modal, setModal] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [logout, setLogout] = useState(false);
<<<<<<< Updated upstream


    //Api call and the function to get the account details
=======
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const pic = localStorage.getItem('profiled');
    
    // This function is used to get the account details of the user like name, email, phone
>>>>>>> Stashed changes
    const getAccountDetail = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setName(res.data.name);
            setEmail(res.data.email);
            setPhone(res.data.phone_no);
            setProfile(res.data.profile_picture); // Set the profile picture if available
            if (res.status === 200) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    // To call the function on page load
    useEffect(() => {
        getAccountDetail();
    }, [isEdit]);

<<<<<<< Updated upstream

    const navigate = useNavigate();

    //Logout function
=======
    // This function is used to clear all the tokens from localStorage
>>>>>>> Stashed changes
    const handleLogout = () => {
        localStorage.removeItem('Token');
        navigate('/signin');
    };

    // Function to handle file upload
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file); // Ensure the field name is 'image'

            try {
                const res = await axios.post(`${import.meta.env.VITE_API}/upload`, formData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Token")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                if (res.status === 200) {
                    toast.success('Picture uploaded successfully');
                    setProfile(res.data.path); // Set the new profile picture path
                    localStorage.setItem('profiled', res.data.path);
                } else {
                    toast.error('Failed to upload picture');
                }
            } catch (error) {
                console.error('Error uploading picture:', error);
                toast.error('Error uploading picture');
            }
        }
    };

    // Function to trigger file input click
    const triggerFileInputClick = () => {
        fileInputRef.current.click();
    };

    console.log('Profile:', profile);


    return (
        <div className="bg-primaryColor h-svh flex flex-col">
            <div className='flex justify-between px-3'>
                <button className="py-3 flex items-center gap-2 bg-primaryColor" onClick={() => navigate(-1)}>
                    <ArrowLeft className="text-white" />
                    <h2 className="text-white text-base font-satoshi">back</h2>
                </button>
                <button>
                    <Pencil className='text-white size-5 hover:text-textColor' onClick={() => setModal(true)} />
                </button>
            </div>
<<<<<<< Updated upstream

            {/* Logout modal for */}
=======
>>>>>>> Stashed changes
            {logout && (
                <LogoutModal
                    onLogout={handleLogout}
                    onCancel={() => setLogout(false)}
                />
            )}
<<<<<<< Updated upstream


            {/* Account modal */}
=======
>>>>>>> Stashed changes
            {modal && (
                <AccountModal
                    onClose={() => setModal(false)}
                    id={id}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                />
            )}
<<<<<<< Updated upstream

            <div className="px-4 flex flex-col items-center md:items-start">
                <h2 className="font-satoshi text-white py-2 text-2xl">Account</h2>
                <hr className="w-full" />
                <div className='flex gap-6 py-5 items-center w-full'>
                    {getAccountDetail ? (
                        <>
                            <div className='flex flex-col gap-5'>
                                <div className='flex gap-3'>
                                    <User className='text-white' />
                                    <h1 className='text-sm font-poppins text-white'>{name}</h1>
                                </div>
                                <div className='flex gap-3'>
                                    <Mail className='text-white' />
                                    <h2 className='text-sm font-poppins text-white'>{email}</h2>
                                </div>
                                <div className='flex gap-3'>
                                    <Smartphone className='text-white' />
                                    <h2 className='text-sm font-mono font-bold text-white'>{phone}</h2>
                                </div>

                            </div>
                        </>
                    ) : (
                        <span className='text-white'>Loading....</span>
                    )}

                </div>


                <div className="flex justify-start w-full">
                    <button
                        className="bg-white font-bold hover:bg-red-700  text-black py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                        onClick={() => setLogout(true)}>Logout
                    </button>
                </div>
            </div>

            {/* Conditional Rendering */}
            {modal && <AccountModal onClose={() => setModal(false)} id={id} isEdit={isEdit} setIsEdit={setIsEdit} />}
            
            {/* Footer */}
=======
            {getAccountDetail ? (
                <div className="px-4 flex flex-col items-center md:items-start">
                    <div className='flex gap-6 py-5 items-center w-full'>
                        <div className='flex flex-col gap-5'>
                            <div className='flex flex-col items-center gap-3' onClick={triggerFileInputClick}>
                                
                                {pic ? (
                                    <img src={pic} alt="Profile" className="w-24 h-24 rounded-full object-cover cursor-pointer" />
                                ) : (
                                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-white cursor-pointer">
                                        No Image
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className='flex gap-3'>
                                <User className='text-white' />
                                <h1 className='text-sm font-poppins text-white'>{name}</h1>
                            </div>
                            <div className='flex gap-3'>
                                <Mail className='text-white' />
                                <h2 className='text-sm font-poppins text-white'>{email}</h2>
                            </div>
                            <div className='flex gap-3'>
                                <Smartphone className='text-white' />
                                <h2 className='text-sm font-mono font-bold text-white'>{phone}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="w-2/4 flex justify-start w-full">
                        <button
                            className="bg-white font-bold hover:opacity-80 text-black py-3 px-6 rounded-full"
                            onClick={() => setLogout(true)}>Logout
                        </button>
                    </div>
                </div>
            ) : (
                <SplashScreen />
            )}
>>>>>>> Stashed changes
            <div className="flex justify-around w-full fixed bottom-0 bg-primaryColor p-2">
                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
                    <UsersRound className={`size-5 ${isActive('/')}`} />
                    <span className={`flex justify-start text-base font-satoshi ${isActive('/')}`}>Groups</span>
                </button>
                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/friends")}>
                    <User className={`size-5 ${isActive('/friends')}`} />
                    <span className={`flex justify-start text-base font-satoshi ${isActive('/friends')}`}>Friends</span>
                </button>
                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/accounts")}>
                    <CircleUserRound className={`size-5 ${isActive('/accounts')}`} />
                    <span className={`flex justify-start text-base font-satoshi ${isActive('/accounts')}`}>Account</span>
                </button>
            </div>
        </div>
    );
};

export default Account;
