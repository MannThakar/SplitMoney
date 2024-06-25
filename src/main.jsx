import ReactDOM from 'react-dom/client';
// import React from 'react';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './component/utils/auth.jsx';
import { GroupProvider } from './component/auth/groupcontext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <AuthProvider>
    <GroupProvider>
      <BrowserRouter>
        <App className='font-nunito'/>
      </BrowserRouter>
  </GroupProvider>
    </AuthProvider>
    //   </React.StrictMode> 
    
)
