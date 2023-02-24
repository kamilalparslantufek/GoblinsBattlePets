/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: undefined,
    status: "offline"
}

const userSlice = createSlice({
    initialState,
    name: 'user',
    reducers:{
        setUserValue: (state, action) => {
            state.value = action.payload;
        },
        setStatus:(state,action) => {
            state.status = action.payload;
        },
    },
  });

export const {setUserValue, setStatus} = userSlice.actions;
export const getUserStatus = (state) => state.user.status;
export const getUserValue = (state) => state.user.value;

export default userSlice.reducer;
