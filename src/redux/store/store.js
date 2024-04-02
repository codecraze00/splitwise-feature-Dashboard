import { configureStore } from '@reduxjs/toolkit'

import todoReducer from '../reducers/todoReducer'
import counterReducer from '../reducers/counterReducer'

// export default configureStore({
//     reducer: counterReducer
// });

//----------------------------------------------
//----------------------------------------------
//----------------------------------------------

export default configureStore({
    reducer: {
        counter: counterReducer,
        todos : todoReducer,
    },
});
