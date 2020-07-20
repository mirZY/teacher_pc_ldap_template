<template >
  <section class="adtableitem">
    <ul  v-for="(item,index) in zuhe" :key="index">
      <li  v-for="(it,indexs) in item" :key='indexs' :class="`${color(it)} ${it&&it.other_city&&it.other_city==5?'city':''}`" >
      </li>
    </ul>
  </section>
</template>
<script>
export default {
  name: "ATableItem",
  props: {
    index:{
      type:[String,Number],
      default:0
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      zuhe: []
    };
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(newValue, oldValue) {
        this.choose();
      }
    }
  },
  methods: {
    color(item) {
      let colorClass = {
        "1": "lesson",
        "2": "booklesson",
        "3": "nobook",
        "5": "city",
        "9": "timeout",
        "10": "confict"
      };
      if (item) {
        return colorClass[item.schedule_type];
      } else {
        return "kong";
      }
    },
    choose() {
      let zuhe = [];
        zuhe.length = 5
      for (let index = 0; index < zuhe.length; index++) {
           zuhe[index] = []
      }
      zuhe.forEach((items,index)=>{
            let filterData = this.value.length>0&&this.value.filter(item =>{
              if(item.schedule_type == 4){
                return true
              }else
              if(index == 4){
                return 18<=new Date(item.begin_time * 1000).getHours() 
              }else if(index == 3){
                return 15<=new Date(item.begin_time * 1000).getHours() && new Date(item.begin_time * 1000).getHours()<18
              }else if(index == 2){
                return 12<=new Date(item.begin_time * 1000).getHours() && new Date(item.begin_time * 1000).getHours()<15
              } {
                return 8+(index*2)<=new Date(item.begin_time * 1000).getHours() && new Date(item.begin_time * 1000).getHours()<10+index*2 
              } 
            })
           zuhe[index].length =  filterData.length>0 && Math.max(filterData.map(item=>{
             return parseInt(item.teacher_num)
           })) == 2 ? 2 : 4
           filterData.length>0&&filterData.forEach(item =>{
             if(item.schedule_type == 4){
                zuhe[index].length = 4
                zuhe[index].fill({})
             }else
              if(zuhe[index].length == 4){
                if((item.role_type == 3 || item.role_type == 2)  ){
                    zuhe[index].length = 4
                    zuhe[index].role_type ? '':zuhe[index].fill(item)
                }else
                if(item.teacher_num == 4){
                   if(item.schedule_sort == 2 ){
                      zuhe[index][item.schedule_sort] = item
                    } else if(item.schedule_sort == 3){
                      zuhe[index][1] = item
                    }else {
                        zuhe[index][item.schedule_sort-1] = item
                    }
                }else if(item.teacher_num == 3) {
                  zuhe[index][item.schedule_sort-1] = {}
                } else {
                   zuhe[index].length = 4
                   zuhe[index].fill(item)
                }
               
              } else {
                if(item.role_type == 3 || item.role_type == 2){
                  zuhe[index][0] = item
                  zuhe[index][1] = item
                } else {
                  zuhe[index][item.schedule_sort-1] = item
                }
              }
            })
      })
      this.zuhe = [...zuhe];
    }
  }
};
</script>
<style lang="scss" scoped>
.lesson {
  background: #a9c1ff;
}
.booklesson {
  background: #dde6ff;
}
.city {
  background: #cccccc;
}
.nobook {
  background: #ececec;
}
.confict {
  background: #e77878;
}
.timeout {
  background: #ffb154;
}
.adtableitem {
  width: 100%;
  ul{
    display: flex;
    line-height:41px ;
    height: 41px;
    &:first-child{
      margin-top: -1px;
    }
    &:nth-child(4){
      margin-top: -1px;
    }
    li{
      &:first-child{
        border-left: 0;
      }
      width: 100%;
      border-left: 1px dotted #ddd ;
      border-bottom: 1px dotted #ddd ;
    }
  }
}
</style>