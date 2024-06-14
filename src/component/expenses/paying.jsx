
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SplashScreen from '../utils/splashscreen';

const Paying = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [members, setMembers] = useState([]);
    const [imageURL, setImageURL] = useState(null);
    const [userId, setUserId] = useState(null); // User ID state

    const fallbackImage = "https://www.w3schools.com/w3images/avatar2.png"; // Replace this with your fallback image URL

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
    }, []);

    const viewMember = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            console.log(response);
            setMembers(response.data.members);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        viewMember();
    }, []);

    const handleMemberClick = (memberId, memberName) => {
        localStorage.setItem('payer_user_id', JSON.stringify({ user_id: memberId, selectedMemberName: memberName }));

        navigate(`/group/${id}/addexpense`, { state: { user_id: memberId, selectedMemberName: memberName } });
        // console.log('who pay:::::',memberId,memberName);
    };

    return (
        <div className="bg-primaryColor h-svh">
            <div className='py-3 px-2 flex justify-between'>
                <button className='flex gap-2' onClick={() => navigate(`/group/${id}`)}>
                    <ArrowLeft className='text-white' />
                    <h2 className='text-white text-lg font-nunito'>Who paid?</h2>
                </button>
            </div>
            <div className='pt-3 px-3'>
                {members ? (
                    <div className='space-y-4'>
                        {members.map((e, index) => (
                        <button
                            key={index}
                            className="flex gap-5 items-center"
                            onClick={() => handleMemberClick(e.id, e.name)}
                        >
                            <div className="relative w-10 h-10">
                            <img src={e.image_url || fallbackImage} alt="Profile" className="w-10 h-10 object-cover rounded-full" />
                            </div>
                            <div>
                            <h3 className="font-nunito text-white text-base">{e.name}</h3>
                            </div>
                        </button>
                        ))}
                    </div>
                   ) : (
                        <SplashScreen />
                    )}

                
            </div>
        </div>
    );
};

export default Paying;

