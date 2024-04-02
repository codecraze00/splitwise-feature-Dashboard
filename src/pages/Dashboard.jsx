import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import db from '../config/firebasedb';
import ExpenseForm from '../components/forms/ExpenseForm';
import LoadingOverlay from '../components/loading/LoadingOverlay';

const Dashboard = () => {
  const [usersData, setUsersData] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersCollection = collection(db, 'user_detail'); // Assuming the collection name is 'user_detail'
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsersData(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    // Redirect to login if there is no current user
    if (!currentUser) {
      navigate('/login');
    } else {
      fetchUsers();
    }
  }, [currentUser, navigate]);

  const [selectedExpenseForm, setSelectedExpenseForm] = useState(false);

  const handleOncloseForm = () => {
    setSelectedExpenseForm(false);
  }

  return (
    <>
    {loading && <LoadingOverlay />}
    <section className='flex justify-center items-center py-16 px-10 md:px-0 bg-white'>
      <div className='w-full md:w-3/4 flex flex-col md:flex-row gap-10'>
        {currentUser && (
          <div className="pt-2">
            <h1 className='text-[#1F2937] text-xl'>Welcome <span className='text-3xl'>{currentUser.displayName}</span></h1>
          <div className='flex flex-col'>
              <hr className='border border-[#1F2937] my-1 w-32' />
              <hr className='border border-[#1F2937] mb-5 w-24' />
            </div>
            
            {/* add expense form button */}
            <button type="button" className="text-white bg-[#2eaec5] hover:bg-[#2eaec5]/80 focus:ring-4 focus:outline-none focus:ring-[#2eaec5]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#2eaec9]/80 dark:focus:ring-[#2eaec9]/40 me-2 mb-2"
            onClick={() => setSelectedExpenseForm(true)}>
            <svg className="w-4 h-4 me-2 -ms-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="bitcoin" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.1-111 248-248 248S8 392.1 8 256 119 8 256 8s248 111 248 248zm-141.7-35.33c4.937-32.1-20.19-50.74-54.55-62.57l11.15-44.7-27.21-6.781-10.85 43.52c-7.154-1.783-14.5-3.464-21.8-5.13l10.93-43.81-27.2-6.781-11.15 44.69c-5.922-1.349-11.73-2.682-17.38-4.084l.031-.14-37.53-9.37-7.239 29.06s20.19 4.627 19.76 4.913c11.02 2.751 13.01 10.04 12.68 15.82l-12.7 50.92c.76 .194 1.744 .473 2.829 .907-.907-.225-1.876-.473-2.876-.713l-17.8 71.34c-1.349 3.348-4.767 8.37-12.47 6.464 .271 .395-19.78-4.937-19.78-4.937l-13.51 31.15 35.41 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.26 45.21 27.18 6.781 11.15-44.73a1038 1038 0 0 0 21.69 5.627l-11.11 44.52 27.21 6.781 11.26-45.13c46.4 8.781 81.3 5.239 95.99-36.73 11.84-33.79-.589-53.28-25-65.99 17.78-4.098 31.17-15.79 34.75-39.95zm-62.18 87.18c-8.41 33.79-65.31 15.52-83.75 10.94l14.94-59.9c18.45 4.603 77.6 13.72 68.81 48.96zm8.417-87.67c-7.673 30.74-55.03 15.12-70.39 11.29l13.55-54.33c15.36 3.828 64.84 10.97 56.85 43.03z"></path></svg>
            Add Expense
            </button>

            <h2 className='text-[#1F2937] text-2xl my-4'>Our Users</h2>
            <div className="flex flex-wrap -mx-4">
              {usersData.map((user, index) => (
               <div key={index} className="w-72 px-4 mb-4">
                  <div className="relative overflow-hidden group">
                    <img
                      src={user.picture || 'https://via.placeholder.com/250'} // Assuming the field name for picture is 'picture'
                      alt={user.displayName} // Assuming the field name for display name is 'displayName'
                      className="object-cover transform transition-transform duration-300 group-hover:scale-110 group-hover:brightness-50 hover:cursor-pointer h-72 w-72"
                    />
                    <p className="absolute bottom-0 left-0 right-0 p-4 bg-gray-400 bg-opacity-45 text-center text-lg ">{user.displayName}</p>
                  </div>
                </div>
                
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
          {/* Popup */}
          {selectedExpenseForm && (
          usersData.length > 0 && <ExpenseForm usersData={usersData} onClose={handleOncloseForm} />
        )}
    </>
  );
};

export default Dashboard;
