<template>
  <div>
    <nv-header :func-type="1" :callback="sendIssue"></nv-header>
    <section class="container-body issue-ask">
      <div class="issue-types">
        <span :class="['issue-type', {'on': type.key === postData.type}]" v-for="type in types" @click="changeType(type.key, type.name)">{{type.name}}</span>
      </div>
      <textarea class="issue-content" v-model="postData.content" placeholder="填写你的内容..."></textarea>
    </section>
    <confirm-dialog></confirm-dialog>
  </div>
</template>
<style lang="scss">
  @import '../styles/variable.scss';
  .issue-ask {
    padding: 20px;
    .issue-types {
      margin-bottom: 20px;
      text-align: center;
      .issue-type {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        border-radius: 50%;
        box-shadow: 0 0 5px 0 rgba(0,0,0,.26);
        font-size: 12px;
        line-height: 60px;
        color: $black;
        margin-right: 10px;
        transition: all .3s ease;
        cursor: pointer;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          color: $white;
          background-color: $blue;
        }
      }
    }
    .issue-content {
      width: 100%;
      height: 460px;
      border: none;
      padding: 10px;
      line-height: 24px;
      font-size: 16px;
      box-shadow: 0 0 5px 0 rgba(0,0,0,.26);
    }
  }
</style>
<script>
  import { mapGetters } from 'vuex';
  import { CHANGE_NAV, TRIGGER_MESSAGE, TRIGGER_CONFIRM } from '../vuex/actions';
  import nvHeader from '../components/Header';
  import confirmDialog from '../components/Confirm';
  import store from '../libs/data';

  export default {
    data() {
      return {
        typeName: '提问',
        postData: {
          content: '',
          author: JSON.parse(window.sessionStorage.user).name,
          author_email: JSON.parse(window.sessionStorage.user).email,
          type: 0
        },
        types: [{
          key: 0,
          name: '提问'
        }, {
          key: 1,
          name: '改进意见'
        }, {
          key: 2,
          name: 'bug反馈'
        }, {
          key: 3,
          name: '情感交流'
        }]
      };
    },
    computed: mapGetters([
      'NAV_LIST'
    ]),
    components: {
      nvHeader, confirmDialog
    },
    mounted() {
      this.routeEnter();
    },
    watch: {
      '$route': 'routeEnter'
    },
    methods: {
      routeEnter() {
        this.$store.dispatch({
          type: CHANGE_NAV,
          nav: {
            name: '创建内容',
            routerName: 'issue'
          }
        });
      },
      changeType(key, name) {
        this.typeName = name;
        this.postData.type = key;
      },
      sendIssue() {
        if (this.postData.content) {
          this.$store.dispatch({
            type: TRIGGER_CONFIRM,
            confirmInfo: {
              type: 3,
              msg: '确认创建[' + this.typeName + '] ?',
              callBack: () => {
                store.saveIssue(this.postData).then(data => {
                  this.$store.dispatch({
                    type: TRIGGER_MESSAGE,
                    msgInfo: {
                      type: data.code === 0 ? 1 : 3,
                      msg: data.msg
                    }
                  });
                  if (data.code === 0) {
                    this.$router.replace({
                      name: 'help'
                    });
                  }
                }, () => {
                  this.$store.dispatch({
                    type: TRIGGER_MESSAGE,
                    msgInfo: {
                      type: 2,
                      msg: '网络异常, 请稍后再试'
                    }
                  });
                });
              }
            }
          });
        } else {
          this.$store.dispatch({
            type: TRIGGER_MESSAGE,
            msgInfo: {
              type: 3,
              msg: '内容不能为空'
            }
          });
        }
      }
    }
  };
</script>
