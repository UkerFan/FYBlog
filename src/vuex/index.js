import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import * as mutations from './mutations';
import * as actions from './actions';

const store = new Vuex.Store({
  state: {
    navStatus: false,
    scrollPos: {
      list: 0,
      cream: 0,
      issue: 0
    },
    navList: [{
      name: '推荐',
      routerName: 'index',
      className: 'recommend',
      icon: 'iconfont icon-newshot'
    }, {
      name: '文章',
      routerName: 'list',
      className: 'list',
      icon: 'iconfont icon-list'
    }, {
      name: '精华',
      routerName: 'cream',
      className: 'cream',
      icon: 'iconfont icon-hot'
    }, {
      name: 'Q&A',
      routerName: 'help',
      className: 'help',
      icon: 'iconfont icon-question'
    }],
    activeNav: {},
    msgInfo: {
      type: 0,
      msg: ''
    },
    confirmInfo: {
      type: 0,
      msg: '',
      callBack: null
    },
    userInfo: {},
    listInfo: {
      loaded: false,
      page: 0,
      list: [],
      hasMore: true
    },
    creamInfo: {
      loaded: false,
      page: 0,
      list: [],
      hasMore: true
    },
    issueInfo: {
      loaded: false,
      page: 0,
      list: [],
      hasMore: true
    }
  },
  getters: {
    NAV_STAT(state) {
      return state.navStatus;
    },
    SCROLL_POS(state) {
      return state.scrollPos;
    },
    NAV_LIST(state) {
      return state.navList;
    },
    ACTIVE_NAV(state) {
      return state.activeNav;
    },
    MSG_INFO(state) {
      return state.msgInfo;
    },
    CONFIRM_INFO(state) {
      return state.confirmInfo;
    },
    USER_INFO(state) {
      return state.userInfo;
    },
    LIST_DATA(state) {
      return state.listInfo;
    },
    CREAM_DATA(state) {
      return state.creamInfo;
    },
    ISSUE_DATA(state) {
      return state.issueInfo;
    }
  },
  mutations: {
    [mutations.SET_NAV_STAT](state, payload) {
      state.navStatus = payload.status;
    },
    [mutations.SET_LIST_SCROLL](state, payload) {
      state.scrollPos.list = payload.pos;
    },
    [mutations.SET_CREAM_SCROLL](state, payload) {
      state.scrollPos.cream = payload.pos;
    },
    [mutations.SET_ISSUE_SCROLL](state, payload) {
      state.scrollPos.issue = payload.pos;
    },
    [mutations.SET_ACTIVE_NAV](state, payload) {
      state.activeNav = payload.nav;
    },
    [mutations.SET_USER_INFO](state, payload) {
      state.userInfo = payload.user;
    },
    [mutations.SET_MESSAGE](state, payload) {
      state.msgInfo = payload.msgInfo;
    },
    [mutations.SET_CONFIRM](state, payload) {
      state.confirmInfo = payload.confirmInfo;
    },
    [mutations.SET_LIST_DATA](state, payload) {
      state.listInfo = payload.listInfo;
    },
    [mutations.SET_CREAM_DATA](state, payload) {
      state.creamInfo = payload.creamInfo;
    },
    [mutations.SET_ISSUE_DATA](state, payload) {
      state.issueInfo = payload.issueInfo;
    }
  },
  actions: {
    [actions.TRIGGER_NAV]({ commit }, payload) {
      commit(mutations.SET_NAV_STAT, payload);
    },
    [actions.SET_POS]({ commit }, payload) {
      if (payload.module === 'list') {
        commit(mutations.SET_LIST_SCROLL, {pos: payload.pos});
      } else if (payload.module === 'cream') {
        commit(mutations.SET_CREAM_SCROLL, {pos: payload.pos});
      } else if (payload.module === 'issue') {
        commit(mutations.SET_ISSUE_SCROLL, {pos: payload.pos});
      }
    },
    [actions.CHANGE_NAV]({ commit }, payload) {
      commit(mutations.SET_ACTIVE_NAV, payload);
    },
    [actions.SET_USER]({ commit }, payload) {
      commit(mutations.SET_USER_INFO, payload);
    },
    [actions.TRIGGER_MESSAGE]({ commit }, payload) {
      commit(mutations.SET_MESSAGE, payload);
    },
    [actions.TRIGGER_CONFIRM]({ commit }, payload) {
      commit(mutations.SET_CONFIRM, payload);
    },
    [actions.AJAX_DATA]({ commit }, payload) {
      if (payload.module === 'list') {
        commit(mutations.SET_LIST_DATA, {
          listInfo: {
            loaded: true,
            page: payload.page || 0,
            list: payload.list || [],
            hasMore: payload.hasMore === undefined ? true : payload.hasMore
          }
        });
      } else if (payload.module === 'cream') {
        commit(mutations.SET_CREAM_DATA, {
          creamInfo: {
            loaded: true,
            page: payload.page || 0,
            list: payload.list || [],
            hasMore: payload.hasMore === undefined ? true : payload.hasMore
          }
        });
      } else if (payload.module === 'issue') {
        commit(mutations.SET_ISSUE_DATA, {
          issueInfo: {
            loaded: true,
            page: payload.page || 0,
            list: payload.list || [],
            hasMore: payload.hasMore === undefined ? true : payload.hasMore
          }
        });
      }
    }
  }
});

export default store;
