import PropTypes from 'prop-types';
import LoadingIndicator from '../Ui/LoadingIndicator';

export default function Avatar({ src, isLoading, alt }) {
  return (
    <>
      {isLoading && <LoadingIndicator />}
      {!isLoading && (
        <img
          className="w-24 h-24 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
          src={src}
          alt={alt}
        />
      )}
    </>
  );
}
Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  alt: PropTypes.string,
};
