<template>
    <div class="time_choose">
        <div class="time_header"><span @click="nextYear" class="el-icon-d-arrow-left"></span><span @click="nextMonth" class="el-icon-arrow-left"></span><span class="time">{{year}}年{{month}}月</span><span @click="upMonth" class="el-icon-arrow-right"></span><span @click="upYear" class="el-icon-d-arrow-right"></span></div>
        <div class="time_table">
            <ul class="table_header">
                <li>周一</li>
                <li>周二</li>
                <li>周三</li>
                <li>周四</li>
                <li>周五</li>
                <li>周六</li>
                <li>周日</li>
            </ul>
            <ul class="table_context" 
                v-for="i in weeks" 
                :key="i" >
                <li v-for="j in [0,1,2,3,4,5,6]" :key="j" :class="`${calendarData[i*7+j].inmonth ? 'inmonth':'nomonth'}`"   >
                    {{calendarData[i*7+j].days}}
                </li>
            </ul>
         
            
        </div>
    </div>
</template>
<script>
export default {
    name:'adTime',
    props: {
        nowtime: {
            type: Number,
            default: new Date().getTime()
        },
    },

    data() {
        return {
            year:null,
            month:null,
            calendarData:[],
            weeks:[],
            beginPointDate: 1530374400000,
            endPointDate: 1533052799000,
            weeknow:0
        }
    },
    watch: {
        nowtime:{
             handler:function(newValue,oldval){
                let nowtime = new Date(parseInt(newValue))
                this.year = nowtime.getFullYear()
                this.month = nowtime.getMonth()+1
                let paramyear = nowtime.getFullYear();
                let parammonth = this.transformString((nowtime.getMonth() + 1).toString());
                this.getDayTime(paramyear,parammonth)
            },
            deep:true,
            immediate:true
           
        }
    },
    created(){
        this.handleDateData()
    },
    methods: {
        // 获取开始结束时间
        getDayTime(paramyear,parammonth){
            this.beginPointDate = (new Date(paramyear,parammonth-1,1,0,0,0,0)).getTime();
            this.endPointDate = (new Date(paramyear,parammonth,0,0,0,0,0)).getTime() + 86399000;
        },
        // 日期字符串转换
        transformString (str) {
            if (str.length < 2) {
                str = '0' + str
            } 
            return str;
        },
         // 日期数字格式化
        formatNumber(month){
            let result;
            if( month < 10 ){
                result = '0' + month.toString();
            }else{
                result = month;
            }
            return result.toString();
        },
        // 填充日历数据
        handleDateData(){
            let begin = new Date(this.beginPointDate);
            let beginDate = this.beginPointDate - 24*3600*1000*(begin.getDay()-1) ;
            let end = new Date(this.endPointDate);
            let endDate = this.endPointDate + 7*24*3600*1000 - 24*3600*1000*end.getDay();
            let weeks = [];
            let weekIndex = -1;
            let dayIndex = -1;
            let calendars = [];
            let thisDate = beginDate;
            while( thisDate <= endDate ){
                let eachDay = {};
                let thisDay = new Date(thisDate)
                eachDay.timenumber = thisDate;
                //日期信息
                eachDay.year = (new Date(thisDate)).getFullYear();
                eachDay.month = this.formatNumber((new Date(thisDate)).getMonth() + 1);
                eachDay.days = this.formatNumber((new Date(thisDate)).getDate());
                eachDay.day = new Date(thisDate).getDay()+''
                //是否选中
                let curDate = eachDay.year + '-' + eachDay.month + '-' + eachDay.days;
                if( curDate == this.curDate ){
                    eachDay.active = true;
                    this.initDay = dayIndex;
                }
                //是否位于考勤月范围
                if( thisDate < this.beginPointDate || thisDate > this.endPointDate ){
                    eachDay.inmonth = false;
                }else{
                    eachDay.inmonth = true;
                }
                //起始日期
                if( thisDate == this.beginPointDate ){
                    eachDay.isbegin = true;
                }else{
                    eachDay.isbegin = false;
                }
                //截止日期
                if( thisDate == this.endPointDate){
                    eachDay.isend = true;
                }else{
                    eachDay.isend = false;
                }
                //第几周
                if( thisDay.getDay() % 7 == 0 ){
                    weekIndex ++;
                    weeks.push(weekIndex);
                }
                if ( this.day == eachDay.days && eachDay.month == this.month) {
                    this.weeknow = weekIndex
                }
                //第几天
                dayIndex ++;
                //是否周末
                if(eachDay.day == '0' || eachDay.day == '6'){
                    eachDay.isweekend = true;
                } else {
                    eachDay.isweekend = false;
                }
                //今天
                let nowYear = (new Date()).getFullYear();
                let nowMonth = (new Date()).getMonth()+1;
                let nowDay = (new Date()).getDate();
                if( eachDay.year == nowYear && parseInt(eachDay.month) == nowMonth && parseInt(eachDay.days) == nowDay ){
                    eachDay.istoday = true;
                }else{
                    eachDay.istoday = false;
                }
                //天数下标 +1
                calendars.push(eachDay);
                thisDate += 24*3600*1000;
            }
            this.calendarData = calendars;
            this.weeks = weeks;
        },
        sendData(){
            this.$emit('updateTime',new Date(this.year,this.month-1).getTime())
        },
         // 年+
        upYear(){
            this.year++
            this.getDayTime(this.year,this.month)
            this.sendData()
        },
        //年-
        nextYear() {
            this.year--
            this.getDayTime(this.year,this.month)
            this.sendData()
        },
        // 月+
        upMonth(){
            this.month === 12 ? this.month = 1 :  this.month++
            if(this.month === 1){
                this.year++ 
            }
            this.getDayTime(this.year,this.month)
            this.sendData()
             this.handleDateData()
        },
        //月-
        nextMonth() {
            this.month === 1 ? this.month = 12 :  this.month--
           if(this.month === 12 ){
                this.year--
           }
            this.getDayTime(this.year,this.month)
            this.sendData()
            this.handleDateData()
        }
    },
}
</script>
<style lang="scss" scoped>
.time_choose{
    width: 100%;
    .time_header{
        text-align: center;
        margin-top: 20px;
         span{
            margin: 0 6px;
            color: #333;
            cursor: pointer;
            &.time{
                display: inline-block;
                width:80px ;
            }
            &.time:hover{
                color: #333;
                font-weight: 400;
            }
            &:hover{
                color: royalblue;
                font-weight: 700;
            }
        }

    }
    .time_table{
        overflow: hidden;
        margin-top: 20px;
        border:1px solid #eee;
        .table_header, .table_context{
            overflow: hidden;
            border-bottom: 1px solid #eee;
            &:last-child{
                    border: 0;
            }
            li{
                width: 14%;
                float: left;
                line-height: 40px;
                text-align: center;
                border-right: 1px solid #eee;
                &.inmonth{
                    color: #333;
                }
                 &.nomonth{
                    color: #999;
                }
                &:last-child{
                    border: 0;
                }
            }
           
        }
    }
   
}
</style>