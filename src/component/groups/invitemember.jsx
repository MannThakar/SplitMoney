/* eslint-disable no-unused-vars */
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import SplashScreen from '../utils/splashscreen';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// const GroupInvite = () => {
//     const navigate = useNavigate();
//     const queryParams = new URLSearchParams(location.search);
//     const token = queryParams.get('token');
//     const accessToken = localStorage.getItem('Token');
//     const email = queryParams.get('email');



//     useEffect(() => {
//         if (accessToken) {
//             checkInvitation();
//             console.log("Access Token is Avaliable");
//             navigate('/');
//         }
//         else if (!accessToken) {
//             localStorage.setItem('inviteToken', token);
//             console.log("Access Token is Not Avaliable");
//             checkInvitation();
//             navigate('/signin');

//         }


//     }, [accessToken]);

//     async function checkInvitation() {
//         try {
//             const response = await axios.post(
//                 `${import.meta.env.VITE_API}/invite-group/?token=${token}`,
//                 { token: token },
//                 {
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-Requested-With': 'XMLHttpRequest'
//                     }
//                 }
//             );

//             if (response.status == 200) {
//                 if (accessToken) {
//                     toast.success(response.data.message);
//                     navigate('/');
//                 }
//                 else {
//                     toast.error(response.data.message);
//                 }
//             }
//             else
//                 alert('Invalid Token');
//         } catch (error) {
//             console.error('Error:', error);
//             toast.error(error.response.data.message);
//             navigate('/signup', { state: { email: email } });
//         }
//     }
//     return (
//         <>
//             <SplashScreen />
//         </>
//     )
// }

// export default GroupInvite;


/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SplashScreen from '../utils/splashscreen';
import { toast } from 'react-toastify';
import axios from 'axios';

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
            checkInvitation();
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
                if (accessToken) {
                    toast.success(response.data.message);
                    navigate('/');
                }
                else {
                    toast.error(response.data.message);
                }
            }
            else
                alert('Invalid Token');
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response.data.message);
            navigate('/signup', { state: { email: email } });
        }
    }
    return (
        <>
            <SplashScreen />
        </>
    )
}

export default GroupInvite;