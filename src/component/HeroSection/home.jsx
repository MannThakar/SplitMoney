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
import Footer from '../ui/footer';

const Home = () => {
  const navigate = useNavigate();
  const [res, setRes] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [userid,setUserId] = useState(null);
  const colors = ["#7c3aed", "#0891b2", "#16a34a", "#ea580c"];

  const getOverallText = (overall, overall_type) => {
    switch (overall_type) {
      case 'Balanced':
        return <p className='px-4' style={{ color: 'white' }}>Overall, you are balanced with ₹{overall.toFixed(2)}</p>;
      case 'lent':
        return <p  className='px-4 font-normal' style={{ color: '#09B83E' }}>Overall, you are owed with ₹{overall.toFixed(2)}</p>;
      case 'borrowed':
        return <p className='px-4' style={{ color: '#FF0000' }}>Overall, you owe with ₹{overall.toFixed(2)}</p>;
      case 'No Expenses':
        return <p className='px-4' style={{color:'gray'}}>no expenses</p>
      default:
        return null;
    }
  };
  const viewGroup = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/groups`, {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      const groupsWithColors = response.data.groups.map((group, index) => ({
        ...group,
        color: colors[index % colors.length],
      }));
      setRes({ ...response.data, groups: groupsWithColors });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAccountDetail = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      setImageURL(res.data.image_url);
      setUserId(res.data.id);
    

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
    if (userid != null) {
      localStorage.setItem('USER-ID',userid);
    }
  },[userid]);
  useEffect(() => {
    viewGroup();
    getAccountDetail();
  }, []);
  return (
    <div className="bg-primaryColor h-screen">
      <div className="px-3 py-2 flex justify-between items-center flex-row-reverse bg-opacity-50 backdrop-blur-sm">
        <button>
          <Users className="text-white hover:text-textColor" onClick={() => navigate('/creategroup')} />
        </button>
        <div>
          <h1 className="text-xl text-white font-nunito">Groups Details</h1>
        </div>
      </div>
      <div className='mt-2'></div>

      <div>
        {res ? (
          <>
            <div className="mb-4">
              {getOverallText(res.overall, res.overall_type)}
            </div>
            {res.groups && res.groups.length ? (
            res.groups.map((e, index) => (
          <div key={index} className="w-11/12 mx-auto mt-3">
          <Link to={`/group/${e.id}`} state={{ color: e.color, img: e.image_url }}>
            <div className="flex gap-5 items-center">
              <div className="flex w-14 h-14 rounded-xl items-center justify-center">
                {e.image_url == null ? (
                    <CiViewList className='text-white size-10 w-14 h-14'/>
                ): (
                  <img src={e.image_url} className="size-8 w-12 h-12 rounded-md object-cover" />
                )}
              </div>  
          <div className="flex-1">
            <h2 className="text-lg font-semibold font-nunito text-white">{e.name}</h2>
            <div className="flex items-center gap-2">
              <p className={`text-sm font-normal font-nunito ${
                e.groupStatistics.type === 'borrowed' ? 'text-borrowColor' :
                e.groupStatistics.type === 'lent' ? 'text-lentColor' :
                e.groupStatistics.typw === 'No Expenses'?'text-gray-500':
                e.groupStatistics.type === 'Balanced' ? 'text-white' : 'text-white'
                }`}>
                      
                {e.groupStatistics.type === 'borrowed' ? `You owe ₹${e.groupStatistics.amount.toFixed(2)}` :
                  e.groupStatistics.type === 'lent' ? `You are owed ₹${e.groupStatistics.amount.toFixed(2)}` :
                  e.groupStatistics.type === 'No Expenses' ? 'No expenses' :
                  e.groupStatistics.type === 'Balanced' ? 'You are all settled up' : ''}

                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
        ))
        ) : (
          <p className="text-white">No groups available</p>
        )}
        </>
        ) : (
          <SplashScreen />
        )}
      </div>

    <Footer/>
    </div>
  );
};

export default Home;
