<template>
  <div class="goods">
    <div ref="menuWrapper" class="menu-wrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}"
            @click="selectMenu(index)">
          <span class="text"><span class="icon" v-show="item.type > 0" :class="classMap[item.type]"></span>
          {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div ref="foodsWrapper" class="foods-wrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food, food_index) in item.foods" :key="food_index" class="food-item"
                @click="foodDetail(food)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
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
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"
              :select-foods="selectFoods"></shopcart>
    <food :food="selectFood" ref="food" v-on:cart-add="cartAdd"></food>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';

  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectFood: {},
        showFlag: false
      };
    },
    created() {
      this.$http.get('/api/goods').then(response => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      }, response => {
      });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      foodDetail(food) {
        this.selectFood = food;
        this.$refs.food.show();
      },
      selectMenu(index) {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[index];
        this.foodScroll.scrollToElement(el, 300);// 滚动到的目标元素, 滚动动画执行的时长
      },
      _initScroll() {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true,
          probeType: 3
        });
        this.foodScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          height += foodList[i].clientHeight;
          this.listHeight.push(height);
        }
      },
      cartAdd(target) {
        this.$refs.shopcart.drop(target);
      }
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          if (!this.listHeight[i + 1] || (this.scrollY >= this.listHeight[i] && this.scrollY < this.listHeight[i + 1])) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  }
  ;
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background-color: #f3f5f7
      .menu-item
        display: table
        padding: 0 12px
        height: 54px
        width: 56px
        line-height: 14px
        &.current
          position: relative
          top: -1px
          background: #fff
          font-weight: 700
          // z-index: 10
          .text
            border-none()
        .text
          display: table-cell
          font-size: 12px
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
        .icon
          display: inline-block
          margin-right: 4px
          width: 12px
          height: 12px
          background-size: 12px 12px
          background-repeat: no-repeat
          vertical-align: top
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.invoice
            bg-image('invoice_3')
          &.guarantee
            bg-image('guarantee_3')
          &.special
            bg-image('special_3')
    .foods-wrapper
      flex: 1
      font-size: 0
      .food-list
        .title
          padding-left: 14px
          border-left: 1px solid #d9dde1
          font-size: 12px
          color: rgb(147, 153, 159)
          line-height: 26px
          margin: 0
          background-color: #f3f5f7
        .food-item
          display: flex
          margin: 18px
          padding-bottom: 18px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none
            margin-bottom: 0
          .icon
            flex: 0 0 57px
            margin-right: 10px
          .content
            flex: 1
            .name
              margin: 2px 0 8px 0
              font-size: 14px
              //height: 14px
              color: rgb(7, 17, 27)
              line-height: 14px
            .desc, .extra
              font-size: 10px
              color: rgb(147, 153, 159)
              line-height: 10px
              height: 10px
            .desc
              display: inline
              line-height: 12px
            .extra
              margin: 8px 0 0 0
              font-size: 0
              .count
                margin-right: 12px
                font-size: 10px
              .rating
                font-size: 10px
            .price
              font-weight: 700
              line-height: 24px
              .now
                font-size: 14px
                color: rgb(240, 20, 20)
                margin-right: 8px
              .old
                font-size: 10px
                color: rgb(147, 153, 159)
                text-decoration: line-through
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 12px
</style>
