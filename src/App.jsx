import './App.css';
import SignUp from './components/SignUp/Signup';
import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/SideBar/SideBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChatSection from './components/Ui/ChatSection';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              exact
              path="/"
              element={<Sidebar />}
            >
              <Route
                index
                element={<Home />}
              />
              <Route
                path="chat"
                element={<ChatSection />}
              />
              <Route
                path="signup"
                element={<SignUp />}
              />
              <Route
                path="signin"
                element={<SignIn />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
