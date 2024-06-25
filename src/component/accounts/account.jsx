/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from 'react-router-dom';
import { LogOut, ArrowLeft, UsersRound, UserRound, CircleUserRound, User, Mail, Smartphone, Pencil, ImageUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import AccountModal from '../modal/accountmodal';
import axios from 'axios';
import { toast } from 'react-toastify';
import LogoutModal from '../modal/logoutmodal';
import SplashScreen from '../utils/splashscreen';
import Footer from '../ui/footer';

const Account = () => {
    // get the id from the url
    const { id } = useParams();
    const [modal, setModal] = useState(false);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [imageURL, setImageURL] = useState(null);  // Image URL state
    const [isEdit, setIsEdit] = useState(false);
    const [logout, setLogout] = useState(false);
    const [isReload, setIsReload] = useState(false);
    const navigate = useNavigate();
    const fallbackImage = "https://www.w3schools.com/w3images/avatar2.png"; // Replace this with your fallback image URL

    // This function is used to get the account details of the user like name, email, phone
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
            setImageURL(res.data.image_url); // Set image URL
            if (res.status === 200) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    // Image upload function
    const handleImage = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        const type = 'USER';
        try {
            const response = await axios.post(`${import.meta.env.VITE_API}/upload`,
                {
                    url:file,
                    type
                },
                
                {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                setImageURL(response.data.image_url); // Update image URL after upload
                getAccountDetail();
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    // To call function on page load
    useEffect(() => {
        getAccountDetail();
    }, [isEdit]);

    // This function is used to clear all the tokens from local storage
    const handleLogout = () => {
        localStorage.removeItem('Token');
        navigate('/signin');
    };

    // if (!name || !email || !phone) {
    //     return (
    //         <div className="flex justify-center items-center min-h-screen bg-primaryColor">
    //             <SplashScreen />
    //         </div>
    //     );
    // }

    return (
        <div className="bg-primaryColor min-h-screen flex flex-col">
            <div className='flex justify-between px-3 py-3'>
                <div className="flex items-center gap-2">
                <button  onClick={() => navigate('/')}>
                    <ArrowLeft className="text-white" />
                </button>
                    <h2 className="text-white text-lg font-nunito">Account</h2>
                </div>
                <button>
                    <Pencil className='text-white size-5 hover:text-textColor' onClick={() => setModal(true)} />
                </button>
            </div>
            
            {/* Wrapper for splash screen */}
            <div className="flex-grow overflow-y-auto">
                {name && email && phone ? (
                    <div className="px-4 flex flex-col">
                        <div className='flex flex-col gap-6 py-3 justify-start'>
                            <div className='flex justify-start gap-5'>
                                <div className='relative w-16 h-16'>
                                    <img
                                        src={imageURL || fallbackImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                    <label className='absolute bottom-0 right-0 p-1 bg-white rounded-full cursor-pointer'>
                                        <ImageUp className='text-black size-5' />
                                        <input
                                            type='file'
                                            name='upload'
                                            onChange={handleImage}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <div className="text-left">
                                    <h1 className='text-lg font-nunito font-bold text-white'>{name}</h1>
                                    <h2 className='text-sm font-nunito text-white'>{email}</h2>
                                    <h2 className='text-sm font-nunito font-bold text-white'>{phone}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-start items-center md:justify-start gap-2">
                            <div className='flex  gap-2 items-center'> 
                                   <button className='flex gap-2 items-center' onClick={() => setLogout(true)}>
                                        <LogOut className="text-white flex items-center" />
                                    </button>
                                        <h2 className="text-white text-lg font-nunito" >Logout</h2>
                                {/* <button
                               <LogOut className='text-white ' />
                                    className="font-bold text-lg font-nunito hover:opacity-80 text-white py-2"
                                    
                                </button> */}
                            </div>
                        </div>
                    </div>
                
            ) : (
                <SplashScreen />
                )}
            </div>
            {logout && (
                <LogoutModal
                    onLogout={handleLogout}
                    onCancel={() => setLogout(false)}
                />
            )}
            {modal && (
                <AccountModal
                    onClose={() => setModal(false)}
                    id={id}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                />
            )}
           <Footer/>
        </div>
    );
};

export default Account;
