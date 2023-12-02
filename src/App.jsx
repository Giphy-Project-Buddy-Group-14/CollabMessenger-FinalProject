import './App.css';
import SignUp from './components/SignUp/Signup';
import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile/Profile';
import EditProfile from './components/EditProfile/EditProfile';
import RouteOutlet from './components/RouteOutlet/RouteOutlet';
import Users from './components/Users/Users';
import AuthenticatedRoute from './components/hoc/AuthenticatedRoute';
import Chat from './components/Chat/Chat';
import Teams from './components/Teams/Teams';
import NewTeam from './components/NewTeam/NewTeam';
import PrivateMessages from './components/Chat/PrivateMessages/PrivateMessages';

function App() {
  return (
    <div className="flex h-screen">
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
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
            <Route exact path="/" element={<Sidebar />}>
              <Route index element={<Home />} />
              <Route path="users" element={<Users />} />
              <Route path="teams" element={<Teams />} />
              <Route path="chat" element={<Chat />} />
              <Route path="private-messages" element={<PrivateMessages />} />
              <Route path="profile" element={<RouteOutlet />}>
                <Route
                  index
                  element={
                    <AuthenticatedRoute>
                      <Profile />
                    </AuthenticatedRoute>
                  }
                />
                <Route
                  path="edit"
                  element={
                    <AuthenticatedRoute>
                      <EditProfile />
                    </AuthenticatedRoute>
                  }
                />
              </Route>
              <Route path="signup" element={<SignUp />} />
              <Route path="signin" element={<SignIn />} />
              <Route path="new-team" element={<NewTeam />} />
              <Route path="teams/:teamId" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
