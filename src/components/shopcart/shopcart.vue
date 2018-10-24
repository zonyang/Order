<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-wrapper" @click="toggleList">
          <div class="logo" :class="{'highlight':totalCount>0}">
            <span class="icon-shopping_cart"></span>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highlight':totalCount>0}">¥{{totalPrice}}</div>
        <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
      <div class="ball-wrapper">
        <transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-for="(ball,index) in balls" :key="index" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition-group>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <div class="title">购物车</div>
            <div class="empty" @click="deleteFoods">清空</div>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="(food, index) in selectFoods" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price*food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <Cartcontrol :food="food"></Cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow">
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Cartcontrol from '../cartcontrol/cartcontrol';
  import BScroll from 'better-scroll';

  export default {
    components: {Cartcontrol},
    props: {
      selectFoods: {
        type: Array,
        default() {
          return [];
        }
      },
      minPrice: {
        type: Number,
        default: 0
      },
      deliveryPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [
          {show: false, fly: false},
          {show: false, fly: false},
          {show: false, fly: false},
          {show: false, fly: false},
          {show: false, fly: false}
        ],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `¥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差¥${diff}元起送`;
        } else {
          return `去结算`;
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'no-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.totalFold();
          return false;
        }
        return !this.fold;
      }
    },
    methods: {
      totalFold() {
        this.fold = true;
      },
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      beforeEnter: function (el) {
        for (let count = 0; count < this.balls.length; count++) {
          let ball = this.balls[count];
          if (ball.show) {
            if (!ball.fly) {
              ball.fly = true;
              let rect = ball.el.getBoundingClientRect();
              let x = rect.left - 26;
              let y = -(window.innerHeight - 44 - rect.top);
              el.style.display = '';
              el.style.webkitTransform = `translate3d(0,${y}px,0)`;
              el.style.transform = `translate3d(0,${y}px,0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
              inner.style.transform = `translate3d(${x}px,0,0)`;
            }
          }
        }
      },
      enter: function (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeigth;
        // 重新渲染浏览器
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
        });
      },
      afterEnter: function (el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          ball.fly = false;
          el.style.display = 'none';
        }
      },
      toggleList: function () {
        if (!this.totalCount) {
          this.fold = true;
          return;
        }
        this.fold = !this.fold;
        if (!this.fold) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
      },
      deleteFoods: function () {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList: function () {
        this.fold = true;
      },
      pay: function () {
        if (this.totalPrice < this.minPrice) {
          return;
        }
        window.alert(`支付${this.totalPrice}元`);
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .shopcart
    position: fixed
    bottom: 0
    left: 0
    z-index: 10
    width: 100%
    height: 48px
    .content
      display: flex
      color: rgba(255, 255, 255, 0.4)
      background-color: #141d27
      .content-left
        flex: 1
        font-size: 0
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          width: 56px
          height: 56px
          margin: 0 12px
          padding: 6px
          box-sizing: border-box
          border-radius: 50%
          vertical-align: top
          background-color: #141d27
          .logo
            border-radius: 50%
            background: #2b343c
            height: 100%
            width: 100%
            text-align: center
            .icon-shopping_cart
              font-size: 24px
              color: #80858a
              line-height: 44px
            &.highlight
              background-color: rgb(0, 160, 220)
              .icon-shopping_cart
                color: rgb(255, 255, 255)
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            background-color: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
            text-align: center
            height: 16px
            line-height: 16px
            font-size: 9px
            color: rgb(255, 255, 255)
            font-weight: 700
            border-radius: 12px
        .price, .desc
          display: inline-block
          line-height: 24px
          font-size: 16px
          font-weight: 700
          margin-top: 12px
        .price
          margin-right: 12px
          &.highlight
            color: rgb(255, 255, 255)
        .desc
          padding: 0 12px
          border-left: 1px solid rgba(255, 255, 255, 0.1)
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          text-align: center
          font-size: 12px
          line-height: 48px
          height: 48px
          font-weight: 700
          &.not-enough
            background-color: #2b333b
          &.enough
            background-color: #00b43c
            color: #fff
      .ball-wrapper
        .ball
          position: fixed
          left: 32px
          bottom: 22px
          z-index: 100
          &.drop-enter-active
            transition: all .5s cubic-bezier(0.49, -0.29, 0.75, 0.41)
            .inner
              transition: all .5s linear
          .inner
            width: 16px
            height: 16px
            background: rgb(0, 160, 220)
            border-radius: 50%
      .shopcart-list
        z-index: -1
        position: absolute
        top: 0
        left: 0
        width: 100%
        /*font-size: 0*/
        background: white
        height: -100%
        transform: translate3d(0, -100%, 0)
        &.fold-enter, &.fold-leave-to
          transform: translate3d(0, 0, 0)
        &.fold-enter-active, &.fold-leave-active
          transition: all .5s
        .list-header
          background-color: #f3f5f7
          height: 40px
          line-height: 40px
          padding: 0 18px
          border-bottom: 1px solid rgba(7, 17, 27, 0.1)
          .title
            float: left
            font-size: 14px
            color: rgb(7, 17, 27)
          .empty
            float: right
            font-size: 12px
            color: rgb(0, 160, 220)
        .list-content
          max-height: 217px
          overflow: hidden
          padding: 0 18px
          .food
            position: relative
            padding: 12px 0
            //box-sizing: border-box
            //height: 48px
            border-1px(rgba(7, 17, 27, 0.1))
            .name
              line-height: 24px
              font-size: 14px
              color: rgb(7, 17, 27)
            .price
              position: absolute
              line-height: 24px
              right: 90px
              top: 12px
              font-size: 14px
              font-weight: 700
              color: rgb(240, 20, 20)
            .cartcontrol-wrapper
              position: absolute
              right: 0
              top: 6px
              line-height: 24px
    .list-mask
      position: fixed
      top: 0
      left: 0
      z-index: -2
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.6)
      // background: red
      backdrop-filter: blur(10px)
      opacity: 1
      &.fade-enter, &.fade-leave-to
        background: rgba(7, 17, 27, 0)
        opacity: 0
      &.fade-enter-active, &.fade-leave-active
        transition: .5s all
</style>
