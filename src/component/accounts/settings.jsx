/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ArrowLeft, Pencil, Users, Trash } from 'lucide-react';
import Modal from "../modal/modal";
import UpdateModal from "../modal/updatemodal";
import { ImageUp } from "lucide-react";
import DeleteConfirmation from '../modal/delete-confirmation';

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
    const [userId, setUserId] = useState(null);  // User ID state
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation modal
    const [groupToDelete, setGroupToDelete] = useState(null); // State for group to delete
    const fallbackImage = "https://www.w3schools.com/w3images/avatar2.png"; // Replace this with your fallback image URL

    const groupColor = location.state?.color || '#7c3aed'; // Default color if none is passed

    const getAccountDetail = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/me`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setImageURL(res.data.image_url); // Set image URL
            setUserId(res.data.id); // Set user ID
            if (res.status === 200) {
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };
    useEffect(() => {
        getAccountDetail(); 
    },[])

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
        getGroupApi();
        viewMember();
    }, [id]);

    const editGroup = () => {
        setUpdate(true);
    };

    const handleDelete = async () => {
        setShowDeleteConfirmation(true); // Show the delete confirmation modal
        setGroupToDelete(id); // Set the group ID to delete
    };

    const confirmDelete = async () => {
        try {
            const res = await axios.delete(
                `${import.meta.env.VITE_API}/groups/${groupToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("Token")}`,
                    },
                }
            );
            if (res.status === 200) {
                toast.success(res.data.message)
                navigate('/');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("An error occurred. Please try again later.");
        }
        setShowDeleteConfirmation(false); // Hide the delete confirmation modal
    };

    const cancelDelete = () => {
        setShowDeleteConfirmation(false); // Hide the delete confirmation modal
    };

    return (
        <div className="bg-primaryColor h-svh">
            <div className='py-2 px-2'>
                <button className='flex gap-2 items-center' onClick={() => navigate(-1)}>
                    <ArrowLeft className='text-white' />
                    <h2 className='text-white text-lg font-nunito'>Group settings</h2>
                </button>
            </div>
            <div className='px-4'>
                <div className='flex py-3 items-center justify-between'>
                    <div className='h-14 w-14 rounded-2xl' style={{ backgroundColor: groupColor }} >
                        {/* <img src={imageURL} alt='Group' className="w-full h-full rounded-2xl object-cover"/> */}
                    </div>
                    
                    <span className="font-nunito text-white text-lg">{group}</span>
                    <button>
                        <Pencil className='text-white hover:text-textColor' onClick={editGroup} />
                    </button>
                </div>
                <div className='my-2'>
                    <span className="font-nunito text-lg text-white">Group members</span>
                    <div className='overflow-y-auto max-h-60 my-2 space-y-2'>
                          <Link to={`/group/${id}/settings/addpeople`} className="flex items-center gap-5" >
                            <div className="rounded-full flex h-10 w-10 p-2 px-2 bg-white">
                                <Users className='text-black' />
                            </div>
                            <div>
                                <h3 className="font-nunito text-white text-base">Add people to group</h3>
                            </div>
                        </Link>
                        {member.map((e, index) => (
                            <button key={index} className="flex gap-5 items-center">
                                <div className='relative w-10 h-10'>
                                    <img
                                        src={e.id === userId ? imageURL : fallbackImage} // Set the profile picture if ID matches
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
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
            {showDeleteConfirmation && (
                <DeleteConfirmation
                    onLogout={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    )
}

export default Settings;
