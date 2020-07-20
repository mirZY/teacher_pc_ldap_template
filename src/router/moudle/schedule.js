import Layout from "@/components/Layout";
export default [
    {
        path: "/schedule",
        component: Layout,
        redirect: "/schedule/index",
        children: [
            {
                path: "index",
                name: "index",
                component: () => import("@/views/TeacherSchedule/TeacherSchedule"),
                meta: {
                    title: "教师排课",
                    icon: "dashboard"
                }
            },
            {
                path: "detail",
                name: "detail",
                component: () => import("@/views/TeacherSchedule/ScheduleDetail"),
                meta: {
                    title: "教师排课情况",
                    icon: "dashboard"
                }
            },
            {
                path: "noschedule",
                name: "noschedule",
                component: () => import("@/views/TeacherSchedule/NoSchedule"),
                meta: {
                    title: "不预约排课",
                    icon: "dashboard"
                }
            },
            {
                path: "bookschedule",
                name: "bookschedule",
                component: () => import("@/views/TeacherSchedule/BookSchedule"),
                meta: {
                    title: "预约排课",
                    icon: "dashboard"
                }
            }
           
        ]
    }
];