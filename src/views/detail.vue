<template>
  <div>
    <nv-header :func-type="3"></nv-header>
    <section class="container-body">
      <div class="blog-info">
        <div class="author-info">
          <span class="author-name" v-text="blog.author"></span>发表于<span class="author-time">{{blog.create_at | formatDate}}</span>
        </div>
        <div class="statistics">
          <span class="statistics-item"><i class="iconfont icon-footprint"></i>{{blog.visit_count | formatNum}}</span>
          <span class="statistics-item reply"><i class="iconfont icon-message"></i>{{blog.reply_count | formatNum}}</span>
          <span :class="['statistics-item', 'zan', {'has-zan': hasZan}]" @click="zan"><i class="iconfont icon-appreciate"></i>{{blog.zan_count | formatNum}}</span>
        </div>
        <div class="tags" v-if="blog.tags && blog.tags.length > 0">
          <span class="tag-item" v-for="tag in blog.tags"><i class="iconfont icon-tag"></i>{{tag}}</span>
        </div>
        <p v-html="blog.remark" :class="{'no-tag': !(blog.tags && blog.tags.length > 0)}"></p>
      </div>
      <div class="markdown-body" v-html="blog.content"></div>
      <comment v-if="blog._id" :blog-id="blog._id" :comment-count="blog.reply_count"></comment>
    </section>
    <confirm-dialog></confirm-dialog>
  </div>
</template>
<style lang="scss">
  @import '../styles/variable.scss';
  .blog-info {
    padding: 5px 10px;
    &:after {
      content: '';
      display: block;
      width: 0;
      height: 0;
      clear: both;
    }
    .author-info {
      font-size: 12px;
      padding: 8px 0 0;
      float: left;
      line-height: 12px;
      .author-name {
        margin-right: 5px;
        color: $blue;
        font-weight: 700;
      }
      .author-time {
        margin-left: 5px;
        color: $black;
      }
    }
    .statistics {
      color: $graySt;
      float: right;
      padding-top: 5px;
      .statistics-item {
        display: inline-block;
        float: left;
        font-size: 12px;
        line-height: 12px;
        margin-left: 2px;
        border: 1px solid $gray;
        border-radius: $radius;
        padding: 2px 4px;
        i {
          margin-right: 4px;
        }
        &:first-child {
          margin-left: 0;
        }
        &.reply {
          color: $green;
        }
        &.zan {
          cursor: pointer;
          color: #f7908d;
          &.has-zan {
            cursor: default;
            color: $red;
          }
        }
      }
    }
    .tags {
      margin-top: 30px;
      width: 100%;
      height: 30px;
      padding: 5px 0;
      .tag-item {
        display: inline-block;
        vertical-align: top;
        height: 20px;
        line-height: 12px;
        font-size: 12px;
        padding: 4px 6px;
        margin-right: 4px;
        border-radius: $radiusSm;
        color: $white;
        background-color: $info;
        i {
          margin-right: 2px;
        }
      }
    }
    p {
      color: $grayer;
      font-size: 14px;
      border-radius: $radius;
      background-color: #fafafa;
      padding: 10px;
      &.no-tag {
        margin-top: 30px;
      }
    }
  }
  .markdown-body {
    padding: 10px;
  }
</style>
<script>
  import { CHANGE_NAV, TRIGGER_MESSAGE } from '../vuex/actions';
  import nvHeader from '../components/Header';
  import confirmDialog from '../components/Confirm';
  import comment from '../components/Comment';
  import store from '../libs/data';

  import '../styles/markdown.scss';

  export default {
    data() {
      return {
        blog: {},
        hasZan: false
      };
    },
    components: {
      nvHeader, comment, confirmDialog
    },
    watch: {
      '$route'(to, from) {
        this.routeEnter(to, from);
      }
    },
    mounted() {
      this.routeEnter();
    },
    methods: {
      changeTitle(name) {
        this.$store.dispatch({
          type: CHANGE_NAV,
          nav: {
            name: name,
            routerName: 'detail'
          }
        });
      },
      routeEnter(to, from) {
        this.changeTitle('文章加载中...');
        let blogId = this.$route.params.id;
        store.getBlogInfo(blogId).then(data => {
          this.changeTitle(data.result.title);
          this.blog = data.result;
        });
      },
      zan() {
        if (!this.hasZan) {
          store.zanBlog(this.$route.params.id).then(data => {
            this.$store.dispatch({
              type: TRIGGER_MESSAGE,
              msgInfo: {
                type: data.code === 0 ? 1 : 3,
                msg: data.msg
              }
            });
            if (data.code === 0) {
              this.hasZan = true;
              this.blog.zan_count = this.blog.zan_count + 1;
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
    }
  };
</script>
