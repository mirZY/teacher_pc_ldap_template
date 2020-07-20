import Layout from "@/components/Layout";
export default [
    {
        path: "/calendar",
        component: Layout,
        redirect: "/calendar/index",
        children:[
            {
                path: 'index',
                name: 'index',
                meta: { title: '校历管理',breadNumber:2 },
                component: () => import('@/views/SchoolCalendar/SchoolCalendar.vue'),
            },
            {
                path: 'addcalendar',
                name: 'addcalendar',
                meta: { title: '添加校历',breadNumber:2 },
                component: () => import('@/views/SchoolCalendar/AddCalendar.vue'),
            },
            {
                path: 'changeclass',
                name: 'changeclass',
                meta: { title: '修改上课日',breadNumber:2 },
                component: () => import('@/views/SchoolCalendar/ChangeClass.vue'),
            },
            {
                path: 'changestopclass',
                name: 'changestopclass',
                meta: { title: '修改停课日',breadNumber:2 },
                component: () => import('@/views/SchoolCalendar/ChangeStopClass.vue'),
            }
        ]
    },
   
    
];