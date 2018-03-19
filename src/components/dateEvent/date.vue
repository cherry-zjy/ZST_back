<template>
  <div class="content">
    <div class="month">{{item.key}}</div>
     <div class="week-div">
       <span class="week-span" v-for="(item, index) in weekDatas"  :key="index">{{item}}</span>
       <span class="week-span"
             v-for="(item, index) in getMonth()"
             :key="index"
             :class="{'color-text':item.disable,['date-'+item.key]:true}"
             @mouseenter="$emit('showEvents', $event)"
             @mouseleave="$emit('hideEvents')"
       >{{item.number}}</span>
     </div>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      item: {
        item: Object,
        default: {
          key: '一月', value: '-01-01'
        }
      },
      year: {
        year: Number,
        default: 2018
      }
    },
    components: {
    },
    data() {
      return {
        weekDatas: ['日', '一', '二', '三', '四', '五', '六']
      }
    },
    methods: {
      getMonth() {
        let time = new Date(this.year + this.item.value)
        const day = time.getDay()
        const timeCurrent = time.toString()
        // 获得当前日期的 例如 2018-01-
        let currentPrevtoJSON = time.toJSON().slice(0, 8)
        // 获取下个月的时间
        const timeNext = new Date(time.setMonth(time.getMonth() + 1))
        // 获得前一个月 例如 2018-02-
        let MonSecondstoJSON = timeNext.toJSON().slice(0, 8)
        // console.log(MonSecondstoJSON)
        let MonSeconds = timeNext - (new Date(timeCurrent)).getTime()
        // 计算上个月到这个月有多少天
        let dates = parseInt(MonSeconds / 1000 / 24 / 60 / 60)
        // 计算后个月结束时间
        const timePrev = new Date(time.setMonth(time.getMonth() - 2))
        // 获得上个月的 例如 2017-12-
        let timePrevtoJSON = timePrev.toJSON().slice(0, 8)
        let monPrev = (new Date(timeCurrent)).getTime() - timePrev
        // 上个月 一共有多少天
        let datePrev = parseInt(monPrev / 1000 / 24 / 60 / 60)
        let dateDays = []
        for (let i = datePrev - day + 1; i <= datePrev; i++) {
          dateDays.push({number: i, key: timePrevtoJSON + i, disable: false})
        }
        for (let n = 1; n <= dates; n++) {
          let dateValue = currentPrevtoJSON + n
          if (n < 10) {
            dateValue = currentPrevtoJSON + 0 + n
          }
          dateDays.push({number: n, key: dateValue, disable: true})
        }
        let maxDate = (dates + day) > 35 ? (42 - (dates + day)) : (35 - (dates + day))
        // console.log(maxDate)
        for (let m = 1; m <= maxDate; m++) {
          dateDays.push({number: m, key: MonSecondstoJSON + 0 + m, disable: false})
        }
        // console.dir(dateDays)
        return dateDays
      }
    },
    mounted() {
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '../../../base/css/base.styl'
  .content
    background-color $color-white
    width 230px
    height 280px
    float left
    font-size 0
    .month
      width 100%
      height 32px
      line-height 32px
      color $color-theme-hover
      font-size 16px
    .week-div
      margin-left 5px
      width 100%
      height auto
    .week-span
       display inline-block
       height 32px
       text-align center
       width 32px
       line-height 32px
       font-size 12px
       color $color-content
       &.color-text
         color $color-text



</style>
