/* eslint-disable no-unused-vars */
// /*Pagination API code */
 /* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UsersRound, UserRound, CircleUserRound } from 'lucide-react';
import axios from 'axios';
import Footer from '../ui/footer';

const Friends = () => {
    const [group, setGroup] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [totalFriends, setTotalFriends] = useState(null);
    const navigate = useNavigate();
    const observer = useRef();

    const getGroupApi = async (page, limit) => {
        setLoading(true); // Set loading to true before making the API call
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/users`, {
                params: {
                    page,
                    limit,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("Token")}`,
                },
            });
            setTotalFriends(res.data.total);
            setGroup(prev => [...prev, ...res.data.data]);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false); // Set loading to false after the API call completes
        }
    };

    useEffect(() => {
        getGroupApi(currentPage, perPage);
    }, [currentPage, perPage]);

    useEffect(() => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && currentPage < totalPages && !loading) {
                setCurrentPage(prev => prev + 1);
            }
        });

        const trigger = document.querySelector('#infinite-scroll-trigger');
        if (trigger) observer.current.observe(trigger);

        return () => observer.current.disconnect();
    }, [totalPages, loading, currentPage]);

    const renderSkeletons = () => {
        return (
            <div className='grid grid-cols-1 gap-4'>
                {[...Array(perPage)].map((_, index) => (
                    <div key={index} className='p-2 flex flex-col gap-2 bg-stone-700 bg-opacity-30 border border-white border-opacity-20 backdrop-blur-lg shadow-lg rounded-lg animate-pulse'>
                        <div className='flex gap-2'>
                            <User className='text-white' />
                            <h3 className='text-white text-xl font-semibold'>Loading...</h3>
                        </div>
                        <div className='flex gap-2'>
                            <Mail className='text-white' />
                            <p className='text-white text-sm font-nunito'>Loading...</p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className='bg-primaryColor min-h-screen relative'>
            <div className="py-3 px-2 flex justify-between gap-2 fixed w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20 z-10">
                <div className='flex gap-2'>
                    <button  onClick={() => navigate(-1)}>
                        <ArrowLeft className="text-white" />
                    </button>
                    <h2 className="text-white text-lg font-nunito">Friends List</h2>
                </div>
                    <div className='flex justify-end items-center'>
                        <span className='text-white font-nunito'>Total Friends: </span><span className='text-textColor font-nunito'>{totalFriends}</span>
                    </div>
            </div>

            <div className='p-4 py-24'> {/* Add some padding to the top */}
                {/* <div className='flex fixed w-full right-1 justify-end top-[5px] bg-white bg-opacity-10 backdrop-filter border border-white border-opacity-20 z-10 px-5'>
                    <h3 className='text-white text-sm  font-nunito bg-opacity-10 backdrop-filter backdrop-blur-lg border-opacity-20 z-10 px-2'>Total Friends: <span className='text-textColor'>{totalFriends}</span></h3>
                </div> */}
                <div> {/* Ensure content is below the fixed elements */}
                    {group.length > 0 ? (
                        <div className='grid grid-cols-1 gap-4'>
                            {group.map((item, index) => (
                                <div key={index} className='p-2 flex flex-col gap-2 bg-stone-700 bg-opacity-30 border border-white border-opacity-20 backdrop-blur-lg shadow-lg rounded-lg '>
                                    <div className='flex gap-2'>
                                        <User className='text-white' />
                                        <h3 className='text-white text-xl font-semibold'>{item.name}</h3>
                                    </div>
                                    <div className='flex gap-2'>
                                        <Mail className='text-white' />
                                        <p className='text-white text-sm font-nunito'>{item.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        renderSkeletons()
                    )}
                    <div id="infinite-scroll-trigger" className="h-1"></div>
                </div>
                {loading && renderSkeletons()}
            </div>

        <Footer/>
        </div>
    );
}

export default Friends;






// /*Without paingation API code */
// import { useEffect, useState, useRef, useCallback } from 'react';
// import { ArrowLeft, User, Mail } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { UsersRound, UserRound, CircleUserRound } from 'lucide-react';
// import axios from 'axios';
// import SpinningLoader from '../../loader/spinningloader';
// import SplashScreen from '../utils/splashscreen';

// const Friends = () => {
//     const [group, setGroup] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [hasMore, setHasMore] = useState(true);
//     const observer = useRef();

//     const navigate = useNavigate();
//     const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';

//     const getGroupApi = async () => {
//         if (loading || !hasMore) return;

//         setLoading(true);
//         try {
//             const res = await axios.get(`${import.meta.env.VITE_API}/users`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
//             });
//             if (res.data.length === 0) {
//                 setHasMore(false);
//             } else {
//                 setGroup(prev => [...prev, ...res.data]);
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getGroupApi();
//     }, []);

//     const lastGroupElementRef = useCallback((node) => {
//         if (loading) return;
//         if (observer.current) observer.current.disconnect();
//         observer.current = new IntersectionObserver(entries => {
//             if (entries[0].isIntersecting && hasMore) {
//                 getGroupApi();
//             }
//         });
//         if (node) observer.current.observe(node);
//     }, [loading, hasMore]);

//     return (
//         <div className='bg-primaryColor min-h-screen'>
//             <div className="py-3 px-2 flex gap-2 fixed w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
//                 <button className='flex gap-2'>
//                     <ArrowLeft className="text-white" onClick={() => navigate(-1)} />
//                     <h2 className="text-white text-lg font-nunito">Friends List</h2>
//                 </button>
//             </div>

//             <div className='p-4 pt-14'>
//                 <div className='flex justify-end'>
//                     <h3 className='text-white text-sm font-nunito'>Total Friends: <span className='text-textColor'>{group.length}</span></h3>
//                 </div>
//                 {group.length > 0 ? (
//                     <div className='grid grid-cols-1 gap-4'>
//                         {group.map((item, index) => (
//                             <div key={index} className='bg-stone-800 p-4 flex flex-col gap-2 rounded-md shadow-md'>
//                                 <div className='flex gap-2'>
//                                     <User className='text-white' />
//                                     <h3 className='text-white text-xl font-semibold'>{item.name}</h3>
//                                 </div>
//                                 <div className='flex gap-2'>
//                                     <Mail className='text-white' />
//                                     <p className='text-white text-sm font-nunito'>{item.email}</p>
//                                 </div>
//                             </div>
//                         ))}
//                         <div ref={lastGroupElementRef} className='flex justify-center items-center'>
//                             {loading && <SpinningLoader />}
//                         </div>
//                     </div>
//                 ) : (
//                     <SplashScreen />
//                 )}
//             </div>

//             <div className="flex justify-around w-full fixed bottom-0 bg-primaryColor p-2">
//                 <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
//                     <UsersRound className={`size-5 ${isActive('/')}`} />
//                     <span className={`flex justify-start text-base font-nunito ${isActive('/')}`}>Groups</span>
//                 </button>

//                 <button className="flex flex-col justify-center items-center" onClick={() => navigate("/friends")}>
//                     <UserRound className={`size-5 ${isActive('/friends')}`} />
//                     <span className={`flex justify-start text-base font-nunito ${isActive('/friends')}`}>Friends</span>
//                 </button>

//                 <button className="flex flex-col justify-center items-center" onClick={() => navigate("/accounts")}>
//                     <CircleUserRound className={`size-5 ${isActive('/accounts')}`} />
//                     <span className={`flex justify-start text-base font-nunito ${isActive('/accounts')}`}>Account</span>
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Friends;
