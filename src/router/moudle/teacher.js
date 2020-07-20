import Layout from "@/components/Layout";
export default [
    {
        path: "/teacher",
        component: Layout,
        redirect: "/teacher/index",
        children: [
            {
                path: "index",
                name: "index",
                component: () => import("@/views/teacherManager/Teacher"),
                meta: {
                    title: "教师管理",
                    icon: "dashboard"
                }
            },
            {
                path: "teacherdetail",
                name: "teacherdetail",
                component: () => import("@/views/teacherManager/TeacherDetail"),
                meta: {
                    title: "教师详情",
                    icon: "dashboard"
                }
            },
            {
                path: "addteacher",
                name: "addteacher",
                component: () => import("@/views/teacherManager/AddTeacher"),
                meta: {
                    title: "添加加盟教师",
                    icon: "dashboard"
                }
            }
        ]
    }
];