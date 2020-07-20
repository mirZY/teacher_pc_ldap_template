import Layout from "@/components/Layout";
export default [
    {
        path: "/role",
        component: Layout,
        redirect: "/role/index",
        children: [
            {
                path: "index",
                name: "index",
                component: () => import("@/views/role/roleList"),
                meta: {
                    title: "角色权限",
                    icon: "dashboard"
                }
            },
            {
                path: "rolePermission",
                name: "rolePermission",
                component: () => import("@/views/role/rolePermission"),
                meta: {
                    title: "分配权限",
                    icon: "dashboard"
                }
            },
        ]
    }
];