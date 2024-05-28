
// import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import VerifyLoaderComponent from '../utils/verifyloadercomponent'
import axios from 'axios';
const GroupInvite = () => {
    const { token } = useParams()
    const navigate = useNavigate();
    console.log(token)

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


            if (response.status === 400) {
                localStorage.setItem('member-token', token)
                navigate('/signup');
            } else if (response.status === 200) {
                console.log(response)

                /* console.log('Invitation sent successfully'); */
            } else {
                console.log('Error while sending invitation');
            }


        } catch (error) {
            /* console.error('Error:', error); */
        }
    }

    return (
        <>
            < VerifyLoaderComponent />
        </>
    )
}

export default GroupInvite;