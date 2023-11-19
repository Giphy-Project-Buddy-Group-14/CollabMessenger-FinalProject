import PropTypes from 'prop-types';

export default function InputSection({ onChange, title, type, placeholder }) {
  return (
    <>
      <div className="mt-4">
        <label
          htmlFor={type}
          className="block text-sm font-medium text-gray-50 undefined"
        >
          {title}
        </label>
        <div className="flex flex-col items-start">
          <input
            type={type}
            name={type}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={placeholder}
            required
            onChange={onChange}
          />
        </div>
      </div>
    </>
  );
}

InputSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};
