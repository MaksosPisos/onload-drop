import Vuex from "vuex";

export default new Vuex.Store({
    state: {
        API: 'https://logs.scriptscamp.space',
        jwt: localStorage.jwt ? localStorage.jwt : '',
        login: '',
        password: '',
    },
    getters: {
        GET_DISABLED_SUBMIT_AUTH: state => {
            return state.password.length > 5 && state.login.length > 5 ? false : true
        },

    },
    mutations: {
        SET_JWT(state, token) {
            state.jwt = token;
        }
    },
    actions: {
      
    },
  });