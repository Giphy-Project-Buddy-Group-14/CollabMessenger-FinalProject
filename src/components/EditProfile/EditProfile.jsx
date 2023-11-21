import { useEffect, useState } from 'react';
import InputSection from '../Ui/InputSection';
import Button from '../Ui/Button';
import { getUserById } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../Ui/Loading';

export default function EditProfile() {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const phoneChangeHandler = (event) => {
    setPhone(event.target.value);
  };

  const saveHandler = (event) => {
    event.preventdefault();
  };

  useEffect(() => {
    setLoading(true);

    if (user) {
      const fetchUser = async () => {
        const fetchedUser = await getUserById(user.uid);
        setPhone(fetchedUser.phone);
        setUsername(fetchedUser.username);
      };
      fetchUser();
    }

    setLoading(false);
  }, [user]);

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && (
        <div>
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-gray-700 shadow-md sm:max-w-lg sm:rounded-lg">
            <form>
              <div className="mb-4">
                <InputSection
                  onChange={usernameChangeHandler}
                  label="Username"
                  type="text"
                  value={username}
                />
              </div>
              <div className="mb-4">
                <InputSection
                  onChange={phoneChangeHandler}
                  label="Phone"
                  type="text"
                  value={phone}
                />
              </div>

              <Button
                title="Save"
                onClick={saveHandler}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
