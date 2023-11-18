import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../Ui/Button';
import Sidebar from '../SideBar/SideBar';
export default function Home() {
  const navigate = useNavigate();

  const { isAuthenticated, user, logout } = useAuth();
  console.log('user -> ', user);
  console.log('isAuthenticated --> ', isAuthenticated);

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
      {/* <Sidebar /> */}
      {!isAuthenticated && (
        <div>
          <Button
            title="Sign Up"
            onClick={signUpHandler}
          />
          <br />

          <Button
            title="Sign In"
            onClick={signInHandler}
          />
        </div>
      )}

      {isAuthenticated && (
        <div>
          <h1>Logged In</h1>
          <Button
            title="Sign Out"
            onClick={signOutHandler}
          />
        </div>
      )}
    </>
  );
}
