<template>
  <div class="ratings" ref="ratings"><!--父元素高度固定 -->
    <div class="scroll"><!-- 子元素高度随内容撑开且高度大于父元素 -->
      <div class="overview">
        <div class="overview-left">
          <div class="score">{{seller.score}}</div>
          <div class="title">综合评分</div>
          <div class="rank-rate">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType"
                    :ratings="ratings"
                    :only-content="onlyContent"
                    :desc="desc" v-on:ratingtype-select="ratingtypeSelect"
                    v-on:rating-onlycontent="ratingOnlycontent"></ratingselect>
      <div class="rating-wrapper">
        <ul v-show="ratings && ratings.length">
          <li v-for="(rating,index) in ratings" :key="index" class="rating-item"
              v-show="needShow(rating.rateType,rating.text)">
            <div class="avater">
              <img :src="rating.avatar">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}">
                  </span>
                <span class="item" v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
              </div>
            </div>
          </li>
        </ul>
        <div class="np-ratings" v-show="!ratings || !ratings.length">
        </div>
      </div>
      <!--<shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"-->
      <!--:select-foods="selectFoods"></shopcart>-->
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import split from '../split/split';
  import ratingselect from '../ratingselect/ratingselect';
  import {formatDate} from 'common/js/date';
  import star from '../star/star';
  import shopcart from '../shopcart/shopcart';
  import BScroll from 'better-scroll';
  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;
  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '满意',
          negative: '不满意'
        }
      };
    },
    created() {
      this.$http.get('api/ratings').then(response => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            this._initScroll();
            // this.scroll = new BScroll(this.$refs.ratings, {
            //   click: true
            // });
          });
        }
      });
    },
    filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    // computed: {
    //   selectFoods() {
    //     // let foods = [];
    //     // this.goods.forEach((good) => {
    //     //   good.foods.forEach((food) => {
    //     //     if (food.count) {
    //     //       foods.push(food);
    //     //     }
    //     //   });
    //     // });
    //     return [];
    //   }
    // },
    methods: {
      _initScroll() {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        });
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
    components: {shopcart, star, split, ratingselect}
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratings
    position: absolute
    top: 174px
    bottom: 0
    right: 0
    left: 0 //固定视口高度
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        text-align: center
        flex: 0 0 137px
        width: 137px
        border-right: 1px solid rgb(147, 153, 159)
        padding: 6px 0
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          font-size: 24px
          line-height: 28px
          color: rgb(255, 153, 0)
        .title
          font-size: 12px
          line-height: 12px
          color: rgb(7, 17, 27)
          margin-bottom: 8px
        .rank-rate
          font-size: 10px
          line-height: 10px
          color: rgb(147, 153, 159)
      .overview-right
        flex: 1
        padding: 0 18px
        font-size: 0
        @media only screen and (max-width: 320px)
          padding: 0 6px
        .score-wrapper
          margin-bottom: 8px
          .title
            vertical-align: top
            display: inline-block
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .star
            vertical-align: top
            display: inline-block
            margin: 0 12px
          .score
            vertical-align: top
            line-height: 18px
            display: inline-block
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            font-size: 12px
            line-height: 18px
            color: rgb(7, 17, 27)
          .time
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        padding: 18px 0
        border-1px(rgba(7, 17, 21, 0.1))
        display: flex
        .avater
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            height: 28px
            width: 28px
            border-radius: 50%
        .content
          flex: 1
          // padding-left: 40px
          .name
            line-height: 12px
            color: rgb(7, 17, 27)
            margin: 0 0 4px
            font-size: 10px
            font-weight: 200
          .time
            font-size: 10px
            position: absolute
            top: 18px
            right: 0
            color: rgb(147, 153, 159)
          .star-wrapper
            margin-bottom: 6px
            .star
              display: inline-block
              margin-right: 6px
            .delivery
              font-size: 10px
              line-height: 12px
              color: rgb(147, 153, 159)
          .text
            margin: 0 0 4px
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .recommend
            font-size: 0
            .icon-thumb_up, .icon-thumb_down
              vertical-align: top
              margin-top: 4px
              display: inline-block
              font-size: 12px
              line-height: 18px
            .icon-thumb_up
              color: rgb(0, 160, 220)
            .icon-thumb_down
              color: rgb(147, 153, 159)
            .item
              margin-top: 4px
              display: inline-block
              vertical-align: top
              // text-align: middle
              padding: 0 6px
              border: 1px solid rgba(7, 17, 27, 0.1)
              border-radius: 1px
              color: rgb(147, 153, 159)
              backgroud: #fff
              font-size: 9px
              margin-left: 8px
              line-height: 16px
</style>
