/* eslint-disable react/jsx-key */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { Users, UserRound, CircleUserRound } from 'lucide-react';
import { CiViewList } from "react-icons/ci";
import SplashScreen from '../utils/splashscreen';

const Home = () => {
  const navigate = useNavigate();
  const [res, setRes] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const colors = ["#7c3aed", "#0891b2", "#16a34a", "#ea580c"];
  const icons = [<CiViewList />, <CiViewList />];

  const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';

  // View Group
  async function viewGroup() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/groups`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      console.log('groups::::::::',response);
      const groupsWithColors = response.data.map((group, index) => ({
        ...group,
        color: colors[index % colors.length],
      }));
      setRes(groupsWithColors);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const getAccountDetail = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setImageURL(res.data.image_url);
      if (res.status === 200) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  useEffect(() => {
    viewGroup();
    getAccountDetail();
  }, []);

  return (
    <div className="bg-primaryColor h-svh">
      <div className="px-3 py-2 flex justify-between items-center flex-row-reverse bg-opacity-50 backdrop-blur-sm">
        <button>
          <Users className="text-white hover:text-textColor" onClick={() => navigate('/creategroup')} />
        </button>
        <div>
          <h1 className="text-xl text-white font-nunito font-semibold">Groups Details</h1>
        </div>
      </div>
      <div className='mt-2'></div>

      <div className='overflow-y-scroll h-96'>
        {res.length ? (
          res.map((e, index) => (
            <div key={index} className="w-11/12 mx-auto mt-3">
              <Link to={`/group/${e.id}`} state={{ color: e.color, imageURL }}>
                <div className="flex gap-5 items-center">
                  <div
                    className="flex w-14 h-14 rounded-xl items-center justify-center"
                    style={{ backgroundColor: e.color }}>
                    {/* <span className='text-white text-5xl'>{icons[index % icons.length]}</span> */}
                    {e.image_url == null ? <img src="https://www.w3schools.com/w3images/avatar2.png" className="rounded-xl" /> : <img src={e.image_url} className="rounded-xl" />}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold font-nunito text-white">{e.name}</h2>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-bold font-nunito ${e.groupStatistics.type === 'borrowed' ? 'text-red-500' : 'text-green-500'}`}>
                        {e.groupStatistics.type === 'borrowed' ? 'You owe' : 'You are owed'} ₹{e.groupStatistics.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <SplashScreen />
        )}
      </div>

      <div className="flex justify-around w-full fixed bottom-0 bg-primaryColor p-2">
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
          <Users className={`size-5 ${isActive('/')}`} />
          <span className={`flex justify-start text-base font-nunito ${isActive('/')}`}>Groups</span>
        </button>
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/friends")}>
          <UserRound className={`size-5 ${isActive('/friends')}`} />
          <span className={`flex justify-start text-base font-nunito ${isActive('/friends')}`}>Friends</span>
        </button>
        <button className="flex flex-col justify-center items-center" onClick={() => navigate("/accounts")}>
          <CircleUserRound className={`size-5 ${isActive('/accounts')}`} />
          <span className={`flex justify-start text-base font-nunito ${isActive('/accounts')}`}>Account</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
