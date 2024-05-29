/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../utils/splashscreen';
import axios from 'axios';
const GroupInvite = () => {

    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');


    useEffect(() => {
        checkInvitation();
    }, [])
    // const token = localStorage.getItem('Invite Token');

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
                localStorage.setItem('Invite Token', token);
                
            }
        } catch (error) {
            console.error('Error:', error);
            alert(error.response.data.message);
            navigate('/signup');
        }
    }

    return (
        <>
            <SplashScreen />
        </>
    )
}

export default GroupInvite;