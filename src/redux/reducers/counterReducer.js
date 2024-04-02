// const initialState = {
//     count: 0,
// };

// const counterReducer = (state = initialState, action) => {
//     if (action.type === 'INCREMENT') {
//         return { count: state.count + action.payload };
//     }
//     else if (action.type === 'DECREMENT') {
//         return { count: state.count - action.payload };
//     }
//     return state;
// };

// export default counterReducer;

//----------------------------------------------
//----------------------------------------------
//----------------------------------------------

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    count: 0,
};

const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        incrementByAmount: (state, action) => {
            if (action.payload.type === 'INCREMENT') {
                state.count += action.payload.payload;
            }
            else if (action.payload.type === 'DECREMENT') {
                state.count -= action.payload.payload;
            }
        },
    },
});

export const { incrementByAmount } = counterSlice.actions;

export default counterSlice.reducer;
