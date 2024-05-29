/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../utils/splashscreen';
import axios from 'axios';
const GroupInvite = () => {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const accessToken = localStorage.getItem('Token');


    useEffect(() => {
        if (accessToken) {
            checkInvitation();
            console.log("Access Token is Avaliable");
            navigate('/');
        }
        else if(!accessToken){
            localStorage.setItem('inviteToken', token);
            console.log("Access Token is Not Avaliable");
            navigate('/signin');
        }
        
    }, [accessToken]);

    async function checkInvitation() {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API}/invite-group/?token=${token}`,
                { token: token },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }
            );
            if (response.status == 200) {
                alert('You have successfully joined the group');
                navigate('/');
            }
            else
                alert('Invalid Token');
        } catch (error) {
            console.error('Error:', error);
            alert(error.response.data.message);
            navigate('/');
        }
    }

    


    return (
        <>
            <SplashScreen />
        </>
    )
}

export default GroupInvite;