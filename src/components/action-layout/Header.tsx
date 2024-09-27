export const Header = () => (
  <div className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
    <h1 className="text-lg font-bold">LeetCode Clone</h1>
    <div className="space-x-4">
      <button className="bg-green-600 px-4 py-2 rounded hover:bg-green-500">
        Run
      </button>
      <button className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
        Submit
      </button>
    </div>
  </div>
);
