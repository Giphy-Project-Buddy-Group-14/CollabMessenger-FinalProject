import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function Home() {
  const navigate = useNavigate();

  const { isAuthenticated, user } = useAuth();
  console.log('user -> ', user);
  console.log('isAuthenticated --> ', isAuthenticated);

  const signUpHandler = () => {
    navigate('/signup');
  };
  const signInHandler = () => {
    navigate('/signin');
  };
  return (
    <>
      <div>
        <h1>Home</h1>
        {isAuthenticated && (
          <h1>User email: {user.email}</h1>
        )}
        <button
          className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
          onClick={signUpHandler}
        >
          Sign Up
        </button>
      </div>

      <div>
        <br />
        <button
          className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
          onClick={signInHandler}
        >
          Sign In
        </button>
      </div>
    </>
  );
}
