import axios from "axios";
import { jwtDecode } from "jwt-decode";

const apiURL = process.env.REACT_APP_API_URL

const refreshToken = async () => {
    const httpRequest = axios.create({
        baseURL: apiURL, //địa chỉ của BE
        withCredentials: true,
    })
    
    try {
        const res = await httpRequest.post('/v1/accUser/refresh', axios.defaults.withCredentials = true)
        console.log(res.data)
        return res.data;
    } catch (error) {
        console.log("Error while refreshing token:", error);
        if (error.response) {
            console.log("Server response status:", error.response.status);
            console.log("Server response data:", error.response.data);
        }
    }
}
export const createAxios =(user,dispatch,stateSuccess)=>{
    const newInstance = axios.create()
    //axios interceptors có chức năng trước khi gửi request nào đó sẽ check nhứng gì trong hàm trước khi gọi api nào đó
    newInstance.interceptors.request.use(
        async (config) => {
            let date = new Date()
            const decodedToken = jwtDecode(user?.accessToken)
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken()
                const refreshUser = {
                    ...user,
                    accessToken: data.accessToken,
                };
                dispatch(stateSuccess(refreshUser))
                config.headers["token"] = "Bearer " + data.accessToken //giúp bỏ data của accessToken vào header
            }
            return config
        },
        (err) => {
            return Promise.reject(err)
        }
    )
    return newInstance
}