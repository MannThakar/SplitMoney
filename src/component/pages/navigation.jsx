import { NavLink } from 'react-router-dom'

const Navigation = () => {
    const navLinkStyles = ({ isActive }) => {
        return {
            fontWeight: isActive ? "bold" : "normal",
            textDecoration: isActive ? "none" : "dashed",
            color: isActive ? "chocolate" : "black",
        };
    };
    return (
        <div className="nav">
            <NavLink style={navLinkStyles} to="/home">
            </NavLink>
            <NavLink style={navLinkStyles} to="/friends">
            </NavLink>
            <NavLink style={navLinkStyles} to="/accounts">
            </NavLink>
        </div>
    );
}

export default Navigation;
