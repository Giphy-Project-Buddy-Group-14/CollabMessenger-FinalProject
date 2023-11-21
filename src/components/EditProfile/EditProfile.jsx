import { useEffect, useState } from 'react';
import InputSection from '../Ui/InputSection';
import Button from '../Ui/Button';
import { getUserById } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../Ui/Loading';
// import { toast } from 'react-toastify';
// import { updateProfilePic } from '../../services/user.service';
import { updateUser } from '../../services/user.service';
export default function EditProfile() {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // const [picture, setPicture] = useState();

  const { user, userData } = useAuth();

  const usernameChangeHandler = (event) => {
    setUsername(event.target.value);
  };

  const phoneChangeHandler = (event) => {
    setPhone(event.target.value);
  };

  const firstNameChangeHandler = (event) => {
    setFirstName(event.target.value);
  };

  const lastNameChangeHandler = (event) => {
    setLastName(event.target.value);
  };

  const updateHandler = async (event) => {
    event.preventDefault();
    const content = { phone: phone, firstName: firstName, lastName: lastName };
    console.log('content -->', content);
    console.log('userData -->', userData);
    await updateUser(userData.username, content);
  };

  useEffect(() => {
    setLoading(true);

    if (user) {
      const fetchUser = async () => {
        const fetchedUser = await getUserById(user.uid);
        setPhone(fetchedUser.phone);
        setUsername(fetchedUser.username);
        setFirstName(fetchedUser.firstName);
        setLastName(fetchedUser.lastName);
      };
      fetchUser();
    }

    setLoading(false);
  }, [user]);

  // const handleFileChange = async (event) => {
  //   const file = event.target.files[0];
  //   try {
  //     const data = await updateProfilePic(file, userData.username);
  //     setPicture(data);
  //     toast.success('Successfully uploaded profile picture');
  //   } catch (error) {
  //     toast.error(error.message);
  //   }
  // };

  return (
    <>
      {loading && <LoadingIndicator />}
      {!loading && (
        <div>
          <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-gray-700 shadow-md sm:max-w-lg sm:rounded-lg">
            <form>
              <div className="mb-4">
                <div className="mb-4">
                  <InputSection
                    onChange={firstNameChangeHandler}
                    label="First Name"
                    type="text"
                    value={firstName}
                  />
                </div>
                <InputSection
                  onChange={lastNameChangeHandler}
                  label="Last Name"
                  type="text"
                  value={lastName}
                />
              </div>
              <div>
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

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  className="w-24 h-24 mb-3 rounded-full shadow-lg"
                  src="/src/assets/empty_profile_pic.webp"
                  alt="Profile image"
                />
                <Button
                  title="Edit image"
                  onClick={updateHandler}
                />
              </div>
              <Button
                title="Update"
                onClick={updateHandler}
              />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
