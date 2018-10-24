<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="star-wrapper">
          <star :size="36" :score="seller.score"></star>
          <span class="sell-count">{{seller.ratingCount}}</span>
          <span class="sell-count">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2 class="title">起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <div class="title">商家配送</div>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <div class="title">平均配送时间</div>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="select">
          <div class="icon-favorite" :class="{'active':collectType}" @click="collect"></div>
          <div class="text">{{favoriteText}}</div>
        </div>
      </div>
      <split></split>
      <div class="active-wrapper">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="bulletin">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports">
          <li class="active" v-for="(active, index) in seller.supports" :key="index">
            <span class="icon" :class="classMap[active.type]"></span>
            <span class="text">{{active.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="seller-pic">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img :src="pic" width="120px" height="90px"/>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="seller-info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info" v-for="(info,index) in seller.infos" :key="index">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from 'components/star/star';
  import split from 'components/split/split';
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from 'common/js/store';

  export default {
    data() {
      return {
        collectType: (() => {
          return loadFromLocal(this.seller.id, 'collectType', false);
        })()
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch: {
      'seller'() {
        this._initScroll();
        this._initPics();
      }
    },
    mounted() {
      this._initScroll();
      this._initPics();
    },
    methods: {
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPics() {
        let picWidth = 120;
        let margin = 6;
        if (this.seller.pics) {
          this.$refs.picList.style.width = ((picWidth + margin) * this.seller.pics.length - margin) + 'px';
        }
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true, // 横向滚动
              eventPassthrough: 'vertical'// 忽略垂直方向的滚动
            });
          } else {
            this.picScroll.refresh();
          }
        });
      },
      collect() {
        this.collectType = !this.collectType;
        saveToLocal(this.seller.id, 'collectType', this.collectType);
      }
    },
    computed: {
      favoriteText() {
        return this.collectType ? '已收藏' : '收藏';
      }
    },
    components: {star, split}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview, .active-wrapper, .seller-pic, .seller-info
      .title
        margin: 0
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
    .overview
      padding: 18px
      position: relative
      .star-wrapper
        padding: 8px 0 18px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .star
          display: inline-block
          vertical-align: top
          margin-right: 8px
        .sell-count
          font-size: 10px
          color: rgb(77, 85, 93)
          line-height: 18px
          margin-right: 12px
          &:last-child
            margin-right: 0
      .remark
        padding-top: 18px
        display: flex
        .block
          flex: 1
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          text-align: center
          &:last-child
            border: none
          .title
            margin-bottom: 4px
            font-size: 10px
            color: rgb(147, 153, 159)
            line-height: 10px
          .content
            color: rgb(7, 17, 27)
            line-height: 24px
            font-size: 10px
            .stress
              font-size: 24px
      .select
        position: absolute
        top: 18px
        right: 18px
        width: 50px
        text-align: center
        .icon-favorite
          text-align: center
          font-size: 24px
          color: #d4d6d9
          line-height: 24px
          margin-bottom: 4px
          &.active
            color: rgb(240, 20, 20)
        .text
          font-size: 10px
          color: rgb(77, 85, 93)
          line-height: 10px
    .active-wrapper
      padding: 18px 18px 0
      .content-wrapper
        padding: 8px 12px 16px
        border-1px(rgba(7, 17, 27, 0.1))
        .bulletin
          font-size: 12px
          color: rgb(240, 20, 20)
          line-height: 24px
          margin: 0
      .active
        padding: 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
        .icon
          display: inline-block
          margin-right: 6px
          width: 16px
          height: 16px
          vertical-align: top
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.invoice
            bg-image('invoice_4')
          &.guarantee
            bg-image('guarantee_4')
          &.special
            bg-image('special_4')
        .text
          font-size: 12px
          color: rgb(7, 17, 27)
          line-height: 16px
    .seller-pic
      // padding: 18px 0 18px 18px
      padding: 18px
      .title
        margin-bottom: 12px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            height: 90px
            width: 120px
            &:last-child
              margin: 0
    .seller-info
      padding: 18px 18px 0
      .title
        border-1px(rgba(7, 17, 27, 0.1))
        padding-bottom: 12px
      .info
        padding: 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
        color: rgb(7, 17, 27)
        line-height: 16px
        &:last-child
          border-none()
</style>
