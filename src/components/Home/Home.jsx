import { useNavigate } from 'react-router-dom';
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from '../../hooks/useAuth';

import Button from '../Ui/Button';
export default function Home() {
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();

  const signUpHandler = () => {
    navigate('/signup');
  };
  const signInHandler = () => {
    navigate('/signin');
  };
  const signOutHandler = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <h1>Home</h1>
      {!currentUser && (
        <div>
          <Button title="Sign Up" onClick={signUpHandler} />
          <br />
          <Button title="Sign In" onClick={signInHandler} />
        </div>
      )}

      {currentUser && (
        <div>
          <h1>Logged In</h1>
          <Button title="Sign Out" onClick={signOutHandler} />
        </div>
      )}
    </>
  );
}
