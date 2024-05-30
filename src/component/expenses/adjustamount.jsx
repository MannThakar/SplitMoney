import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, User } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GroupContext } from '../auth/groupcontext';

const AdjustAmount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setGroupId } = useContext(GroupContext);
  const [members, setMembers] = useState([]);
  const [selectedMemberIDs, setSelectedMemberIDs] = useState({});

  useEffect(() => {
    const viewMember = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        });
        const membersData = res.data.members;
        setMembers(membersData);
        setGroupId(id);  // Set the groupId here
      } catch (error) {
        console.error("Group Members", error);
      }
    };
    viewMember();
  }, [id, setGroupId]);
  
  console.log(selectedMemberIDs)
  const handleCheckboxChange = (memberId) => {
    setSelectedMemberIDs((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  return (
    <div className="bg-primaryColor h-svh">
      <div className='pt-3 pl-2 flex justify-between'>
        <button className='flex gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='text-white' />
          <h2 className='text-white text-lg font-satoshi'>Adjust split</h2>
        </button>
        <div>
          <Check className='text-white mr-3' />
        </div>
      </div>

      <div className="mt-6 px-4">
        {!members || members.length === 0 ? (
          <h1>Loader</h1>
        ) : (
          members.map((member) => (
            <div key={member.id} className="flex items-center justify-between mb-4">
              <button className="flex gap-5 items-center">
                <div className="rounded-full h-10 w-10 p-2 bg-white">
                  <User className="text-black" />
                </div>
                <div>
                  <h3 className="font-satoshi text-white text-base">{member.name}</h3>
                </div>
              </button>
              <input
                type="checkbox"
                className="form-checkbox text-white"
                checked={!!selectedMemberIDs[member.id]}
                onChange={() => handleCheckboxChange(member.id)}
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate(`/group/${id}/addexpense`, { state: { selectedMemberIDs } })}
          className="p-2 bg-buttonColor text-black rounded-2xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default AdjustAmount;
