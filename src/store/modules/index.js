import { teacherMenu } from "@/api/index";
import {jurisdiction} from '@tools'
const common = {
    state: {
		userInfols: "",
		menu: "",
		menuBtn: []
    },
  
	mutations: {
		SET_USER_INFO:(state,data) =>{
			state.userInfols =data;
		},
		SET_MENU:(state,data) => {
			state.menu =data;
		},
		SET_MENUBTN:(state,data) => {
			state.menuBtn =data;
		},
	},
	actions: {
		Logout({ commit }) {
			commit('SET_MENU', "");
			commit('SET_USER_INFO', "");
			commit('SET_MENUBTN', "");
		},

		SaveMenu({ commit }, data) {
            return new Promise((resolve, reject) => {
                teacherMenu()
                    .then(res => {
						commit('SET_MENU', res.list);
						commit('SET_USER_INFO', res.cas_user);
						commit('SET_MENUBTN', res.jurisdiction);
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }
	},
	getters: {
		userInfols: state => state.userInfols,
		menu: state => state.menu,
		menuBtn: state => state.menuBtn,
	    scheduleJurisdiction: state =>{
			let jur = state.menuBtn
			return {
				look:jurisdiction(jur,'31'),
				book: jurisdiction(jur,'33'),
				nobook:jurisdiction(jur,'34'),
				lookdetail:jurisdiction(jur,'31'),
				block:jurisdiction(jur,'28'),
				changebook:jurisdiction(jur,'36'),
				changenobook:jurisdiction(jur,'27'),
			}
		}
	},
}



export default common
  
