/* eslint-disable no-debugger */
import axios from 'axios';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'

const GroupInvite = () => {

    const { id } = useParams();
    console.log(id)
    useEffect(() => {
        checkInvitation();
    }, [])


    async function checkInvitation() {
        const response = await axios.post(`${import.meta.env.VITE_API}/invite-group/?token=${id}`, {
            token: id
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        console.log(response)
    }

    return (
        <>
            <div>GroupInvite</div>
            <p>{id}</p>
        </>
    )
}

export default GroupInvite