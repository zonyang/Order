<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avater">
        <img width="64" height="64" :src="seller.avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>{{seller.supports[0].description}}
          <!--<span class="text">{{seller.supports[0].description}}</span>-->
        </div>
      </div>
      <div v-if="seller.supports" class="support-count">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right" @click="showDetail"></i>
      </div>
    </div>
    <div class="bulletin-wrapper">
      <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right" @click="showDetail"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <transition  name="fade">
      <div v-show="detailShow" class="detail">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :score="seller.score" :size="48"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item, index) in seller.supports" :key="index">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="bulletin">
              <p class="text">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close">
          <i class="icon-close" @click="hideDetail"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import star from 'components/star/star';
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail() {
        this.detailShow = true;
      },
      hideDetail() {
        this.detailShow = false;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    components: {
      star
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  @import "../../common/stylus/style.css"
  .header
    position: relative
    color: #fff
    background-color: rgba(7, 17, 27, 0.5)
    .content-wrapper
      padding: 24px 12px 18px 24px
      font-size: 0
      position: relative
      .avater
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        color: rgb(255, 255, 255)
        .title
          margin-top: 2px
          margin-bottom: 8px
          .brand
            display: inline-block
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
            vertical-align: top
          .name
            margin-left: 6px
            font-size: 16px
            font-weight: bold
            line-height: 18px
        .description
          margin-bottom: 10px
          font-size: 12px
          line-height: 12px
        .support
          margin-bottom: 2px
          font-size: 10px
          //height: 20px
          .icon
            vertical-align: middle
            display: inline-block
            margin-right: 4px
            width: 12px
            height: 12px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.invoice
              bg-image('invoice_1')
            &.guarantee
              bg-image('guarantee_1')
            &.special
              bg-image('special_1')
      /*.text*/
      /*vertical-align: middle*/
      /*margin-left: 4px*/
      /*font-size: 10px*/
      //  line-height: 20px
      .support-count
        position: absolute
        right: 12px
        bottom: 18px
        height: 24px
        padding: 0 8px
        line-height: 24px
        border-radius: 14px
        text-align: center
        background-color: rgba(0, 0, 0, 0.2)
        .count
          vertical-align: top
          font-size: 10px
        .icon-keyboard_arrow_right
          font-size: 10px
          line-height: 24px
          margin-left: 2px
    .bulletin-wrapper
      background-color: rgba(7, 17, 27, 0.2)
      position: relative
      height: 28px
      padding: 0 22px 0 12px
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
      .bulletin-title
        vertical-align: middle
        display: inline-block
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        margin: 0 4px
        font-size: 10px
        line-height: 28px
      .icon-keyboard_arrow_right
        vertical-align: middle
        position: absolute
        right: 12px
        top: 8px
        font-size: 10px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)
      overflow: hidden
    .detail
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: 100
      overflow: auto
      background: rgba(7, 17, 27, 0.8)
      backdrop-filter: blur(10px)
      &.fade-enter-active, &.fade-leave-active {
        transition: all .5s
        opacity: 1
      }
      &.fade-enter, &.fade-leave-to {
        opacity: 0
      }
      .detail-wrapper
        min-height: 100%
        .detail-main
          //margin-top: 64px
          padding-top: 64px
          padding-bottom: 64px
          .name
            text-align: center;
            font-size: 16px
            font-weight: 700
            line-height: 16px
            margin: 0
          .star-wrapper
            margin-top: 16px
            padding: 2px 0
            text-align: center
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              position: relative
              top: -6px
              border-bottom: 1px solid rgba(255,255,255,0.2)
            .text
              margin: 0 12px
              font-size: 14px
              font-weight: 700
          .supports
            width: 80%
            margin: 0 auto
            .support-item
              padding: 0 12px 12px 12px
              &:last-child
                padding-bottom: 0
              .text
                margin-left: 6px
                font-size: 12px
              .icon
                vertical-align: middle
                display: inline-block
                width: 16px
                height: 16px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.invoice
                  bg-image('invoice_2')
                &.guarantee
                  bg-image('guarantee_2')
                &.special
                  bg-image('special_2')
          .bulletin
            width: 80%
            margin: 0 auto
            .text
              padding: 0 12px
              font-size: 12px
              line-height: 24px
      .detail-close
        position: relative
        margin: -64px auto 0 auto
        font-size: 32px
        width: 32px
        height: 32px
        clear: both
        color: rgba(255,255,255,0.5)
</style>
