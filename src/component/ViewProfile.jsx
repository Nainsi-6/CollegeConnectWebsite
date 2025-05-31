const ViewProfile = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-gray-900 p-6 rounded-lg w-96 shadow-lg">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={onClose}>✖</button>
        <div className="flex flex-col items-center">
          <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full border-4 border-blue-500" />
          <h2 className="text-2xl text-white font-bold mt-3">{user.name}</h2>
          <p className="text-gray-400">{user.role} | {user.batch || user.facultyId}</p>

          {/* Skills */}
          <div className="mt-4">
            <h3 className="text-blue-400 font-semibold">Skills</h3>
            <div className="flex flex-wrap justify-center mt-2">
              {user.skills.map((skill, index) => (
                <span key={index} className="m-1 px-3 py-1 bg-gray-800 text-sm rounded-lg">{skill}</span>
              ))}
            </div>
          </div>

          {/* LinkedIn Profile */}
          {user.linkedin && (
            <a
              href={user.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              View LinkedIn
            </a>
          )}

          {/* Follow/Unfollow Button */}
          <button
            className={`mt-4 px-4 py-2 rounded-md text-white ${
              user.isFollowing ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            }`}
            onClick={() => alert(user.isFollowing ? "Unfollowed" : "Followed")}
          >
            {user.isFollowing ? "Unfollow" : "Follow"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;

