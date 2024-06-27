/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowLeft, Pencil, Users, Trash, Upload } from 'lucide-react';
import Modal from "../modal/modal";
import UpdateModal from "../modal/updatemodal";
import DeleteConfirmation from '../modal/delete-confirmation';
import SplashScreen from "../utils/splashscreen";

const Settings = ({ onClose }) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [modal, setModal] = useState(false);
    const [modals, setModals] = useState(false);
    const [update, setUpdate] = useState(false);
    const [group, setGroup] = useState(null);
    const [member, setMember] = useState([]);
    const [imageURL, setImageURL] = useState(null);
    const [userId, setUserId] = useState(null);  
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); 
    const [groupToDelete, setGroupToDelete] = useState(null);
    const [file, setFile] = useState(null);
    const fallbackImage = "https://www.w3schools.com/w3images/avatar2.png";
    const groupColor = location.state?.color || '#7c3aed';

    const getAccountDetail = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setImageURL(res.data.image_url);
            setUserId(res.data.id);
            res.status === 200 ? toast.success(res.data.message) : toast.error(res.data.message);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        handleUpload(selectedFile);
    };

    const handleUpload = async (file) => {
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('url', file);
        formData.append('type', 'GROUP');
        formData.append('group_id', id);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            response.status === 200 ? toast.success('Image uploaded successfully') : toast.error(response.data.message);
            navigate('/');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const getGroupApi = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setGroup(res.data.name);
        } catch (error) {
            console.error("Group Name", error);
        }
    };

    const viewMember = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setMember(res.data.members);
        } catch (error) {
            console.error("Group Members", error);
        }
    };

    useEffect(() => {
        getAccountDetail();
        getGroupApi();
        viewMember();
    }, [id]);

    const editGroup = () => {
        setUpdate(true);
    };

    const handleDelete = () => {
        setShowDeleteConfirmation(true);
        setGroupToDelete(id);
    };

    const confirmDelete = async () => {
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API}/groups/${groupToDelete}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            res.status === 200 ? toast.success(res.data.message) : toast.error(res.data.message);
            navigate('/');
        } catch (error) {
            
            if(error.res && error.res.status === 400 ){
                toast.error(error.res.data.message);
            }else{
                toast.error("An error occurred. Please try again later.");
            }
        }
        setShowDeleteConfirmation(false);
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <div className="bg-primaryColor h-svh">
        <div>
        {userId ? (
            <>
                <div className='py-3 px-2'>
                <div className='flex gap-2 items-center'>
                    <button onClick={() => navigate(-1)}>
                        <ArrowLeft className='text-white' />
                    </button>
                    <h2 className='text-white text-lg font-nunito'>Group settings</h2>
                </div>
            </div>
            <div className='px-4'>
                <div className='flex py-3 items-center justify-between'>
                    <div className="flex justify-between">
                        <div className="relative pt-3 flex items-center">
                            <div className="w-14 h-14 rounded-2xl" style={{ border: "2px solid white" }}>
                                <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
                                    <div className="w-full h-full object-cover rounded-2xl flex items-center justify-center">
                                        {file ? (
                                            <img src={URL.createObjectURL(file)} alt="Selected" className="w-full h-full object-cover rounded-2xl" />
                                        ) : (
                                            <span className="text-white"><Upload /></span>
                                        )}
                                    </div>
                                </label>
                            </div>
                            <div>
                                <h1 className="text-lg text-white font-nunito">{group?.name}</h1>
                                <h2 className="text-sm text-white font-nunito">{group?.description}</h2>
                            </div>
                        </div>
                    </div>
                    <span className="font-nunito text-white text-lg">{group}</span>
                    <button onClick={editGroup}>
                        <Pencil className='text-white hover:text-textColor' />
                    </button>
                </div>
                <div className='my-2'>
                    <span className="font-nunito text-lg text-white">Group members</span>
                    <div className='overflow-y-auto max-h-60 my-2 space-y-2'>
                        <Link to={`/group/${id}/settings/addpeople`} className="flex items-center gap-5">
                            <div className="rounded-full flex h-10 w-10 p-2 px-2">
                                <Users className='text-white' />
                            </div>
                            <div>
                                <h3 className="font-nunito text-white text-base">Add people to group</h3>
                            </div>
                        </Link>
                        {member.map((e, index) => (
                            <button key={index} className="flex gap-5 items-center">
                                <div className='relative w-10 h-10'>
                                    <img src={e.image_url || fallbackImage} alt="Profile" className="w-10 h-10 object-cover rounded-full" />                                </div>
                                <div>
                                    <h3 className="font-nunito text-white text-base">{e.name}</h3>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    {modal && <Modal onClose={() => setModal(false)} />}
                    {modals && <UpdateModal onClose={() => setModals(false)} ids={id} setGroup={setGroup} />}
                    {update && <UpdateModal onClose={() => setUpdate(false)} setGroup={setGroup} />}
                    <button className="flex gap-5 pt-3 items-center" onClick={handleDelete}>
                        <div className='rounded-full h-10 w-10 p-2 bg-white flex justify-center'>
                            <Trash className='text-red-600' />
                        </div>
                        <span className="font-nunito text-white text-base">Delete group</span>
                    </button>
                </div>
            </div>
            </> 
        ) : (
            <SplashScreen/>          
        )} 
        </div>   
            
            {showDeleteConfirmation && (
                <DeleteConfirmation
                    onLogout={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
};

export default Settings;
