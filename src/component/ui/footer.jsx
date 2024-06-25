import { UsersRound, UserRound, CircleUserRound } from 'lucide-react'
import { useNavigate,useLocation } from 'react-router-dom'
const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? 'text-highlightColor' : 'text-white';


    return (
    <div className="flex justify-around w-full border-t-2 border-white fixed bottom-0 bg-primaryColor p-2">
            <button className="flex flex-col justify-center items-center" onClick={() => navigate("/")}>
                <UsersRound className={`size-5 ${isActive('/')}`} />
                <span className={`flex justify-start text-base ${isActive('/')}`}>Groups</span>
            </button>

            <button className="flex flex-col justify-center items-center" onClick={() => navigate("/friends")}>
                <UserRound className={`size-5 ${isActive('/friends')}`} />
                <span className={`flex justify-start text-base ${isActive('/friends')}`}>Friends</span>
            </button>

            <button className="flex flex-col justify-center items-center" onClick={() => navigate("/accounts")}>
                <CircleUserRound className={`size-5 ${isActive('/accounts')}`} />
                <span className={`flex justify-start text-base ${isActive('/accounts')}`}>Account</span>
            </button>
    </div>
    )
}
export default Footer;