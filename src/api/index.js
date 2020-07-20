import http from '@/utils/http/index';

// 用户-导航获取
export function teacherMenu (params){
    return http({
        type:"userBase",
        url: '/teacherauth/power/list',
        method: 'get',
        params
    });
}

// 用户管理-用户列表
export function usersList (params){
    return http({
        url: '/teacherauth/users/userslist',
        method: 'get',
        type:'userBase',
        params
    });
}

// 用户管理-用户详情
export function usersDetail (params){
    return http({
        url: '/teacherauth/users/usersdetail',
        method: 'get',
        type:'userBase',
        params
    });
}

// 用户管理-修改状态
export function changeStatus (data){
    return http({
        url: '/teacherauth/users/status',
        method: 'post',
        type:'userBase',
        data:data
    });
}

// 用户管理-补录用户信息
export function setRecord (data){
    return http({
        url: '/teacherauth/users/record',
        method: 'post',
        type:'userBase',
        data:data
    });
}

// 用户管理-全部校区
export function allschool (params){
    return http({
        url: '/teacherauth/users/allschool',
        method: 'post',
        type:'userBase'
    });
}

// 用户管理-利润中心
export function allprofit (params){
    return http({
        url: '/teacherauth/users/allprofit',
        method: 'get',
        type:'userBase'
    });
}

// 教师管理-教师列表
export function teacherList (params){
    return http({
        url: '/teacherauth/teacher/teacherlist',
        method: 'get',
        type:'userBase',
        params
    });
}

// 教师管理-教师详情
export function teacherdetail (params){
    return http({
        url: '/teacherauth/teacher/teacherdetail',
        method: 'get',
        type:'userBase',
        params
    });
}

// 教师管理-修改教师状态
export function teacherstatus (data){
    return http({
        url: '/teacherauth/teacher/teacherstatus',
        method: 'post',
        type:'userBase',
        data: data
    });
}

// 教师管理-编辑教师----正式老师(新老师)
// export function addOfficialTeacher (params){
//     return http({
//         url: '/teacherauth/teacher/addteacher',
//         method: 'get',
//         type:'userBase',
//         params
//     });
// }

// // 教师管理-编辑教师----正式老师（旧老师）
// export function updateteacher (params){
//     return http({
//         url: '/teacherauth/teacher/updateteacher',
//         method: 'get',
//         type:'userBase',
//         params
//     });
// }

// 教师管理 ->加盟教师添加
export function addjoininteacher (data){
    return http({
        url: '/teacherauth/teacher/addjoininteacher',
        method: 'post',
        type:'userBase',
        data:data
    });
}

// 教师管理 ->加盟教师修改
export function savejoininteacher (data){
    return http({
        url: '/teacherauth/teacher/savejoininteacher',
        method: 'post',
        type:'userBase',
        data:data
    });
}


// 城市列表
export function schoolids (params){
    return http({
        url: '/teacherauth/teacher/schoolids',
        method: 'get',
        type:'userBase',
        params
    });
}
// 利润中心
export function profitcenter (params){
    return http({
        url: '/teacherauth/teacher/profitcenter',
        method: 'get',
        type:'userBase',
        params
    });
}

// 项目列表
export function itemids (params){
    return http({
        url: '/teacherauth/teacher/itemids',
        method: 'get',
        type:'userBase',
    });
}

// 授课年级
export function setGrade (params){
    return http({
        url: '/teacherauth/teacher/grade',
        method: 'get',
        type:'userBase',
    });
}

// 授课学科
export function subjects (params){
    return http({
        url: '/teacherauth/teacher/subjects',
        method: 'get',
        type:'userBase',
    });
}


// 角色管理-角色列表（名称查重）
export function rolelist (params){
    return http({
        url: '/teacherauth/role/userrole',
        method: 'get',
        type:'userBase',
        params
    });
}

//上传图片
export function gettoken(data) {
    return http({
        type: "picture",
        url: "/v1/courseware/gettoken",
        method: "get"
    });
}

//上传视频（腾讯云）--- 获取签名
export function getuploadsignature(data) {
    return http({
        type: "video",
        url: "/tencentvideo/video/getuploadsignature",
        method: "post",
        data:data
    });
}

//上传视频（腾讯云）--- 腾讯视频转码
export function videoProcedure(data) {
    return http({
        type: "procedure",
        url: "/tencentvideo/video/procedure",
        method: "post",
        data:data
    });
}

//上传视频（腾讯云）--- 获取视频详情
export function getVideoDetail(data) {
    return http({
        type: "video",
        url: "/tencentvideo/video/detail",
        method: "post",
        data:data
    });
}



