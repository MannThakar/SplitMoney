import { useNavigate,useParams} from 'react-router-dom';
import { ArrowLeft,User } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Paying = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [members, setMembers] = useState([]);
    
    const viewMember = async () => { 
        try {
            const response = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`
                },
            })
            setMembers(response.data.members);
        } catch (error) { 
            console.error(error);
        }
    }
   
    useEffect(() => {
        viewMember();
    },[])

  return (
    <div className="bg-primaryColor h-svh">
        <div className='pt-3 pl-2 flex justify-between'>
            <button className='flex gap-2' onClick={() => navigate('/')}>
            <ArrowLeft className='text-white' />
            <h2 className='text-white text-lg font-satoshi'>Who paid?</h2>
            </button>
        </div>
        <div className='pt-3 px-3'>
            {!members || members.length === 0 ? (
                <h1>Loder</h1>
            ) : (
                    members.map((member) => (
                        <div key={member.id} className='flex items-center justify-between mb-4'>
                            <button className='flex gap-5 items-center'>
                                <div className='rounded-full h-10 w-10 p-2 bg-white'>
                                    <User className='text-black' />
                                </div>
                                <div>
                                    <h3 className='font-satoshi text-white text-base'>{member.name}</h3>
                                </div>
                            </button>
                            
                       </div> 
                  ))
              )}
          </div>
    </div>
  )
}

export default Paying
