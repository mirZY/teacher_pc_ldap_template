import http from '@/utils/http/index';
//色块详细
export function  blockdetail (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/detail',
        method: 'get',
        params
    });
}
//获取校历
export function  calendarlist (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getcalendar',
        method: 'get',
        params
    });
}

//获取不排课数据
export function  stopsortcourse (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getstopsortcourse',
        method: 'get',
        params
    });
}
//获取预约排课数据
export function  sortcourse (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getsortcourse',
        method: 'get',
        params
    });
}
//获取当前登陆用户负责的利润中心
export function  adminprofitcenter (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getadminprofitcenter',
        method: 'get',
        params
    });
}
//获取当前登陆用户负责的分校
export function  adminschool (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getadminschool',
        method: 'get',
        params
    });
}

//获取当前登陆用户负责的城市
export function  admincity (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getadmincity',
        method: 'get',
        params
    });
}

//根据课节数和老师数量获取模板列表
export function  templatelist (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/gettemplates',
        method: 'get',
        params
    });
}
//根据课节数和老师数量获取不排课模板列表
export function  stoptemplatelist (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getstoptmp',
        method: 'get',
        params
    });
}

//老师排课详细
export function teacherlessonlist (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/list',
        method: 'get',
        params
    });
}

//老师负责的城市分校
export function schoollist (params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getschool',
        method: 'get',
        params
    });
}

//老师排课列表
export function schedulelist (params){
    return http({
        type:"schedule",
        url: '/lesson/schedule/list',
        method: 'get',
        params
    });
}

//校区
export function  campuseslist(params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getcampuses',
        method: 'get',
        params
    });
}
//项目
export function  itermlist(params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getitems',
        method: 'get',
        params
    });
}
//年级
export function  gradelist(params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getgrade',
        method: 'get',
        params
    });
}

//利润中心
export function  profitlist(params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getprofitcenter',
        method: 'get',
        params
    });
}
//城市中心
export function  citylist(params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/getcity',
        method: 'get',
        params
    });
}

//校区无分页
export function campuslist(params) {
    return http({
        type:"schedule",
        url: '/lesson/teacher/getcampuses',
        method: 'get',
        params: params
    })
}

//色块概览
export function summary(params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/summary',
        method: 'get',
        params
    });
}

//色块明细
export function summarydetail(params){
    return http({
        type:"schedule",
        url: '/lesson/teacher/detail',
        method: 'get',
        params
    });
}

//获取单节课表信息
export function lessondetail(params){
    return http({
        type:"schedule",
        url: '/lesson/schedule/detail',
        method: 'get',
        params
    });
}

//编辑排课记录
export function lessonedit(data){
    return http({
        type:"schedule",
        url: '/lesson/teacher/editsortcourse',
        method: 'post',
        data
    });
}
//添加排课记录
export function lessonadd(data){
    return http({
        type:"schedule",
        url: '/lesson/teacher/sortcourse',
        method: 'post',
        data
    });
}
//删除排课记录
export function lessondeleted(data){
    return http({
        type:"schedule",
        url: '/lesson/teacher/delsortcourse',
        method: 'post',
        data
    });
}

//排课日记录检测
export function checkconflict(data){
    return http({
        type:"schedule",
        url: '/lesson/teacher/checkconflict',
        method: 'post',
        data
    });
}
//不排课修改记录
export function editnoschedule(data){
    return http({
        type:"schedule",
        url: '/lesson/teacher/editstopsortcourse',
        method: 'post',
        data
    });
}
//添加不排课记录
export function addnoschedule(data){
    return http({
        type:"schedule",
        url: '/lesson/teacher/stopsortcourse',
        method: 'post',
        data
    });
}

//删除不排课记录
export function deletednoschedule(data){
    return http({
        type:"schedule",
        url: '/lesson/teacher/delstopsortcourse',
        method: 'post',
        data
    });
}
//不排课日记录检测
export function checkstopconflict(data){
    return http({
        type:"schedule",
        url: '/lesson/teacher/checkstopconflict',
        method: 'post',
        data
    });
}

//老师排课详情
export function lessonlist(params){
    return http({
        type:"schedule",
        url: '/lesson/schedule/list',
        method: 'get',
        params
    });
}

//获取具体期数课表信息
export function getdatabyperiod(params){
    return http({
        type:"schedule",
        url: '/lesson/schedule/getdatabyperiod',
        method: 'get',
        params
    });
}