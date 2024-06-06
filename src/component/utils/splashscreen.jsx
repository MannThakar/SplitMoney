import SplitLogo from "../../icons/splitlogo";

const SplashScreen = () => {
    return (
        <>
            <div className='grow h-14'></div>
            <div className="bg-black flex flex-col items-center justify-center px-4 md:flex md:flex-col md:justify-center md:items-center">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-gray-900 p-4 rounded-full mb-4">
                        <SplitLogo />
                    </div>
                    <h1 className="text-4xl font-bold font-nunito text-white mb-2">SplitMoney</h1>
                    <p className="text-gray-400 font-nunito text-center">
                        Effortlessly split expenses with friends
                    </p>
                </div>
                <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-gray-600 animate-pulse mr-2"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-600 animate-pulse mr-2"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-600 animate-pulse"></div>
                </div>
            </div>
        </>
    );
};

export default SplashScreen;