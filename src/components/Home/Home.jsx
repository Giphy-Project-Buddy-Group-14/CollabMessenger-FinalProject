import { useNavigate } from 'react-router-dom';
// import { useAuth } from "../../context/AuthContext";
import { useAuth } from '../../hooks/useAuth';

import Button from '../Ui/Button';
export default function Home() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const signUpHandler = () => {
    navigate('/signup');
  };
  const signInHandler = () => {
    navigate('/signin');
  };

  return (
    <div className="p-6">
      {!currentUser && (
        <div>
          <Button title="Sign Up" onClick={signUpHandler} />
          <br />
          <Button title="Sign In" onClick={signInHandler} />
        </div>
      )}

      {currentUser && <div></div>}
    </div>
  );
}
