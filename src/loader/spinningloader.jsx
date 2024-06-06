const SpinningLoader = () => {
    return (
        <div className="flex flex-col space-y-2 p-4">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-700 h-10 w-10"></div>
                <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpinningLoader;
