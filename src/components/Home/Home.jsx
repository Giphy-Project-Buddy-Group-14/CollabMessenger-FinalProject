import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

import Button from '../Ui/Button';
import { SIGNIN_PATH, SIGNUP_PATH } from '../../common/routes';
export default function Home() {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const signUpHandler = () => {
    navigate(SIGNUP_PATH);
  };
  const signInHandler = () => {
    navigate(SIGNIN_PATH);
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
