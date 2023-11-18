export default function Button({title, onClick}) {
  return (
    <div>
      <button
        className="w-full h-full py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
        onClick={onClick}
      >
        {title}
      </button>
    </div>
  );
}
