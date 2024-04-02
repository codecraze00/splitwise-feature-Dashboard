import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    todos: [
        { id: 1, text: 'Learn React' },
        { id: 2, text: 'Learn Redux' },
        { id: 3, text: 'Learn Redux Toolkit' },
    ],
};

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        addTodo: (state, action) => {
            state.todos.push({ id: Date.now(), text: action.payload });
        },
        deleteTodo: (state, action) => {
            state.todos = state.todos.filter(todo => todo.id !== action.payload);
        },
    },
});

export const { addTodo, deleteTodo } = todoSlice.actions;

export default todoSlice.reducer;