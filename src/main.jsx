import ReactDOM from 'react-dom/client';
// import React from 'react';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './component/utils/auth.jsx';
import { GroupProvider } from './component/auth/groupcontext.jsx';
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import store from "./store/store";
import { Provider } from 'react-redux'



const persistor = persistStore(store);



ReactDOM.createRoot(document.getElementById('root')).render(
  
  <AuthProvider>
    <GroupProvider>
      <BrowserRouter >
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <App className='font-nunito' />
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </GroupProvider>
  </AuthProvider>

)
