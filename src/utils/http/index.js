import axios from 'axios'
import { stringify } from 'qs'
import store from '@/store'
import { getToken } from "../tools";
import { Message } from 'element-ui';

const http = axios.create({
    timeout: 10000,
    transformRequest: [data => stringify(data)],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    withCredentials: true
})
// request拦截器
http.interceptors.request.use(
    config => {
        if (getToken()) {
            config.headers.Authorization = getToken();
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// response拦截器
http.interceptors.response.use(
    response => {
        // console.log(response)
        const { code, data, err_msg, tips, statusCode } = response.data;
        if (code === 0 || code === 200 || statusCode === 200 ) {
            return data;
        }else {
            let msg = tips || err_msg;
            errorHandle(code, data, msg);
            return Promise.reject(msg);
        }
     },
    error => {
        const { response, code } = error
        if (code === 'ECONNABORTED') {
        } else
            if (response) {
                errorHandle(response.status, response.data)
            } else {
                if (!window.navigator.onLine) {
                } else {
                    return Promise.reject(error);
                }
            }
    }
)


/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other, msg) => {
    // 状态码判断

    switch (status) {
        case 10001:
            window.location.href = `${process.env.VUE_APP_API_MANAGER}/teacherauth/ldap/login`;
            break;
        case 10006:
            Message.error(msg);
            break;
        case 10017:
                Message.error(msg);
                break;
        case 10021:
                Message.error(msg);
                break;
        case 10018:
                Message.error(msg);
                break;
        case 10015:
            Message.error(msg);
            break;
        default:
            Message.error(msg);
            break;
    }
}

const URLS = {
    userBase:process.env.VUE_APP_API_MANAGER,
    //上传图片
    picture: process.env.VUE_APP_URL_UPLOAD,
    //排课
    schedule: process.env.VUE_APP_API_SCHEDULE,
    // 日历
    calendar: process.env.VUE_APP_API_CALENDAR,
    // 校历
    calendar: process.env.VUE_APP_API_CALENDAR,
    //上传视频
    video:process.env.VUE_APP_VIDEO,
    //视频转码
    procedure:process.env.VUE_APP_VIDEO_PROCEDURE

}

function fetch(config) {
    let urlThype = config['type'] 
    const uri = URLS[urlThype];
    if (!uri) throw '为获取对应的请求地址';
    config.baseURL = uri;
    return http(config)
}
export default fetch