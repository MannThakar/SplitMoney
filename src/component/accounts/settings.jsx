/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Group, X } from 'lucide-react';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import Modal from "../modal/modal";
import { toast } from 'react-toastify'
import axios from 'axios';
import UpdateModal from "../modal/updatemodal";
import { ArrowLeft, Pencil, Users, Trash } from 'lucide-react';

const Settings = ({ onClose }) => {
    const [modal, setModal] = useState(false);
    const [modals, setModals] = useState(false);
    const [update, setUpdate] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [group, setGroup] = useState(null);
    const groupColor = location.state?.color || '#7c3aed'; // Default color if none is passed

    const getGroupApi = async () => {
        const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("Token")}`,
            },
        });
        setGroup(res.data.name);
    };

    useEffect(() => {
        getGroupApi();
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
                    toast.success(res.data.message)
                    navigate('/'); // Redirect to home after deletion
                } else {
                    toast.error(res.data.message);
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
            <div className='pt-3 pl-2'>
                <button className='flex gap-2'>
                    <ArrowLeft className='text-white' onClick={() => navigate(-1)} />
                    <h2 className='text-white text-base font-satoshi'>back</h2>
                </button>
            </div>
            <div className='px-4'>
                <div className="py-2">
                    <h4 className='font-santoshi font-semibold text-white text-2xl flex justify-center'>Group settings</h4>
                </div>
                <hr />

                {/* Group name and edit functionality*/}
                <div className='flex my-3 items-center justify-between'>
                    <div className='h-14 w-14 rounded-2xl' style={{ backgroundColor: groupColor }}> </div>
                    <span className="font-satoshi text-white text-lg">{group}</span>
                    <button>
                        <Pencil className='text-white hover:text-textColor' onClick={editGroup} />
                    </button>
                </div>

                {/* Group member detail add people in group and email */}
                <div className='my-2'>
                    <span className="font-satoshi text-lg text-white ">Group members</span>
                    <div className='space-y-5 my-2'>
                        <button className="flex gap-5 items-center" onClick={() => setModal(true)}>
                            <div className="rounded-full h-10 w-10 p-2 bg-white">
                                <Users className='text-black' onClick={"/creategroup"} />
                            </div>
                            <div>
                                <h3 className="font-satoshi text-white text-base">Add group members</h3>
                            </div>
                        </button>
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
