<template>
  <div class="container-header">
    <header>
      <div @click="triggerSlide" :class="['header-btn', 'more-icon', {'active': NAV_STAT}]"><i class="iconfont icon-more"></i></div>
      <span class="title" v-text="ACTIVE_NAV.name">推荐</span>
      <a v-if="funcType === 0" class="header-btn new" @click="routeGo('new')" href="javascript:;"><i class="iconfont icon-write"></i></a>
      <a v-if="funcType === 1" class="header-btn back" @click="goBack" href="javascript:;"><i class="iconfont icon-back"></i></a>
      <a v-if="funcType === 1" class="header-btn ok" @click="saveClick" href="javascript:;"><i class="iconfont icon-check"></i></a>
      <a v-if="funcType === 2" class="header-btn new" @click="routeGo('issue')" href="javascript:;"><i class="iconfont icon-message"></i></a>
      <a v-if="funcType === 3" class="header-btn back-only" @click="goBack" href="javascript:;"><i class="iconfont icon-back"></i></a>
    </header>
    <SideNav :nav-stat="NAV_STAT"></SideNav>
    <message></message>
  </div>
</template>
<style lang="scss">
  @import '../styles/variable.scss';
  .container-header:after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    clear: both;
  }
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 60px;
    text-align: center;
    background: rgba(255,255,255,.9);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    z-index: 9000;
    .header-btn {
      position: absolute;
      width: 60px;
      height: 60px;
      top: 0;
      line-height: 60px;
      text-align: center;
      font-size: 24px;
      transform: rotateZ(0deg);
      transition: transform .3s ease;
      &.more-icon {
        left: 0;
        color: $red;
      }
      &.new, &.ok {
        right: 0;
        color: $green;
      }
      &.back {
        right: 60px;
        color: $grayer;
      }
      &.back-only {
        right: 0;
        color: $grayer;
      }
      &.active {
        transform: rotateZ(-90deg);
      }
    }
    .title {
      line-height: 60px;
      font-size: 20px;
      color: $blackSt;
      display: inline-block;
      vertical-align: middle;
      width: 100%;
      padding: 0 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
<script>
  import { TRIGGER_NAV } from '../vuex/actions';
  import { mapGetters } from 'vuex';
  import SideNav from './SideNav';
  import Message from './Message';

  export default {
    data() {
      return {};
    },
    computed: mapGetters([
      'NAV_STAT', 'ACTIVE_NAV'
    ]),
    props: {
      funcType: {
        type: Number,
        default: 0
      },
      callback: {
        type: Function,
        default: function() {
          return () => {};
        }
      }
    },
    components: {
      SideNav, Message
    },
    methods: {
      triggerSlide() {
        this.$store.dispatch({
          type: TRIGGER_NAV,
          status: true
        });
      },
      goBack() {
        this.$router.go(-1);
      },
      routeGo(name) {
        if (window.sessionStorage && window.sessionStorage.user && JSON.parse(window.sessionStorage.user)._id) {
          this.$router.push({
            name: name
          });
        } else {
          this.$router.push({
            name: 'login'
          });
        }
      },
      saveClick() {
        this.callback();
      }
    }
  };
</script>
