<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span class="block positive" :class="{'active':selectType===2}" @click="select(2)">{{desc.all}}<span
        class="count">{{ratings.length}}</span></span>
      <span class="block positive" :class="{'active':selectType===0}" @click="select(0)">{{desc.positive}}<span
        class=" count">{{positives.length}}</span></span>
      <span class="block negative" :class="{'active':selectType===1}" @click="select(1  )">{{desc.negative}}<span
        class=" count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent===true}">
      <span class="icon-check_circle" @click="toggleContent"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;
  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      },
      positives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      }
    },
    methods: {
      select(type) {
        this.$emit('ratingtype-select', type);
      },
      toggleContent() {
        if (this.onlyContent) {
          this.$emit('rating-onlycontent', false);
        } else {
          this.$emit('rating-onlycontent', true);
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratingselect
    .rating-type
      margin: 0 18px
      padding: 18px 0
      font-size: 0
      border-1px(rgba(7, 17, 21, 0.1))
      .block
        display: inline-block
        border-radius: 2px
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        &.positive
          background-color: rgba(0, 160, 220, 0.2)
          &.active
            background-color: rgb(0, 160, 220)
        &.negative
          background-color: rgba(77, 85, 93, 0.2)
          &.active
            background-color: rgb(77, 85, 93)
        .count
          margin-left: 1px
          font-size: 8px

  .switch
    border-1px(rgba(7, 17, 21, 0.1))
    padding: 12px 18px
    font-size: 0
    line-height: 24px
    color: rgb(147, 153, 159)
    &.on
      .icon-check_circle
        color: #00c850
    .icon-check_circle
      display: inline-block
      vertical-align: top
      margin-right: 4px
      font-size: 24px
    .text
      display: inline-block
      font-size: 12px
</style>
