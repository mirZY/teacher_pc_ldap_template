import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index'
import { setToken, getToken } from "../utils/tools";
Vue.use(VueRouter);
const routes = (moduleFiles => {
    const exclude = ['index.js']
    let route = [];
    moduleFiles.keys().forEach(path => {
    const content = moduleFiles(path),
        fileName = path.replace(/^.*[\\\/]/, '');
        if (!exclude.includes(fileName)&& Array.isArray(content.default || content)) {
            route = route.concat(content.default || content);
        }
    });
    return route
})(require.context('./moudle', true, /\.js$/));

const router = new VueRouter({
    mode: 'history', 
    base: '/front',
    routes,
    store,
    scrollBehavior: () => ({ y: 0 })
});

// 页面资源找不到报错
router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g;
    const isChunkLoadFailed = error.message.match(pattern);
    const targetPath = router.history.pending.fullPath;
    if (isChunkLoadFailed) {
    }
  });
router.beforeEach((to, from, next) => {
    // 修改页面标题
    // if (to.meta && to.meta.title) {
    //     document.title = to.meta.title;
    // }
    store.dispatch("SaveMenu");
    if (to.query.token_str) {
        setToken(to.query.token_str);
        if (getToken()) {
            router.push({
                path: '/'
            })
            next();
        }
	}
  	next();
});

export default router;
