/* eslint-disable no-debugger */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

import { useNavigate, useParams, useLocation,Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ArrowLeft, Pencil, Users, Trash } from 'lucide-react';
import Modal from "../modal/modal";
import UpdateModal from "../modal/updatemodal";

const Settings = ({ onClose }) => {

    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const [modal, setModal] = useState(false);
    const [modals, setModals] = useState(false);
    const [update, setUpdate] = useState(false);
    const [group, setGroup] = useState(null);
    const [member, setMember] = useState([]);

    const groupColor = location.state?.color || '#7c3aed'; // Default color if none is passed

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
                    navigate('/');
                } else {
                    toast.error(res);
                }
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
                <button className='flex gap-2' onClick={() => navigate(-1)}>
                    <ArrowLeft className='text-white' />
                    <h2 className='text-white text-lg font-satoshi'>Group settings</h2>
                </button>
            </div>
            <div className='px-4'>
                <div className='flex my-3 items-center justify-between'>
                    <div className='h-14 w-14 rounded-2xl' style={{ backgroundColor: groupColor }}></div>
                    <span className="font-satoshi text-white text-lg">{group}</span>
                    <button>
                        <Pencil className='text-white hover:text-textColor' onClick={editGroup} />
                    </button>
                </div>
                <div className='my-2'>
                    <span className="font-satoshi text-lg text-white">Group members</span>
                    <div className='overflow-y-auto max-h-60 my-2 space-y-2'>
                          <Link to={`/group/${id}/settings/addpeople`} className="flex items-center gap-5" >
                            <div className="rounded-full flex h-10 w-10 p-2 bg-white">
                                <Users className='text-black' />
                            </div>
                            <div>
                                <h3 className="font-satoshi text-white text-base">Add people to group</h3>
                            </div>
                        </Link>
                        {member.map((e, index) => (
                            <button key={index} className="flex gap-5 items-center">
                                <div className="rounded-full h-10  w-10 p-2 bg-white">
                                    <Users className='text-black' />
                                </div>
                                <div>
                                    <h3 className="font-satoshi text-white text-base">{e.name}</h3>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    {modal && <Modal onClose={() => setModal(false)} />}
                    {modals && <UpdateModal onClose={() => setModals(false)} ids={id} setGroup={setGroup} />}
                    {update && <UpdateModal onClose={() => setUpdate(false)} setGroup={setGroup} />}
                    <button className="flex gap-5 pt-3 items-center" onClick={() => handleDelete(id)}>
                        <div className='rounded-full h-10 w-10 p-2 bg-white flex justify-center'>
                            <Trash className='text-red-600' />
                        </div>
                        <span className="font-satoshi text-white text-base">Delete group</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings;
