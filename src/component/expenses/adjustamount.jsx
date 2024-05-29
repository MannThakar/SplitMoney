import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, User, IndianRupee } from 'lucide-react';
import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const AdjustAmount = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('equally');

  const users = ['User1', 'User2', 'User3'];

  const validationSchema = Yup.object({
    amounts: Yup.array().of(
      Yup.number().required('Required').positive('Must be positive').integer('Must be an integer')
    ),
  });

  return (
    <div className="bg-primaryColor h-svh">
      <div className='pt-3 pl-2 flex justify-between'>
        <button className='flex gap-2' onClick={() => navigate('/')}>
          <ArrowLeft className='text-white' />
          <h2 className='text-white text-lg font-satoshi'>Adjust split</h2>
        </button>
        <div>
          <Check className='text-white mr-3' />
        </div>
      </div>
      
      <div className="flex justify-center gap-10 mt-4">
        <button className={`text-white text-xl ${tab === 'equally' ? 'font-bold' : ''}`} onClick={() => setTab('equally')}>Equally</button>
        <button className={`text-white text-xl ${tab === 'unequally' ? 'font-bold' : ''}`} onClick={() => setTab('unequally')}>Unequally</button>
      </div>

      {tab === 'equally' ? (
        <div className="mt-6 px-4">
          {users.map((user) => (
            <div key={user} className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="text-white" />
                <span className="text-white">{user}</span>
              </div>
              <input type="checkbox" className="form-checkbox text-white" />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 px-4">
          <Formik
            initialValues={{ amounts: users.map(() => '') }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log('Form values:', values);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                {users.map((user, index) => (
                  <div key={user} className="mb-4">
                    <div className="flex items-center justify-between gap-14 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="text-white" />
                        <span className="text-white">{user}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="text-white" />
                        <Field
                          name={`amounts[${index}]`}
                          type="number"
                          className={`form-input bg-transparent w-10 ${errors.amounts?.[index] && touched.amounts?.[index] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    {errors.amounts?.[index] && touched.amounts?.[index] && (
                      <div className="text-red-500 text-sm flex justify-end mt-1">{errors.amounts[index]}</div>
                    )}
                  </div>
                ))}
                <div className="flex justify-center">
                  <button type="submit" className="p-2 bg-buttonColor text-black rounded-2xl">Submit</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </div>
  );
}

export default AdjustAmount;
