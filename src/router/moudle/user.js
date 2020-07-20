import Layout from "@/components/Layout";
export default [
    {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        children: [
            {
                path: "dashboard",
                name: "Dashboard",
                component: () => import("@/views/dashboard/dashboard"),
                meta: {
                    title: "首页",
                    icon: "icon-yong-xuexi",
                    roles: ["1", "2"]
                }
            }
        ]
    },
    {
        path: "/user",
        component: Layout,
        redirect: "/user/index",
        children: [
            {
                path: "index",
                name: "index",
                component: () => import("@/views/userManager/User"),
                meta: {
                    title: "用户管理",
                    icon: "dashboard"
                }
            },
            {
                path: "userdetail",
                name: "userdetail",
                component: () => import("@/views/userManager/UserDetail"),
                meta: {
                    title: "用户详情",
                    icon: "dashboard"
                }
            }
        ]
    }
];