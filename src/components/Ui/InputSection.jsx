import PropTypes from 'prop-types';

export default function InputSection({
  onChange,
  type,
  placeholder,
  value,
  label,
}) {
  const randomId = Math.random();

  return (
    <>
      <div className="mt-4">
        {label && (
          <label
            htmlFor={randomId}
            className="block text-sm font-medium text-gray-50 mb-2"
          >
            {label}
          </label>
        )}
        <div className="flex flex-col items-start">
          <input
            id={randomId}
            type={type}
            name={type}
            className=" text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-4 dark:bg-gray-50 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={placeholder}
            required
            onChange={onChange}
            value={value}
          />
        </div>
      </div>
    </>
  );
}

InputSection.propTypes = {
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  label: PropTypes.string,
};
