import "./App.css";
import Otp from "./component/pages/otp";
import SignIn from "./component/pages/signin";
import { Routes, Route, Navigate } from "react-router-dom";
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
import PageNotFound from "./component/pages/pagenotfound";
import GroupInvite from "./component/groups/invitemember";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchGroup from "./component/groups/searchgroup";
import GroupExpense from "./component/groups/groupexpense";
import AdjustAmount from "./component/expenses/adjustamount";
import Paying from "./component/expenses/paying";
import { GroupProvider } from "../src/component/auth/groupcontext";
import ExpenseDetails from "../src/component/expenses/expense-details";
import GroupExpenseUpdate from "../src/component/modal/groupexpenseupdate";
import UpdateAmount from "../src/component/expenses/update-amount";
import SettleBalance from "../src/component/expenses/settle-balance";
import RecordPayment from "../src/component/expenses/record-payment";
import UpdatePaying from "../src/component/expenses/updatepaying";
import Settlement from "../src/component/expenses/settlement";
  
function App() {
  return (
    <>
      <GroupProvider>
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
            <Route path="/*" element={<PageNotFound />} />
            <Route path='/group-invite/:token' element={<InviteMember />}></Route>
            <Route path='/group-invite' element={<GroupInvite />}></Route>
            {/* Private Route */}
            <Route element={<PrivateRoute />}>
              <Route path="*" element={<Navigate to="/" />}></Route>
              <Route path="/group">
                <Route path=":id" element={<GroupInfo />} />
                <Route path=":id/expense/" element={<GroupExpense />} />
                <Route path=":id/expense/settlebalance" element={<SettleBalance />} />
                <Route path=":id/expense/settlebalance/recordpayment" element={<RecordPayment/> } />
                <Route path=":id/expense/:expenseid/" element={<ExpenseDetails />} /> {/* Updated route */}
                <Route path=":id/expense/:expenseId/edit" element={<GroupExpenseUpdate />} />
                <Route path=":id/expense/:expenseId/edit/type" element={<UpdateAmount />} />
                <Route path=":id/expense/:expenseId/expensedetails/updatepayer" element={ <UpdatePaying/>} />
                <Route path=":id/settlement" element={<Settlement/> } />

                {/* <Route path=":id/expense/" /> */}
                <Route path=":id/settings" element={<Settings />} />
                <Route path=":id/addexpense" element={<AddExpense />}></Route>
                <Route path=":id/addexpense/adjustamount" element={<AdjustAmount />}/>
                <Route path=":id/settings/addpeople" element={<SearchGroup />}/>
                <Route path=":id/addexpense/paying" element={<Paying />} />
              </Route>
              {/* <Route path="/groupinfo/:id" element={<GroupInfo />} /> */}
              <Route path="/creategroup" element={<CreateGroup />} />
              <Route path="/accounts" element={<Account />} />
              <Route path="/invite-member/:token" element={<InviteMember />}></Route>
              <Route path="/" element={<Home />}></Route>
              <Route path="/friends" element={<Friends />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </GroupProvider>
    </>
  );
}
export default App;