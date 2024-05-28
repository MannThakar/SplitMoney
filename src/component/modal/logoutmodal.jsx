/* eslint-disable react/prop-types */

const LogoutModal = ({ onLogout, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-md">
                <h2 className="text-xl font-bold mb-4">Logout Confirmation</h2>
                <p className="mb-6">Are you sure you want to log out?</p>
                <div className="flex justify-around">
                    <button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                    <button
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;