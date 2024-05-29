/* eslint-disable no-unused-vars */
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UsersRound, UserRound, CircleUserRound, LogOut, User, Mail, Smartphone, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import AccountModal from '../modal/accountmodal';
import axios from 'axios';
import { toast } from 'react-toastify';
import LogoutModal from '../modal/logoutmodal';
import SplashScreen from '../utils/splashscreen';

const Account = () => {
    const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';
    const [modal, setModal] = useState(false);
    const [name, setName] = useState(null)
    const [email, setEmail] = useState(null)
    const [phone, setPhone] = useState(null)
    const [isEdit, setIsEdit] = useState(false);
    const [logout, setLogout] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams()

    //This function is used to get the account details of user like name,email,phone
    const getAccountDetail = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setName(res.data.name)
            setEmail(res.data.email)
            setPhone(res.data.phone_no)
            if (res.status === 200) {
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            console.log('Error fething data:', error)
        }
    }
    useEffect(() => {
        getAccountDetail();
        // If isEdit is true then it will call the useEffect the state is pass as props in accountmodal
        // page and it is checking there if it is true then it will call getAccountDetail and changes is
        // been shown
    }, [isEdit]);



    //This function is use to clear all the token from localstorage
    const handleLogout = () => {
        localStorage.removeItem('Token');
        navigate('/signin');
    };


    return (
        <div className="bg-primaryColor h-svh flex flex-col">
            <div className='flex justify-between px-3'>
                <button className="py-3 flex items-center gap-2 bg-primaryColor" onClick={() => navigate(-1)}>
                    <ArrowLeft className="text-white" />
                    <h2 className="text-white text-lg font-satoshi">Account</h2>
                </button>
                <button className=''>
                    <Pencil className='text-white size-5 hover:text-textColor' onClick={() => setModal(true)} />
                </button>
            </div>
            {/*It will open the logoutmodal if user press of and confirm logout then it will call the
                handleLogout() if user press on the cancel button then setLogout is (false) then
                it will close the model.
            */}
            {logout && (
                <LogoutModal
                    onLogout={handleLogout}
                    onCancel={() => setLogout(false)}
                />
            )}
            {/* This will open the accountmodal and 
            */}
            {modal && (
                <AccountModal
                    onClose={() => setModal(false)}
                    id={id}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                />
            )}
            {getAccountDetail ? (
                <div className="px-4 flex flex-col items-center md:items-start">
                {/* <h2 className="font-satoshi text-white py-2 text-2xl">Account</h2>
                <hr className="w-full" /> */}

                <div className='flex gap-6 py-5 items-center w-full'>
                   
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
                            </div>
                <div className="w-2/4 flex justify-start w-full">
                    <button
                        className="bg-white font-bold hover:opacity-80 text-black py-3 px-6 rounded-full"
                        onClick={() => setLogout(true)}>Logout
                    </button>
                </div>
            </div>
            ): (
                  <SplashScreen/>   
            )}
                
            {modal && <AccountModal onClose={() => setModal(false)} id={id} isEdit={isEdit} setIsEdit={setIsEdit} />}
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
