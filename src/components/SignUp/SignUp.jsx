import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../services/auth.service';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../Ui/Button';
import InputSection from '../Ui/InputSection';
import { createUser } from '../../services/user.service';
export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const signUpHandler = async (event) => {
    event.preventDefault();

    try {
      const user = await signUp(email, password);
      await createUser(username, user.uid, email);
      toast.success('Sign up successful');
      navigate('/signin');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
        <div>
          <Link to="/">
            <h3 className="text-4xl font-bold text-gray-600">Sign Up </h3>
          </Link>
        </div>
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-gray-700 shadow-md sm:max-w-lg sm:rounded-lg">
          <form>
            <div className="mb-4">
              <InputSection
                onChange={emailChangeHandler}
                label="Email"
                type="email"
                placeholder="name@mail.com"
              />
            </div>
            <div className="mb-4">
              <InputSection
                onChange={passwordChangeHandler}
                label="Password"
                type="password"
              />
            </div>
            <div className="mb-4">
              <InputSection
                onChange={usernameChangeHandler}
                label="Username"
                type="text"
              />
            </div>

            <Button
              title="Sign Up"
              onClick={signUpHandler}
            />
          </form>
          <div className="flex items-center w-full my-4">
            <hr className="w-full" />
            <p className="px-3 ">OR</p>
            <hr className="w-full" />
          </div>
        </div>
      </div>
    </>
  );
}
