import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, IndianRupee } from 'lucide-react';
import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { GroupContext } from '../auth/groupcontext';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  amounts: Yup.array().of(
    Yup.number().required('Required').min(0, 'Amount must be greater than or equal to 0')
  )
});

const AdjustAmount = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { setGroupId } = useContext(GroupContext);
  const [members, setMembers] = useState([]);
  const [selectedMemberIDs, setSelectedMemberIDs] = useState({});
  const [tab, setTab] = useState('equally');

  const viewMember = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      const membersData = res.data.members;
      setMembers(membersData);
      setGroupId(id);
    } catch (error) {
      console.error("Group Members", error);
    }
  }, [id, setGroupId]);
  
  useEffect(() => {
    viewMember();
  }, [viewMember]);
  
  const handleCheckboxChange = (memberId) => {
    setSelectedMemberIDs((prevSelectedMemberIDs) => ({
      ...prevSelectedMemberIDs,
      [memberId]: !prevSelectedMemberIDs[memberId],
    }));
  };
  console.log(selectedMemberIDs);

  return (
    <div className="bg-primaryColor h-svh">
      <div className='pt-3 pl-2 flex justify-between'>
        <button className='flex gap-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='text-white' />
          <h2 className='text-white text-lg font-satoshi'>Adjust split</h2>
        </button>
      </div>

      <div className="flex justify-center gap-10 mt-4">
        <button className={`text-white text-xl ${tab === 'equally' ? 'font-bold' : ''}`} onClick={() => setTab('equally')}>Equally</button>
        <button className={`text-white text-xl ${tab === 'unequally' ? 'font-bold' : ''}`} onClick={() => setTab('unequally')}>Unequally</button>
      </div>

      {tab === 'equally' ? (
        <div className="mt-6 px-4">
          {!members || members.length === 0 ? (
            <h1>Loader</h1>
          ) : (
            members.map((member) => (
              <div key={member.id} className="flex items-center justify-between mb-4">
                <button className="flex gap-5 items-center">
                  <div className="">
                    <User className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-satoshi text-white text-base">{member.name}</h3>
                  </div>
                </button>
                <input
                  type="checkbox"
                  className="form-checkbox text-white"
                  checked={!!selectedMemberIDs[member.id]}
                  onChange={() => handleCheckboxChange(member.id)}
                />
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="mt-6 px-4">
          <Formik
            initialValues={{ amounts: members.map(() => '') }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log('Form values:', values);
            }}
          >
            {({ errors, touched }) => (
              <Form>
                {members.map((member, index) => (
                  <div key={member.id} className="mb-4">
                    <div className="flex items-center justify-between gap-14 mb-2">
                      <div className="flex items-center gap-5">
                        <User className="text-white" />
                        <span className="text-white text-base font-satoshi">{member.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee className="text-white" />
                        <Field
                          name={`amounts[${index}]`}
                          type="number"
                          className={`form-input text-white bg-transparent w-10 ${errors.amounts?.[index] && touched.amounts?.[index] ? 'border-red-500' : 'border-gray-300'}`}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    {errors.amounts?.[index] && touched.amounts?.[index] && (
                      <div className="text-red-500 text-sm flex justify-end mt-1">{errors.amounts[index]}</div>
                    )}
                  </div>
                ))}
              </Form>
            )}
          </Formik>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate(`/group/${id}/addexpense`, { state: { selectedMemberIDs } })}
          className="p-2 bg-buttonColor text-black rounded-2xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default AdjustAmount;
