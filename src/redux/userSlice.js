import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'user',
    initialState:{
        users:{
            allUsers: null,
            isFetching:false,
            error:false,
        },
        mgs:"",
    },
    reducers:{
        getusersStart:(state)=>{
            state.users.isFetching = true;
        },
        getUsersSuccess:(state,action)=>{
            state.users.isFetching = false;
            state.users.allUsers = action.payload;
        },
        getUsersFailed:(state)=>{
            state.users.isFetching = false;
            state.users.error = true;
        }
    }
})

export const {
    getusersStart,
    getUsersSuccess,
    getUsersFailed,
} = userSlice.actions

export default userSlice.reducer