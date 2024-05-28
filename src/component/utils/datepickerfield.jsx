/* eslint-disable react/prop-types */
import { useFormikContext } from 'formik';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerField = ({ name }) => {
    const { setFieldValue, values } = useFormikContext();
    const selectedDate = values[name] ? new Date(values[name]) : null;


    return (
        <>
            <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                    setFieldValue(name, date);
                }}
                className="border-b w-full max-w-xs border-gray-400 p-2 bg-transparent text-white"
                placeholderText="Select a date"
                dateFormat="yyyy/MM/dd"
            />
            {console.log('This is the selected date', selectedDate)}

        </>

    );

};

export default DatePickerField;