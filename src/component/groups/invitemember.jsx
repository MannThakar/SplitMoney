/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../utils/splashscreen';
import axios from 'axios';
<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
const GroupInvite = () => {
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const accessToken = localStorage.getItem('Token');
    const email = queryParams.get('email');
    

    useEffect(() => {
        if (accessToken) {
            checkInvitation();
            console.log("Access Token is Avaliable");
            navigate('/');
        }
        else if (!accessToken) {
            localStorage.setItem('inviteToken', token);
            console.log("Access Token is Not Avaliable");
            navigate('/signin');
        }
        else {
            navigate('/');
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
<<<<<<< Updated upstream
                alert('You have successfully joined the group');
                navigate('/');
=======
                if (accessToken) {
                    toast.success("successfully accepted the invitation");
                    navigate('/');
                    console.log(email);

                }
                else {
                    
                    toast.error("please login to accept the invitation")
                    /* navigate('/signin') */
                    navigate('/signin',{state: {email: email}});
                    console.log(email);
                }
>>>>>>> Stashed changes
            }
            else
                alert('Invalid Token');
        } catch (error) {
            console.error('Error:', error);
<<<<<<< Updated upstream
            alert(error.response.data.message);
            navigate('/');
=======
            toast.error(error.response.data.message);
            navigate('/signup',{state: {email: email}});
            /* navigate('/signup'); */
>>>>>>> Stashed changes
        }
    }



    return (
        <>
            <SplashScreen />
        </>
    )
}

export default GroupInvite;