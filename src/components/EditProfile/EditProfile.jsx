import { useEffect, useState } from 'react';
import InputSection from '../Ui/InputSection';
import Button from '../Ui/Button';
import { getUserById } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';
import LoadingIndicator from '../Ui/Loading';
import { toast } from 'react-toastify';
import { updateProfilePic } from '../../services/user.service';
import { updateUser } from '../../services/user.service';
import Avatar from '../Avatar/Avatar';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isPictureReady, setIsPictureReady] = useState(false);

  const navigate = useNavigate()

  const [uploadedPictureUrl, setUploadedPictureUrl] = useState(
    '/src/assets/empty_profile_pic.webp'
  );

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

    setLoading(true);

    try {
      const content = {
        phone: phone,
        firstName: firstName,
        lastName: lastName,
      };
      await updateUser(userData.username, content);
      toast.success('Successfully updated profile!');
      navigate('/profile');
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }

    // setIsPictureReady(false);
    setLoading(false);
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
        setUploadedPictureUrl(fetchedUser.profilePictureURL);
      };
      fetchUser();
    }

    setLoading(false);
  }, []);

  const updateImageHandler = async (event) => {
    setIsPictureReady(true);

    event.preventDefault();
    const file = event.target.files[0];

    try {
      const pictureUrl = await updateProfilePic(file, userData);
      setUploadedPictureUrl(pictureUrl);
      toast.success('Successfully uploaded profile picture!');
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }

    setIsPictureReady(false);
  };

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
                <Avatar
                  src={uploadedPictureUrl}
                  isLoading={isPictureReady}
                />
                <div className="flex flex-col items-start">
                  <input
                    type="file"
                    id="fileInput"
                    onChange={updateImageHandler}
                  />
                </div>
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
