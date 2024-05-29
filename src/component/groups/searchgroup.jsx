import { ArrowLeft, User, Mail,Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import SplashScreen from "../utils/splashscreen"; // Assuming you have a SplashScreen component
import Modal from "../modal/modal";

const SearchGroup = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [group, setGroup] = useState([]);
  const [modal,setModal] = useState(false)
  const [filteredGroup, setFilteredGroup] = useState([]);
  const debounceRef = useRef(null);
 


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

  return (
    <>
    <div className="bg-primaryColor h-screen flex flex-col">
      <div className="flex gap-2 pt-3 pl-2">
        <button className="flex gap-2 items-center">
          <ArrowLeft className="text-white" onClick={() => navigate(-1)} /> </button>
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
                <Users className='text-black' onClick={"/creategroup"} />
            </div>
            <div>
                <h3 className="font-satoshi text-white text-base">Add people to group</h3>
            </div>
      </button>

      <div className="flex-grow p-4 pt-14 overflow-y-auto">
        <div className="flex justify-end">
          <h3 className="text-white text-sm font-satoshi">
            Total Friends: <span className="text-textColor">{filteredGroup.length}</span>
          </h3>
        </div>
        {filteredGroup.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredGroup.map((item, index) => (
              <div key={index} className="bg-stone-800 p-4 flex flex-col gap-2 rounded-md shadow-md">
                <div className="flex gap-2">
                  <User className="text-white" />
                  <h3 className="text-white text-xl font-semibold">{item.name}</h3>
                </div>
                <div className="flex gap-2">
                  <Mail className="text-white" />
                  <p className="text-white text-sm font-satoshi">{item.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SplashScreen />
        )}
      </div>
    </div>
    <div>{modal && <Modal onClose={() => setModal(false)} />}</div>
    </>
  );
};

export default SearchGroup;
