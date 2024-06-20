/* eslint-disable no-unused-vars */
import { ArrowLeft, User, Mail, Users, UserRoundPlus, Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Modal from "../modal/modal";
import { toast } from 'react-toastify';
import SplashScreen from '../utils/splashscreen';

const SearchGroup = () => {
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const { id } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [group, setGroup] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [filteredGroup, setFilteredGroup] = useState([]);
  const [visible, setVisible] = useState(false);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Custom debounce function
  const debounce = (func, delay) => {
    return (...args) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // API call function
  const getGroupApi = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setGroup(res.data); // Assuming the data you need is in res.data
      setFilteredGroup(res.data); // Initially, display all users
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    const filtered = group.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.email.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredGroup(filtered);
  }, 300);

  // Handle input change
  const handleChange = (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };

  // Fetch initial list of users on component mount
  useEffect(() => {
    getGroupApi();
  }, []);

  // Focus on input
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // Update button visibility when selectedUserIds changes
  useEffect(() => {
    setVisible(selectedUserIds.length > 0);
  }, [selectedUserIds]);

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prevSelectedIds) =>
      prevSelectedIds.includes(userId)
        ? prevSelectedIds.filter((id) => id !== userId)
        : [...prevSelectedIds, userId]
    );
  };

  //This function is use to invite the member by clicking which member want to add.
  const inviteMemberDirect = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/group-members`, {
        group_id: id,
        user_id: selectedUserIds
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate(`/group/${id}`);
      } else {
        console.error(res.data.message);
      }
    } catch (error) {
      console.error("Error adding members to group:", error);
    }
  };

  return (
    <>
      <div className="bg-primaryColor h-svh  flex flex-col">
        <div className="flex gap-2 py-3 px-2">
          <button className="flex gap-2 items-center" onClick={() => navigate(-1)}>
            <ArrowLeft className="text-white flex items-center" />
          </button>
          <div className='w-full flex gap-2 px-3'>
            <Search className='text-white'/>
            <input
              type="text"
              placeholder="Enter name, email"
              className="text-lg font-nunito w-11/12 text-white bg-transparent focus:outline-none rounded px-2"
              value={searchTerm}
              onChange={handleChange}
              ref={inputRef}
            />
          </div>
        </div>

      
          <>
            <button className="flex gap-3 px-6 py-3" onClick={() => setModal(true)}>
              <div>
                <Users className='text-white '/>
              </div>
              <div>
                <h3 className="font-nunito text-white text-base">Add people to group</h3>
              </div>
            </button>
            
            {visible && (
              <div className="flex justify-end px-4 py-2">
                <button onClick={inviteMemberDirect} className="flex gap-2">
                  <UserRoundPlus className='text-white' />
                  <h2 className='text-white'>Add Members</h2>
                </button>
              </div>
            )}

            <div className="flex-grow p-4 pt-14 overflow-y-auto">
              <div className="flex justify-end">
                <h3 className="text-white text-sm font-nunito">
                  Total Friends: <span className="text-textColor">{filteredGroup.length}</span>
                </h3>
              </div>
              {Array.isArray(filteredGroup) && filteredGroup.map((item, index) => (
                <div key={index} className="bg-stone-800 p-4 flex flex-col gap-2 rounded-md shadow-md m-2">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <User className="text-white" />
                      <h3 className="text-white text-xl font-semibold">{item.name}</h3>
                    </div>
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-white bg-white rounded"
                      onChange={() => handleCheckboxChange(item.id)}
                      checked={selectedUserIds.includes(item.id)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="text-white" />
                    <p className="text-white text-sm font-nunito">{item.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </>

        {modal && <Modal onClose={() => setModal(false)} />}
      </div>
    </>
  );
};

export default SearchGroup;
