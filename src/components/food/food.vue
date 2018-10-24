<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="name">{{food.name}}</h1>
          <div class="extra">
            <span class="count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span v-if="food.oldPrice" class="old">{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" v-on:cart-add="cartAdd"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="pay" @click.stop.prevent="addCart" v-show="!food.count ||food.count===0">加入购物车</div>
          </transition>
        </div>
        <split></split>
        <div class="info">
          <h1 class="name">商品介绍</h1>
          <div class="text">{{food.info}}</div>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="name">商品评价</h1>
          <ratingselect :select-type="selectType"
                        :ratings="food.ratings"
                        :only-content="onlyContent"
                        :desc="desc" v-on:ratingtype-select="ratingtypeSelect"
                        v-on:rating-onlycontent="ratingOnlycontent"></ratingselect>
        </div>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-for="(rating,index) in food.ratings" :key="index" class="rating-item"
                v-show="needShow(rating.rateType,rating.text)">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" class="avater">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <div class="desc">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}">
                </span><span class="text">{{rating.text}}</span>
              </div>
            </li>
          </ul>
          <div class="np-ratings" v-show="!food.ratings || !food.ratings.length">
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BScroll from 'better-scroll';
  import Cartcontrol from '../cartcontrol/cartcontrol';
  import Split from '../split/split';
  import Ratingselect from '../ratingselect/ratingselect';
  import {formatDate} from 'common/js/date';
  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    methods: {
      cartAdd() {
        this.$emit('cart-add', event.target);
      },
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = true;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      addCart(event) {
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.$emit('cart-add', event.target);
      },
      needShow(type, text) {
        if (this.onlyContent && !text) {
          return false;
        } else if (this.selectType === ALL) {
          return true;
        } else {
          return type === this.selectType;
        }
      },
      ratingtypeSelect(type) {
        this.selectType = type;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      },
      ratingOnlycontent(content) {
        this.onlyContent = content;
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {Ratingselect, Cartcontrol, Split}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .food
    width: 100%
    z-index: 5
    position: fixed
    top: 0
    left: 0
    bottom: 48px
    background: white
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    &.move-enter-active, &.move-leave-active
      transition: all .2s linear
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100% //padding相对宽度计算百分比
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 20
          color: white
    .content, .info
      padding: 18px
    .content
      position: relative
      .name
        margin: 0
        font-size: 14px
        line-height: 14px
        font-weight: 700
        color: rgb(7, 17, 27)
      .extra
        margin: 8px 0 18px 0
        font-size: 0
        line-height: 10px
        .count, .rating
          font-size: 10px
          color: rgb(147, 153, 159)
        .count
          margin-right: 12px
      .price
        line-height: 24px
        font-weight: 700
        .now
          margin-right: 8px
          font-size: 14px
          color: rgb(240, 20, 20)
        .old
          text-decoration: line-through
          font-size: 10px
          color: rgb(147, 153, 159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .pay
        position: absolute
        right: 18px
        bottom: 18px
        box-sizing: border-box
        padding: 0 12px
        border-radius: 12px
        height: 24px
        line-height: 24px
        font-size: 10px
        color: rgb(255, 255, 255)
        background-color: rgb(0, 160, 220)
    /*&.fade-enter, &.fade-leave-to*/
    /*opacity: 0*/
    /*&.fade-enter-active, &.fade-leave-active*/
    /*transition: all .2s*/
    .info, .rating
      .name
        margin: 0 0 6px 0
        font-size: 14px
        line-height: 14px
        color: rgb(7, 17, 27)
    .info
      .text
        padding: 0 8px
        font-size: 12px
        color: rgb(77, 85, 93)
        line-height: 24px
    .rating
      padding-top: 18px
      .name
        margin-left: 18px
    .rating-wrapper
      padding: 0 18px
      .rating-item
        padding: 16px 0
        border-1px(rgba(7, 17, 21, 0.1))
        //font-size: 0
        //margin-bottom: 6px
        .time
          font-size: 10px
          color: rgb(147, 153, 159)
          line-height: 12px
          margin-bottom: 6px
        .user
          line-height: 12px
          position: absolute
          top: 16px
          right: 0
          font-size: 0
          .name
            display: inline-block
            margin-right: 6px
            font-size: 10px
            color: rgb(147, 153, 159)
          .avater
            vertical-align: top
            height: 12px
            width: 12px
            border-radius: 50%
        .desc
          .text
            line-height: 16px
            font-size: 12px
            color: rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            font-size: 12px
            line-height: 16px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)
</style>
