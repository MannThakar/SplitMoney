import SplitLogo from "../../icons/splitlogo";

const SplashScreen = () => {
    return (
        <div className="bg-black min-h-screen flex flex-col items-center justify-center px-4">
            <div className="flex flex-col items-center mb-8">
                <div className="bg-gray-900 p-4 rounded-full mb-4">
                    <SplitLogo />
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">splitMoney</h1>
                <p className="text-gray-400 text-center">
                    Effortlessly split expenses with friends
                </p>
            </div>
            <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-gray-600 animate-pulse mr-2"></div>
                <div className="h-2 w-2 rounded-full bg-gray-600 animate-pulse mr-2"></div>
                <div className="h-2 w-2 rounded-full bg-gray-600 animate-pulse"></div>
            </div>
        </div>
    );
};

export default SplashScreen;