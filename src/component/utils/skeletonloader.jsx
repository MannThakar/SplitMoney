const SkeletonLoader = () => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {[...Array(4)].map((_, index) => (
                <div key={index} className="p-2 flex flex-col gap-2 bg-stone-700 bg-opacity-30 border border-white border-opacity-20 backdrop-blur-lg shadow-lg rounded-lg animate-pulse">
                    <div className="flex gap-2">
                        <div className="bg-white rounded-full h-10 w-10"></div>
                        <div className="bg-white h-10 w-full rounded"></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="bg-white rounded-full h-6 w-6"></div>
                        <div className="bg-white h-6 w-full rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
