import { useState } from "react";
import { signIn } from "../../services/auth.service";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Button from "../Ui/Button";
import InputSection from "../Ui/InputSection";

export default function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  // const { login } = useAuth();

  const signInHandler = async (event) => {
    event.preventDefault();

    try {
      await signIn(email, password);
      // login(user);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      console.error(error.message);
      toast.error("Authentication failed");
    }
  };

  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-gray-50">
        <div>
          <Link to="/">
            <h3 className="text-4xl font-bold text-gray-600">Sign In</h3>
          </Link>
        </div>
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-gray-700 shadow-md sm:max-w-lg sm:rounded-lg">
          <form>
            <div className="mt-4">
              <InputSection
                onChange={emailChangeHandler}
                label="Email"
                type="email"
                placeholder="name@mail.com"
              />
            </div>
            <div className="mt-4">
              <InputSection
                onChange={passwordChangeHandler}
                label="Password"
                type="password"
              />
            </div>
            <Link
              to="#"
              className="text-xs text-gray-50 hover:underline"
            >
              Forget Password?
            </Link>
            <div className="flex items-center mt-4">
              <Button
                title="Sign In"
                onClick={signInHandler}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
