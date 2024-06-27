/* eslint-disable react/prop-types */
const Button = (props) => {
    return (
        <div className="mt-8 flex justify-center">
        <button onClick={props.click} className="py-2 px-3 md:w-1/12 bg-buttonColor text-black rounded-lg">
          Continue
        </button>
      </div>
    )
}
export default Button; 