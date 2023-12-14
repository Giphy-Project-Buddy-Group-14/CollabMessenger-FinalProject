import { useEffect, useState } from 'react';
import InputSection from '../Ui/InputSection';
import Button from '../Ui/Button';
import LoadingIndicator from '../Ui/LoadingIndicator';
import { toast } from 'react-toastify';
import { updateUserProfilePic } from '../../services/user.service';
import { updateUserProfile } from '../../services/user.service';
import { useNavigate } from 'react-router-dom';
import ImageWithLoading from '../helper/ImageWithLoading';
import { useUserProfile } from '../../hooks/useUserProfile';
import { USER_PROFILE_PATH } from '../../common/routes';

export default function EditProfile() {
  const {
    uid,
    phone,
    profilePictureURL,
    username,
    firstName,
    lastName,
    userProfile,
    profileLoading,
  } = useUserProfile();

  const [editedPhone, setEditedPhone] = useState('');
  const [editedFirstName, setEditedFirstName] = useState('');
  const [editedLastName, setEditedLastName] = useState('');

  const navigate = useNavigate();

  const phoneChangeHandler = (event) => {
    setEditedPhone(event.target.value);
  };

  const firstNameChangeHandler = (event) => {
    setEditedFirstName(event.target.value);
  };

  const lastNameChangeHandler = (event) => {
    setEditedLastName(event.target.value);
  };

  const updateHandler = async () => {
    try {
      const userData = {
        firstName: editedFirstName,
        lastName: editedLastName,
        phone: editedPhone,
      };
      await updateUserProfile(uid, userData);
      toast.success('Successfully updated profile');
      navigate(USER_PROFILE_PATH(userProfile.username));
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!userProfile) return;

    setEditedPhone(phone);
    setEditedFirstName(firstName);
    setEditedLastName(lastName);
  }, [firstName, lastName, phone, profileLoading, userProfile, username]);

  const updateImageHandler = async (event) => {
    event.preventDefault();

    // setIsPictureReady(true);
    const file = event.target.files[0];

    try {
      await updateUserProfilePic(file, userProfile);
      toast.success('Successfully uploaded profile picture!');
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }

    // setIsPictureReady(false);
  };

  return (
    <>
      {profileLoading && <LoadingIndicator />}
      {!profileLoading && (
        <div className="w-full flex-1 px-6 py-4 overflow-hidden bg-gray-700">
          <form className="w-1/3">
            <div className="mb-6">
              <ImageWithLoading
                key={profilePictureURL}
                className="rounded-full shadow-lg"
                src={profilePictureURL}
                width="8rem"
                height="8rem"
              />
              <div className="flex flex-col items-start">
                <input
                  type="file"
                  id="fileInput"
                  onChange={updateImageHandler}
                  className="rounded-full bg-slate-50 mt-4"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="mb-4">
                <InputSection
                  onChange={firstNameChangeHandler}
                  label="First Name"
                  type="text"
                  value={editedFirstName}
                />
              </div>
              <InputSection
                onChange={lastNameChangeHandler}
                label="Last Name"
                type="text"
                value={editedLastName}
              />
            </div>
            <div className="mb-4">
              <InputSection
                onChange={phoneChangeHandler}
                label="Phone"
                type="text"
                value={editedPhone}
              />
            </div>

            <Button title="Update" onClick={updateHandler} />
          </form>
        </div>
      )}
    </>
  );
}
