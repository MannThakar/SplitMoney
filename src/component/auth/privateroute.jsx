
import { Outlet, Navigate } from 'react-router-dom'


const PrivateRoute = () => {
    const tok = localStorage.getItem('Token');
    return (
        tok ? <Outlet /> : <Navigate to="/signup" />
    )
}

export default PrivateRoute

