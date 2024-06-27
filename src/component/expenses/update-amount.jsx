/* eslint-disable no-unused-vars */
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, User, IndianRupee } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import SplashScreen from '../utils/splashscreen'
import Button from '../ui/button'

const UpdateAmount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [members, setMembers] = useState([]);
  const [selectedMemberIDs, setSelectedMemberIDs] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [tab, setTab] = useState('equally');
  const [amounts, setAmounts] = useState({});
  const [loading,setLoading] = useState(false);
  const location = useLocation();
  const expenseId = location.pathname.split("/")[4];
  const expenseFormData = JSON.parse(localStorage.getItem('expenseFormData'));

 
 const handleSubmit = () => {
    navigate(`/group/${id}/expense/${expenseId}/edit`, { state: { selectedMemberIDs, amounts, tab }});
 }
  const viewMember = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      const membersData = res.data.members;
      setMembers(membersData);
      if (res.status === 200) {
          setLoading(true)
      }
    } catch (error) {
      console.error("Group Members", error);
    }
  }, [id]);

  useEffect(() => {
    viewMember();
  }, [viewMember]);

  useEffect(() => {
    const savedAmounts = {};
    members.forEach((member) => {
      const savedAmount = localStorage.getItem(`unequallyAmount_${member.id}`);
      if (savedAmount) {
        savedAmounts[member.id] = savedAmount;
      }
    });
    setAmounts(savedAmounts);
  }, [members]);

  useEffect(() => {
    // Update selectedMemberIDs to initially select all members
    const initialSelectedMemberIDs = {};
    members.forEach((member) => {
      initialSelectedMemberIDs[member.id] = true;
    });
    setSelectedMemberIDs(initialSelectedMemberIDs);
  }, [members]);

  const handleCheckboxChange = (memberId) => {
    setSelectedMemberIDs((prevSelectedMemberIDs) => ({
      ...prevSelectedMemberIDs,
      [memberId]: !prevSelectedMemberIDs[memberId],
    }));
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    if (newSelectAll) {
      const newSelectedMemberIDs = {};
      members.forEach((member) => {
        newSelectedMemberIDs[member.id] = true;
      });
      setSelectedMemberIDs(newSelectedMemberIDs);
    } else {
      setSelectedMemberIDs({});
    }
  };

  const handleAmountChange = (memberId, amount) => {
    if (amount.length <= 4 && /^\d{0,4}$/.test(amount)) {
      setAmounts((prevAmounts) => ({
        ...prevAmounts,
        [memberId]: amount,
      }));
      localStorage.setItem(`unequallyAmount_${memberId}`, amount);
    }
  };

  
  const calculateTotalAmount = () => {
    return Object.values(amounts).reduce((total, amount) => total + parseFloat(amount || 0), 0);
  };

 
  return (
    <div className="bg-primaryColor h-svh">
      <div>
      {loading ?
      (
          <>
          <div className='py-3 px-2 flex justify-between'>
            <button className='flex gap-2' onClick={() => navigate(-1)}>
              <ArrowLeft className='text-white' />
              <h2 className='text-white text-lg font-nunito'>Adjust split</h2>
            </button>
          </div>

          <div className="flex justify-center gap-10 mt-4">
            <button className={`text-white text-xl ${tab === 'equally' ? 'font-bold' : ''}`} onClick={() => setTab('equally')}>Equally</button>
            <button className={`text-white text-xl ${tab === 'unequally' ? 'font-bold' : ''}`} onClick={() => setTab('unequally')}>Unequally</button>
          </div>

          {tab === 'equally' ? (
            <div className="mt-6 px-4">
              {!members || members.length === 0 ? (
                <h1>Loading...</h1>
              ) : (
                <>
                  <div className="flex items-center justify-end gap-3 mb-4">
                    <span className="text-white text-base font-bold font-nunito">All</span>
                    <input
                      type="checkbox"
                      className="form-checkbox text-white"
                      checked={selectAll}
                      onChange={handleSelectAllChange}
                    />
                  </div>
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between mb-4">
                      <button className="flex gap-5 items-center">
                        <div className="">
                          <User className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-nunito text-white text-base">{member.name}</h3>
                        </div>
                      </button>
                      <input
                        type="checkbox"
                        className="form-checkbox text-white"
                        checked={!!selectedMemberIDs[member.id]}
                        onChange={() => handleCheckboxChange(member.id)}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="mt-6 px-4">
              {members.map((member) => (
                <div key={member.id} className="mb-4">
                  <div className="flex items-center justify-between gap-14 mb-2">
                    <div className="flex items-center gap-5">
                      <User className="text-white" />
                      <span className="text-white text-base font-nunito">{member.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="text-white" />
                      <input
                        type="number"
                        value={amounts[member.id] || ''}
                        onChange={(e) => handleAmountChange(member.id, e.target.value)}
                        className="form-input text-white bg-transparent w-10 border-gray-300"
                        placeholder="0.00"
                        maxLength="4"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="mt-4 font-nunito text-base text-white flex justify-end">
                <span className='pr-1 font-nunito text-base'>Total : <span className=''>{calculateTotalAmount()}</span></span>
              </div>
            </div>
          )} 
            <Button click={handleSubmit} />
          </>
          ): (
              <SplashScreen/>
          )}
          </div>
     
    </div>
  );
};

export default UpdateAmount;