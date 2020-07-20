import Cookies from "js-cookie";
const TokenKey = "PHPSESSID";

export function getToken() {
    return Cookies.get(TokenKey);
    // return window.localStorage.getItem(TokenKey);
}

export function setToken(token) {
    return Cookies.set(TokenKey, token);
    // return window.localStorage.setItem(TokenKey, token);
}

export function removeToken() {
    return Cookies.remove(TokenKey);
    // return window.localStorage.removeItem(TokenKey);
}

export function isExternal(path) {
    return /^(https?:|mailto:|tel:)/.test(path)
}


export function isOperationBtn(OperationLs, userPath, userOperation) {
    let isBtnShow = {};
    // 操作类按钮对比：1查看 2新建 3修改 4禁用 5查看详情 6详情修改 7分配权限 8加盟老师添加 9加盟老师修改
    if (OperationLs.length > 0) {
        OperationLs.map(item => {
            console.log(item.path);
            item.type = Number(item.type);
            if ( userPath.indexOf(item.path) > -1 ) {
                console.log(item.path);
                if (userOperation.indexOf(item.type) > -1) {
                    switch (item.type) { 
                        case 1:
                            isBtnShow.list = true; 
                        break; 
                        case 2:
                            isBtnShow.add = true;  
                        break; 
                        // case 3:
                        //     isBtnShow.edit = true; 
                        // break; 
                        // case 4:
                        //     isBtnShow.operat = true;  
                        // break; 
                        // case 5:
                        //     isBtnShow.info = true;  
                        // break; 
                        // case 6:
                        //     isBtnShow.editInfo = true;  
                        // break; 
                        // case 7:
                        //     isBtnShow.rolePermiss = true;  
                        // break; 
                        case 8:
                            isBtnShow.teacherAdd = true;  
                        break; 
                        default:
                            isBtnShow.teacherEdit = true;  
                        break
                    }
                }
            }
        })
    }
    return isBtnShow
}

// 时间格式化
// format((new Date()),"yyyy-MM-dd hh:mm:ss")
export function formatTime(data, format)  {
    var o = {
        "M+": data.getMonth() + 1, //month
        "d+": data.getDate(), //day
        "h+": data.getHours(), //hour
        "m+": data.getMinutes(), //minute
        "s+": data.getSeconds(), //second
        "q+": Math.floor((data.getMonth() + 3) / 3), //quarter
        "N+": data.getHours() < 12 ? 'am' : 'pm', //ampm
        "S": data.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (data.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
//获取角色拥有按钮权限
export function defaultOperationBtn(OperationLs) {
    const newArr = [];
    if (OperationLs.length > 0) {
        OperationLs.map(item => {
            newArr.push(Number(item.node_id));
        })
    }
    return newArr;
}
// 权限获取
export  function  jurisdiction(list,num) {
    let status =  list.some(item =>{
       return  item.node_id ==  parseInt(num) - 1
     })
     return status
 }
