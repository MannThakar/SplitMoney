import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './component/utils/auth.jsx';
import { GroupProvider } from './component/auth/groupcontext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <GroupProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
  </GroupProvider>
    </AuthProvider>
)
