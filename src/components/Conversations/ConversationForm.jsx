import { PropTypes } from 'prop-types';
import { useState, useEffect, useRef } from 'react';

export default function ConversationForm({ onSubmit }) {
  const [text, setText] = useState('');

  const inputRef = useRef(null);

  const submitHandler = async (event) => {
    event.preventDefault();

    onSubmit(text);
    setText('');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const icons = [
    '😂',
    '😄',
    '😃',
    '😀',
    '😊',
    '😉',
    '😍',
    '😘',
    '😚',
    '😗',
    '😙',
    '😜',
  ];
  const [isIconsOpen, setIsIconsOpen] = useState(false);

  return (
    <>
      <div className="rounded-2xl h-full p-6">
        <form onSubmit={submitHandler}>
          <label htmlFor="chat" className="sr-only">
            Your message
          </label>
          <div className="flex items-center px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
            <div>
              <div className="relative">
                {isIconsOpen && (
                  <div className="absolute bottom-6 left-0 bg-slate-50 rounded-lg shadow-xl flex flex-auto rid-cols-10">
                    {icons.map((icon, index) => {
                      return (
                        <div
                          className="cursor-pointer p-2 px-3 rounded-full hover:bg-slate-100 inline-block"
                          key={'icon-' + index}
                          onClick={() => {
                            setText(text + icon);
                            setIsIconsOpen(false);
                          }}
                        >
                          {icon}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setIsIconsOpen(!isIconsOpen);
              }}
              type="button"
              className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
            >
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1"
                  d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
                />
              </svg>
            </button>
            <input
              id="chat"
              rows="1"
              className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your message..."
              onChange={(e) => setText(e.target.value)}
              value={text}
              ref={inputRef}
            />
            <button
              type="submit"
              className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
            >
              <svg
                className="w-5 h-5 rotate-90 rtl:-rotate-90"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 18 20"
              >
                <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
              </svg>
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

ConversationForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  onSubmit: PropTypes.func.isRequired,
};
