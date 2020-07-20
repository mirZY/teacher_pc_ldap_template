import http from '@/utils/http/index';
// 添加校历
export function checkdate (data){
    return http({
        type:"calendar",
        url: '/calendar/calendar/checkerm',
        method: 'post',
        data
    });
}

// 添加校历
export function addcalendar (data){
    return http({
        type:"calendar",
        url: '/calendar/calendar/add',
        method: 'post',
        data
    });
}

//校历列表
export function listcalendar (params){
    return http({
        type:"calendar",
        url: '/calendar/calendar/list',
        method: 'get',
        params
    });
}

//修改上课日
export function changeclass (data){
    return http({
        type:"calendar",
        url: '/calendar/calendar/editclassday',
        method: 'post',
        data
    });
}
//修改上课日
export function changestopclass (data){
    return http({
        type:"calendar",
        url: '/calendar/calendar/editstopclassday',
        method: 'post',
        data
    });
}

//利润中心
export function profitlist (params){
    return http({
        type:"calendar",
        url: '/calendar/calendar/profitlist',
        method: 'get',
        params
    });
}

//城市
export function citylist (params){
    return http({
        type:"calendar",
        url: 'calendar/calendar/citylist',
        method: 'get',
        params
    });
}


// 检测校历
export function checkcalendar (params){
    return http({
        type:"calendar",
        url: '/calendar/calendar/checkexist',
        method: 'get',
        params
    });
}


// 查看上课日
export function lookclass (params){
    return http({
        type:"calendar",
        url: '/calendar/calendar/getclassday',
        method: 'get',
        params
    });
}

// 查看停课日
export function lookstopclass (params){
    return http({
        type:"calendar",
        url: '/calendar/calendar/getstopclassday',
        method: 'get',
        params
    });
}

//校历列表
export function getcalendar (){
    return http({
        type:"calendar",
        url: '/calendar/calendar/checklist',
        method: 'get',
        
    });
}

//检测校历
export function checkexist (params){
    return http({
        type:"calendar",
        url: '/calendar/calendar/checkexist',
        method: 'get',
        params
    });
}