import http from '@/utils/http/index';

//角色管理-获取列表
export function rolelist (params){
    return http({
        type:"userBase",
        url: '/teacherauth/role/rolelist',
        method: 'get',
        params
    });
}

//角色管理-添加角色
export function addRole (data){
    return http({
        type:"userBase",
        url: '/teacherauth/role/add',
        method: 'post',
        data: data
    });
}

//角色管理-修改角色
export function editRole (data){
    return http({
        type:"userBase",
        url: '/teacherauth/role/save',
        method: 'post',
        data: data
    });
}

//角色管理-状态更改
export function statusRole (data){
    return http({
        type:"userBase",
        url: '/teacherauth/role/status',
        method: 'post',
        data: data
    });
}

//角色管理-权限列表
export function rolePower (params){
    return http({
        type:"userBase",
        url: '/teacherauth/power/listtag',
        method: 'get',
        params
    });
}

//角色管理-分配权限
export function savePower (data){
    return http({
        type:"userBase",
        url: '/teacherauth/power/save',
        method: 'post',
        data: data
    });
}