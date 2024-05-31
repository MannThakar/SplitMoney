import { ArrowLeft, User, Mail, Users, UserRoundPlus } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Modal from "../modal/modal";
import { toast } from 'react-toastify';

const SearchGroup = () => {
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const location = useLocation();
  const { id } = location.state;

  const [searchTerm, setSearchTerm] = useState("");
  const [group, setGroup] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [filteredGroup, setFilteredGroup] = useState([]);
  const [visible, setVisible] = useState(false);

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
      const data = res.data.data || [];
      setGroup(data); // Assuming the data you need is in res.data
      setFilteredGroup(data); // Initially, display all users
      
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
        toast.success("Members added to group successfully");

      } else {
        console.error(res);
      }
    } catch (error) {
      console.error("Error adding members to group:", error);
    }
  };

  console.log(selectedUserIds);     

  return (
    <>
      <div className="bg-primaryColor h-screen flex flex-col">
        <div className="flex gap-2 pt-3 pl-2">
          <button className="flex gap-2 items-center">
            <ArrowLeft className="text-white" onClick={() => navigate(-1)} />
          </button>
          <div className='w-full'>
            <input
              type="text"
              placeholder="Enter name, email"
              className="text-lg font-satoshi w-11/12 text-white bg-transparent rounded px-2"
              value={searchTerm}
              onChange={handleChange}
            />
          </div>
        </div>

        <button className="flex gap-2 px-2 pt-3 items-center" onClick={() => setModal(true)}>
          <div className="rounded-full h-10 w-10 p-2 bg-white">
            <Users className='text-black' />
          </div>
          <div>
            <h3 className="font-satoshi text-white text-base">Add people to group</h3>
          </div>
        </button>

        {visible && (
          <div className="flex justify-end">
            <button onClick={inviteMemberDirect} className="bg-white text-black p-4 rounded-2xl w-24 text-5xl flex justify-center mr-4">
              <UserRoundPlus />
            </button>
          </div>
        )}
        <div className="flex-grow p-4 pt-14 overflow-y-auto">
          <div className="flex justify-end">
            <h3 className="text-white text-sm font-satoshi">
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
                />
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-white" />
                <p className="text-white text-sm font-satoshi">{item.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>{modal && <Modal onClose={() => setModal(false)} />}</div>
    </>
  );
};

export default SearchGroup;
