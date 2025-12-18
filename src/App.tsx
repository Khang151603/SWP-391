import './App.css';
import './styles/layout.css';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AppProvider>
      <AppRoutes />
      <ToastContainer />
    </AppProvider>
  );
}

export default App;
