import notfound from '../../assets/Logo/NotFound.png'
const PageNotFound = () => {
    return (
        <div className='h-svh flex justify-center items-center md:flex md:justify-center '>
            <div>
                <img src={notfound} alt='page not found' className='max-h-80 flex justify-center' />
            </div>
        </div>
    );
}

export default PageNotFound;
