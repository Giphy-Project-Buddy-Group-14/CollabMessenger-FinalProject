import './App.css';
import NewSignUp from './components/SignUp/NewSignUp';
import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import { AuthProvider } from './context/AuthContext';
import SidebarContainer from './components/Sidebar/SidebarContainer/SidebarContainer';

import Sidebar from './components/SideBar/SideBar';
function App() {
  return (
    <>
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
                path="signup"
                element={<NewSignUp />}
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
