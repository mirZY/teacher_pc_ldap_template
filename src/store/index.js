import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import createPersistedState from 'vuex-persistedstate';
const mode = process.env.NODE_ENV;
const isProduction = mode !== 'production';

Vue.use(Vuex);

const modules = (modulesFiles => {
    return modulesFiles.keys().reduce((modules, modulePath) => {
        const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1');
        const value = modulesFiles(modulePath);
        modules[moduleName] = value.default;
        return modules;
    }, {});
})(require.context('./modules', false, /\.js$/));

const createPersisted = createPersistedState({
    key: `teacher-admin`
});

export default new Vuex.Store({
    modules,
    plugins: isProduction ? [createPersisted] : [createLogger(), createPersisted]
});
