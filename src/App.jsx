import './App.css';
import SignUp from './components/SignUp/SignUp';
import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              exact
              element={<Home />}
            />
            <Route
              path="/signup"
              element={<SignUp />}
            />
            <Route
              path="/signin"
              element={<SignIn />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
