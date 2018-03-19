<template>
  <div class="events content">
    <h2 class="events-setting">
      <span class="setting-title-text">事件配置</span>
      <div class="times">
        <div class="times-year" @click="setYear">{{obj.year}}年<i class="chiyun icon-more-down-small"></i></div>
        <DatePicker
          ref="year"
          v-model="year"
          type="year"
          align="center"
          placeholder="选择年"
          format="yyyy"
          :clearable="false"
          @change="timeChagne">
        </DatePicker>
      </div>
      <div class="add-events" @click="showAddEvents=true">快速创建<i class="chiyun icon-tianjia"></i></div>
    </h2>
    <h2 class="events-kanban-year">
      <span class="kanban-title-text">年度事件看板</span>
      <span class="kanban-events">全部事件<i class="chiyun icon-more-down-small"></i></span>
    </h2>
    <!-- <AddEvents :show="showAddEvents" @close="showAddEvents=false" @upDateEvent="addEvents"/> -->
    <div class="date-content" >
      <!-- <div class="events-show" @mouseenter="clearTimer" @mouseleave="hideEvents" v-show="activeDateEvents.length > 0">
        <template v-for="(item, index) in activeDateEvents">
          <p class="events-show-title"><span class="events-name">{{item.name}}</span>
            <span class="events-show-tag" v-show="item.status === 2">未开始</span>
            <span class="events-show-tag" v-show="item.status === 1">进行中</span>
            <span class="events-show-tag" v-show="item.status === 0" style="background-color: #fa8d59">已完成</span>
            <span class="events-show-delete chiyun icon-X" @click="deleteEvents(item)"></span>
          </p>
          <p class="events-show-time">{{item.date}}</p>
          <p class="events-show-prompt" v-html="item.description"></p>
        </template>
      </div> -->
      <date class="date-div"
            ref="month"
            v-if="monkeys.length > 0"
            v-for="(item, index) in monkeys"
            :key="`month${index+1}`"
            :class="{'first-item': index % 4 === 0}"
            :year="obj.year"
            :item="item"
            @showEvents="showEvents"
            @hideEvents="hideEvents"
      ></date>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { DatePicker } from "element-ui";
import date from "./date.vue";
// import AddEvents from "./events-add";
import { getShopEvents, deleteShopEvent } from "api/sycm";

export default {
  components: {
    DatePicker,
    // AddEvents,
    date
  },
  data() {
    return {
      showAddEvents: false,
      year: new Date(),
      obj: {
        shop_id: this.$route.query.shop_id || "102387057",
        year: 2018
      },
      monkeys: [
        { key: "一月", value: "-01-01" },
        { key: "二月", value: "-02-01" },
        { key: "三月", value: "-03-01" },
        { key: "四月", value: "-04-01" },
        { key: "五月", value: "-05-01" },
        { key: "六月", value: "-06-01" },
        { key: "七月", value: "-07-01" },
        { key: "八月", value: "-08-01" },
        { key: "九月", value: "-09-01" },
        { key: "十月", value: "-10-01" },
        { key: "十一月", value: "-11-01" },
        { key: "十二月", value: "-12-01" }
      ],
      activeDateEvents: [],
      now: new Date()
    };
  },
  methods: {
    _getShopEvents() {
      getShopEvents(this.obj).then(res => {
        this.addEvents(res.data.data.result);
      });
    },
    timeChagne(event) {
      this.obj.year = event.getFullYear();
      // 重置月份，更新DOM
      let monkeys = this.monkeys;
      this.monkeys = [];
      setTimeout(() => {
        this.monkeys = monkeys;
      });
      this._getShopEvents();
    },
    setYear() {
      this.$refs.year.focus();
    },
    showEvents(event) {
      clearTimeout(this.addTimer);
      clearTimeout(this.timer);
      this.addTimer = setTimeout(() => {
        let events = event.srcElement.getAttribute("data-events");
        if (!events) {
          this.activeDateEvents = [];
          return;
        }
        this.activeDateEvents = JSON.parse(events);
        let width = document.body.offsetWidth;
        // let height = document.body.offsetHeight
        let clientX = event.clientX;
        let clientY = event.clientY;
        let x = clientX;
        x += clientX > width / 2 ? -220 : 20;
        let y = clientY - 120;
        const eventsBox = document.querySelector(".events-show");
        eventsBox.style.left = `${x}px`;
        eventsBox.style.top = `${y}px`;
      }, 300);
    },
    clearTimer() {
      clearTimeout(this.addTimer);
      clearTimeout(this.timer);
    },
    hideEvents() {
      this.timer = setTimeout(() => {
        this.activeDateEvents = [];
      }, 1000);
    },
    addEvents(params) {
      let length = params.length;
      for (let i = 0; i < length; i++) {
        let item = params[i];
        let color = item.color;
        let date1 = new Date(item.start_date);
        let date2 = new Date(item.end_date);
        let len = (date2 - date1) / 1e3 / 24 / 60 / 60 + 1; // 活动的天数
        for (let i = 0; i < len; i++) {
          let _class = ".date-" + date1.toJSON().slice(0, 10);
          let nodeList = document.querySelectorAll(_class);
          if (nodeList.length === 0) {
            break;
          }
          nodeList.forEach(node => {
            node.style.backgroundColor = color;
            node.style.cursor = "default";
            let events = [];
            let data = node.getAttribute("data-events");
            if (data) {
              // 获取已有事件
              events = JSON.parse(data);
            }
            let ids = [...new Set(Array.from(events, i => i.id))];
            if (ids.indexOf(item.id) > -1) {
              return;
            }
            let start = item.start_date + " 00:00:00";
            start = new Date(start);
            let end = item.end_date + " 23:59:59";
            end = new Date(end);
            let now = this.now;
            let status;
            if (end < now) {
              status = 0; // 已完成
            } else if (start > now) {
              status = 2; // 未开始
            } else {
              status = 1; // 进行中
            }
            events.push({
              name: item.name,
              date: `${item.start_date.replace(
                /-/g,
                "."
              )}-${item.end_date.replace(/-/g, ".")}`,
              description: item.description,
              id: item.id,
              status,
              class: _class
            });
            node.setAttribute("data-events", JSON.stringify(events));
          });
          date1.setDate(date1.getDate() + 1);
        }
      }
    },
    deleteEvents(item) {
      deleteShopEvent({
        ...this.obj,
        name: item.name
      }).then(res => {
        this.$message.success(res.data.msg);
        let nodeList = document.querySelectorAll(item.class);
        nodeList.forEach(node => {
          let data = node.getAttribute("data-events");
          let events = JSON.parse(data);
          events = events.filter(i => i.name !== item.name);
          let len = events.length;
          node.style.backgroundColor =
            len === 0 ? "#fff" : events[len - 1].color;
          node.setAttribute("data-events", JSON.stringify(events));
        });
      });
    }
  },
  mounted() {
    this._getShopEvents();
    this.obj.year = this.now.getFullYear();
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../../base/css/base.styl';

.date-content {
  position: relative;
  display: block;
  width: 1260px;
  padding: 0 50px;
  padding-top: 10px;
  font-size: 0;
  height: 850px;
  background-color: $color-white;

  .events-show {
    position: fixed;
    width: 200px;
    padding: 10px;
    border: 1px solid $line-gray;
    background-color: $color-white;
    box-shadow: 1px -1px 2px 1px $line-gray inset;
    z-index: 999;

    p {
      line-height: 25px;
      color: $text;
    }

    .events-show-title {
      margin-top: 20px;
      font-size: 14px;
      overflow: hidden;

      &:first-of-type {
        margin-top: 0;
      }

      .events-name {
        display: inline-block;
        max-width: 112px;
        vertical-align: top;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .events-show-tag {
        // float right
        // margin-top 3px
        padding: 0 2px;
        line-height: 18px;
        color: $color-white;
        background-color: red;
      }

      .events-show-delete {
        float: right;
        font-size: 12px;
        color: $color-prompt;
        filter: contrast(150%);
        cursor: pointer;

        &:hover {
          filter: contrast(100%);
        }
      }
    }

    .events-show-time {
      font-size: 12px;
    }

    .events-show-prompt {
      font-size: 12px;
      color: $prompt;
    }
  }

  .date-div {
    position: relative;
    width: 230px;
    height: 280px;
    margin-left: 80px;

    &.first-item {
      margin-left: 0px;
    }
  }
}

.events {
  .events-setting, .events-kanban-year {
    height: 50px;
    margin-top: 10px;
    padding: 0 30px;
    line-height: 50px;
    background-color: $color-white;
    display: box;
    display: flex;
    justify-content: space-between;
  }

  .events-setting {
    .title-text {
      font-size: 16px;
    }

    .times {
      position: relative;
      width: 240px;
      font-size: 12px;
      text-align: center;

      .times-year {
        position: relative;
        line-height: 50px;
        background-color: #fff;
        cursor: pointer;
        z-index: 2;
      }

      >>>.el-date-editor--year {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
    }

    .add-events {
      font-size: 12px;
      cursor: pointer;

      &:hover {
        color: $color-theme;
      }

      .icon-tianjia {
        font-size: 12px;
      }
    }
  }

  .events-kanban-year {
    margin-bottom: 1px;

    .kanban-title-text {
      font-size: 16px;
      font-weight: bold;
    }

    .kanban-events {
      font-size: 12px;
    }
  }
}

>>>.popper__arrow::after {
  transform: translateX(50px);
}
</style>
