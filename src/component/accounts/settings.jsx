/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Group, X } from 'lucide-react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ArrowLeft, Pencil, Users, Trash } from 'lucide-react';
import Modal from "../modal/modal";
import {Toaster } from 'react-hot-toast';
import UpdateModal from "../modal/updatemodal";
<<<<<<< Updated upstream
import { Link } from 'react-router-dom';

=======

import { Upload } from 'lucide-react';
import DeleteConfirmation from '../modal/delete-confirmation';
>>>>>>> Stashed changes

const Settings = ({ onClose }) => {
    const [modal, setModal] = useState(false);
    const [modals, setModals] = useState(false);
    const [update, setUpdate] = useState(false);
    const [group, setGroup] = useState(null);
    const [member, setMember] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const groupColor = location.state?.color || '#7c3aed'; // Default color if none is passed

    const [imageURL, setImageURL] = useState(null);
    const [userId, setUserId] = useState(null);  // User ID state
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State for delete confirmation modal
    const [groupToDelete, setGroupToDelete] = useState(null); // State for group to delete
    const fallbackImage = "https://www.w3schools.com/w3images/avatar2.png"; // Replace this with your fallback image URL
    const [file, setFile] = useState(null); // State for selected file

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
    }, [])


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        handleUpload(selectedFile); // Directly call handleUpload with the selected file
    };

    const handleUpload = async (file) => {
        if (!file) {
            toast.error('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('url', file);
        formData.append('type', 'GROUP'); // Assuming 'png' is the required type
        formData.append('group_id', id);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                // Update any necessary state or UI here
                toast.success('Image uploaded successfully');
                navigate('/')
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const getGroupApi = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
        });
        setGroup(res.data.name);
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

    //Delete Group
    const handleDelete = async (id) => {
        let del = confirm("Are you sure!!");
        if (del) {
            try {
                const res = await axios.delete(
                    `${import.meta.env.VITE_API}/groups/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("Token")}`,
                        },
                    }
                );
                if (res.status === 200) {
                    navigate('/'); // Redirect to home after deletion
                } else {
                    toast.error(res);
                }
                console.log(res);

            } catch (error) {
                console.error("Error:", error);
                toast.error("An error occurred. Please try again later.");
            }
        } else {
            toast.error("You pressed cancel");
        }
    };

    return (
        <div className="bg-primaryColor h-svh">

            <Toaster
                position='top-center'
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />

            <div className='pt-3 pl-2'>
                <button className='flex gap-2'>
                    <ArrowLeft className='text-white' onClick={() => navigate(-1)} />
                    <h2 className='text-white text-base font-satoshi'>back</h2>
                </button>
            </div>
            <div className='px-4'>
<<<<<<< Updated upstream
                <div className="py-2">
                    <h4 className='font-santoshi font-semibold text-white text-2xl flex justify-center'>Group settings</h4>
                </div>
                <hr />

                {/* Group name and edit functionality*/}
                <div className='flex my-3 items-center justify-between'>
                    <div className='h-14 w-14 rounded-2xl' style={{ backgroundColor: groupColor }}> </div>
                    <span className="font-satoshi text-white text-lg">{group}</span>
=======
                <div className="flex justify-between">
                    <div className="relative pl-5 pt-3 flex items-center">
                        <div className="w-14 h-14 rounded-2xl " style={{ border: "2px solid white" }}>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer w-full h-full block">
                                <div className="w-full h-full object-cover rounded-2xl flex items-center justify-center">
                                    {file ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="Selected"
                                            className="w-full h-full object-cover rounded-2xl"
                                        />
                                    ) : (
                                        <span className="text-white"> <Upload /></span>
                                    )}
                                </div>
                            </label>
                        </div>

                        <div>
                            <h1 className="text-lg text-white font-nunito">{group?.name}</h1>
                            <h2 className="text-sm text-white font-nunito">{group?.description}</h2>
                        </div>
                    </div>

                    <div className='flex py-3 items-center justify-between'>
                        <span className="font-nunito text-white text-lg">{group}</span>

                    </div>
>>>>>>> Stashed changes
                    <button>
                        <Pencil className='text-white hover:text-textColor' onClick={editGroup} />
                    </button>

                </div>

                {/* Group member detail add people in group and email */}

                <div className='my-2'>
                    <span className="font-satoshi text-lg text-white">Group members</span>
                    <div className='overflow-y-auto max-h-60 my-2 space-y-2'>
                        <Link to={`/group/${id}/settings/addpeople`} className="flex items-center gap-5" >
<<<<<<< Updated upstream
                            <div className="rounded-full flex h-10 w-10 p-2 bg-white">
=======
                            <div className="rounded-full flex h-10 w-10 p-2 px-2 bg-white">
>>>>>>> Stashed changes
                                <Users className='text-black' />
                            </div>
                            <div>
                                <h3 className="font-satoshi text-white text-base">Add group members</h3>
                            </div>
                        </Link>


                        {!member || member.length === 0 ? (
                            <h1>Loader</h1>
                        ) : (
                            member.map((e, index) => (
                                <>
                                    <button className="flex gap-5 items-center">
                                        <div className="rounded-full h-10 w-10 p-2 bg-white">
                                            <Users className='text-black' />
                                        </div>
                                        <div>
                                            <h3 className="font-satoshi text-white text-base">{e.name}</h3>
                                        </div>
                                    </button>
                                </>
                            ))
                        )}
                        <div>{modal && <Modal onClose={() => setModal(false)} />}</div>

                        {modals && <UpdateModal onClose={() => setModals(false)} ids={id} setGroup={setGroup} />}

                        <div>{update && <UpdateModal onClose={() => setUpdate(false)} setGroup={setGroup} />}</div>


                        <button className="flex space-x-5 items-center" onClick={() => handleDelete(id)}>
                            <div className='rounded-full h-10 w-10 p-2 bg-white flex justify-center'>
                                <Trash className='text-red-600' />
                            </div>
                            <span className="font-satoshi text-white text-base">Delete group</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Settings;
