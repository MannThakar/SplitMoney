/* eslint-disable react/prop-types */

const LogoutModal = ({ onLogout, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-stone-800 text-white p-6 rounded-lg shadow-md max-w-md">
                <h2 className="text-xl font-bold font-nunito mb-4">Logout Confirmation</h2>
                <p className="mb-6 text-sm font-nunito">Are you sure you want to log out?</p>
                <div className="flex justify-between">
                    <button
                        className="bg-white font-nunito text-black hover:opacity-80 font-bold px-4 py-2 rounded"
                        onClick={onLogout}
                    >
                        Logout
                    </button>
                    <button
                        className="bg-stone-400 font-nunito hover:opacity-80 text-black font-bold px-4 py-2 rounded"
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