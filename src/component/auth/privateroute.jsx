
import { Outlet, Navigate } from 'react-router-dom'
const PrivateRoute = () => {
    const token = localStorage.getItem('Token');
    return (
        //check the token if available then it move to the Outlet means "/" <- Home then /group screen or navigate to signup 
        token ? <Outlet /> : <Navigate to="/signin" />
    )
}

export default PrivateRoute

