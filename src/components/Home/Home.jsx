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
    <div className="p-12 gap-6 home-page flex-1 justify-center">
      <div className="flex w-1/2 p-6 flex-col gap-6 bg-white backdrop-blur-md bg-opacity-40 rounded-xl">
        <h2 className="text-gray-700 text-5xl font-black">CHATIFY</h2>
        <h2 className="text-gray-700 text-3xl font-semibold">
          Connect, Collaborate, Chatify: Your Ultimate Text Messenger for
          Seamless Friendships!
        </h2>

        <div>
          Introducing Chatify: the ultimate chat app. Real-time messaging,
          emoticons, private messages, and team collaboration. Connect and
          express yourself effortlessly. Join Chatify now!
          <div>
            {!currentUser && (
              <div className="flex gap-2 mt-6">
                <Button
                  title="Sign Up"
                  onClick={signUpHandler}
                  className="inline-block"
                />
                <Button
                  title="Sign In"
                  onClick={signInHandler}
                  className="inline-block"
                />
                <div className="flex-1"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
