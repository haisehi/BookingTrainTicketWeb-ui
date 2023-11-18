import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        login: {
            currentUser: null,
            isFetching: false, //loading
            error: false
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        },
        logout:{
            isFetching: false,
            error:false
        }
    },
    reducers: {
        //login
        loginStart: (state) => {
            state.login.isFetching = true //loading thành công
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false;
            state.login.currentUser = action.payload //trả về tất cả các thông tin của người dùng
            state.login.error = false
        },
        loginFailed: (state) => {
            state.login.isFetching = false
            state.login.error = true
        },
        //register
        registerStart: (state) => {
            state.register.isFetching = true //loading thành công
        },
        registerSuccess: (state, action) => {
            state.register.isFetching = false;
            state.register.error = false
            state.register.success = true 
        },
        registerFailed: (state) => {
            state.register.isFetching = false
            state.register.error = true
            state.register.success = false
        },
        //logout
        logoutStart: (state) => {
            state.login.isFetching = true //loading thành công
        },
        logoutSuccess: (state) => {
            state.login.isFetching = false;
            state.login.currentUser = null //trả về tất cả các thông tin của người dùng
            state.login.error = false
        },
        logoutFailed: (state) => {
            state.login.isFetching = false
            state.login.error = true
        },
    }
})

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailed,
    logoutStart,
    logoutSuccess,
    logoutFailed
} = authSlice.actions

export default authSlice.reducer