/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import "./App.css";
import Otp from "./component/pages/otp";
import SignIn from "./component/pages/signin";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import SignUp from "./component/pages/signup";
import Home from "./component/HeroSection/home";
import Friends from "./component/HeroSection/friends";
import Account from "./component/accounts/account";
import CreateGroup from "./component/groups/creategroup";
import PrivateRoute from "./component/auth/privateroute";
import GroupInfo from "./component/groups/groupinfo";
import AddExpense from "./component/expenses/addexpense";
import Settings from "./component/accounts/settings";
import InviteMember from "./component/groups/invitemember";
import PublicRoute from "./component/auth/publicroute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route>
          {/* Public Route */}
          <Route
            path="/otp"
            element={
              <PublicRoute>
                <Otp />
              </PublicRoute>
            }
          />
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          {/* <Route path="*" element={<PageNotFound />} /> */}
          <Route path='/group-invite/:token' element={<InviteMember />}></Route>

          {/* Private Route */}
          <Route element={<PrivateRoute />}>
            <Route path="*" element={<Navigate to="/" />}></Route>
            <Route path="/group">
              <Route path=":id" element={<GroupInfo />} />
              <Route path=":id/settings" element={<Settings />} />
              <Route path=":id/addexpense" element={<AddExpense />} />
            </Route>
            <Route path="/groupinfo/:id" element={<GroupInfo />} />
            <Route path="/creategroup" element={<CreateGroup />} />
            <Route path="/" element={<Home />}></Route>
            <Route path="/accounts" element={<Account />} />
            <Route path="/invite-member/:token" element={<InviteMember />}></Route>
            <Route path="/friends" element={<Friends />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}
export default App;
