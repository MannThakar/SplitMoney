/*Pagination API code */
// /* eslint-disable no-unused-vars */
// import { useEffect, useState } from 'react';
// import { ArrowLeft, User, Mail } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { UsersRound, UserRound, CircleUserRound } from 'lucide-react';
// import axios from 'axios';
// import SpinningLoader from '../../loader/spinningloader';
// import SplashScreen from '../utils/splashscreen';

// const Friends = () => {
//     const [group, setGroup] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [perPage, setPerPage] = useState(4);
//     const [prevPageUrl, setPrevPageUrl] = useState(null);
//     const [nextPageUrl, setNextPageUrl] = useState(null);
//     const [totalFriends,setTotalFriends] = useState(null);

//     const navigate = useNavigate();

//     const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';

//     const getGroupApi = async (page, limit) => {
//         try {
//             const res = await axios.get(`${import.meta.env.VITE_API}/users`, {
//                 params: {
//                     page,
//                     limit,
//                 },
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("Token")}`,
//                 },
//             });
//             setTotalFriends(res.data.total);
//             setGroup(res.data.data);
//             setTotalPages(res.data.last_page);
//             setPrevPageUrl(res.data.prev_page_url);
//             setNextPageUrl(res.data.next_page_url);
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     useEffect(() => {
//         getGroupApi(currentPage, perPage);
//         setTimeout(() => setLoading(false), 3000);
//     }, [currentPage, perPage]);

//     const handlePageChange = (newPage) => {
//         if (newPage > 0 && newPage <= totalPages) {
//             setCurrentPage(newPage);
//         }
//     };

//     return (
//         <div className='bg-primaryColor min-h-screen relative'>
//             <div className="py-3 px-2 flex gap-2 fixed w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
//                 <button className='flex gap-2' onClick={() => navigate(-1)}>
//                     <ArrowLeft className="text-white" />
//                     <h2 className="text-white text-lg font-nunito">Friends List</h2>
//                 </button>
//             </div>

//             <div className='p-4 pt-14'>
//                 <div className='flex justify-end'>
//                     <h3 className='text-white text-sm font-nunito'>Total Friends: <span className='text-textColor'>{totalFriends}</span></h3>
//                     {/* {group.length || 0} */}
//                 </div>
//                 {group.length > 0 ? (
//                     <div>
//                         <div className='grid grid-cols-1 gap-4'>
//                             {group.map((item, index) => (
//                                 <div key={index} className='p-2 flex flex-col gap-2 bg-stone-700 bg-opacity-30 border border-white border-opacity-20 backdrop-blur-lg shadow-lg rounded-lg '>
//                                     <div className='flex gap-2'>
//                                         <User className='text-white' />
//                                         <h3 className='text-white text-xl font-semibold'>{item.name}</h3>
//                                     </div>
//                                     <div className='flex gap-2'>
//                                         <Mail className='text-white' />
//                                         <p className='text-white text-sm font-nunito'>{item.email}</p>
//                                     </div>
//                                 </div>
//                             ))}
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

//             <div className="fixed bottom-24 right-4 flex gap-4">
//                 <button
//                     className='bg-stone-800 p-2 rounded-md text-white disabled:opacity-50'
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={!prevPageUrl}>
//                     Previous
//                 </button>
//                 <span className='text-white flex items-center'>
//                     Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                     className='bg-stone-800 p-2 rounded-md text-white disabled:opacity-50'
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={!nextPageUrl}>
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default Friends;



/*Without paingation API code */
import { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UsersRound, UserRound, CircleUserRound } from 'lucide-react';
import axios from 'axios';
import SpinningLoader from '../../loader/spinningloader';
import SplashScreen from '../utils/splashscreen';

const Friends = () => {
    const [group, setGroup] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const observer = useRef();

    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';

    const getGroupApi = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API}/users`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("Token")}` },
            });
            if (res.data.length === 0) {
                setHasMore(false);
            } else {
                setGroup(prev => [...prev, ...res.data]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getGroupApi();
    }, []);

    const lastGroupElementRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                getGroupApi();
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    return (
        <div className='bg-primaryColor min-h-screen'>
            <div className="py-3 px-2 flex gap-2 fixed w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white border-opacity-20">
                <button className='flex gap-2'>
                    <ArrowLeft className="text-white" onClick={() => navigate(-1)} />
                    <h2 className="text-white text-lg font-nunito">Friends List</h2>
                </button>
            </div>

            <div className='p-4 pt-14'>
                <div className='flex justify-end'>
                    <h3 className='text-white text-sm font-nunito'>Total Friends: <span className='text-textColor'>{group.length}</span></h3>
                </div>
                {group.length > 0 ? (
                    <div className='grid grid-cols-1 gap-4'>
                        {group.map((item, index) => (
                            <div key={index} className='bg-stone-800 p-4 flex flex-col gap-2 rounded-md shadow-md'>
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
                        <div ref={lastGroupElementRef} className='flex justify-center items-center'>
                            {loading && <SpinningLoader />}
                        </div>
                    </div>
                ) : (
                    <SplashScreen />
                )}
            </div>

            <div className="flex justify-around w-full fixed bottom-0 bg-primaryColor p-2">
                <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
                    <UsersRound className={`size-5 ${isActive('/')}`} />
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

export default Friends;
