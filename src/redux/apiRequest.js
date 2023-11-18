import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlice";
import { getUsersFailed, getUsersSuccess, getusersStart } from "./userSlice";

const apiURL = process.env.REACT_APP_API_URL
// login
export const loginUserAdmin = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post(`${apiURL}/v1/accUser/login`, user,{
            withCredentials: true
        })
            dispatch(loginSuccess(res.data))
            navigate("/")
    } catch (error) {
        dispatch(loginFailed())
    }
}
//register
export const registerUser = async(user,dispatch,navigate) => {
    dispatch(registerStart())
    try {
        await axios.post(`${apiURL}/v1/accUser/register`,user)
        dispatch(registerSuccess())
        navigate("/Login")
    } catch (error) {
        dispatch(registerFailed())
    }
}
//getalluser
export const getAllusers = async(accessToken, dispatch ,axiosJWT) =>{
    dispatch(getusersStart())
    try {
        const res = await axiosJWT.get(`${apiURL}/accUser`,{
            headers:{token:`Bearer ${accessToken}`}
        });
        dispatch(getUsersSuccess(res.data))
    } catch (error) {
        dispatch(getUsersFailed())
    }
}

//logout
export const logoutUser = async(dispatch,id,navigate,accessToken,axiosJWT) =>{
    dispatch(logoutStart())
    try {
        await axiosJWT.post(`${apiURL}/v1/accUser/logout`,id,{
            headers:{token:`Bearer ${accessToken}`}
        })
        dispatch(logoutSuccess())
        navigate("/")
    } catch (error) {
        dispatch(logoutFailed())
    }
}