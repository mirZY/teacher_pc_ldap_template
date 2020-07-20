<template>
  <div class="form-list">
    <el-form
      :model="personalRuleForm"
      :rules="otherRules"
      label-position="left"
      label-width="80px"
      :validate-on-rule-change="false"
      ref="personalRuleForm"
    >
      <!-- 利润中心 -->
      <div class="box-border">
        <p class="personal-title">利润中心</p>
        <div class="personal-style">
          <el-form-item label="利润中心" size="mini" prop="lirun">
            <el-select
              v-if="showEdit"
              :disabled="cityChange"
              v-model="personalRuleForm.lirun"
              class="select-style"
              placeholder="请选择利润中心"
            >
              <el-option
                v-for="item in profitData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-if="!showEdit">{{personalRuleForm.lirun_name || '-'}}</span>
          </el-form-item>
          <el-form-item label="支援利润中心" size="mini" prop="zhiyuan" label-width="100px">
            <el-select
              v-if="showEdit"
              multiple
              v-model="personalRuleForm.zhiyuanlirun"
              class="select-style"
              placeholder="请选择支援利润中心，可多选"
            >
              <el-option
                v-for="item in profitData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-if="!showEdit">{{personalRuleForm.zhiyuanlirun_name || '-'}}</span>
          </el-form-item>
        </div>
      </div>

      <!-- 授课城市 -->
      <div class="box-border">
        <p class="personal-title">授课城市</p>
        <div class="personal-style">
          <el-form-item label="城市" size="mini" prop="city" label-width="55px">
            <el-select
              v-if="showEdit"
              filterable
              :disabled="cityChange"
              v-model="personalRuleForm.city"
              class="select-style select-city"
              placeholder="请选择授课城市"
            >
              <el-option
                v-for="item in schoolData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-if="!showEdit">{{personalRuleForm.city_name || '-'}}</span>
          </el-form-item>
          <el-form-item label="支援城市" size="mini" prop="zhiyuanCity" label-width="70px">
            <el-select
              v-if="showEdit"
              filterable
              v-model="personalRuleForm.zhiyuanCity"
              class="select-style"
              multiple
              placeholder="请选择支援城市，可多选"
            >
              <el-option
                v-for="item in schoolData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-if="!showEdit">{{personalRuleForm.zhiyuanCity_name || '-'}}</span>
          </el-form-item>
        </div>
      </div>

      <!-- 教师风采 -->
      <div class="box-border">
        <p class="personal-title">教师风采</p>
        <div class="personal-style">
          <el-form-item
            label="角色"
            size="mini"
            prop="role_type"
            class="item-common"
            label-width="55px"
          >
            <el-checkbox-group
              class="teacher-role"
              v-if="showEdit"
              v-model="personalRuleForm.role_type"
              @change="changeRoleType"
            >
              <el-checkbox label="1">主讲</el-checkbox>
              <el-checkbox label="2">班主任</el-checkbox>
              <el-checkbox label="3">助教</el-checkbox>
            </el-checkbox-group>
            <span v-if="!showEdit" class="teacher-role">
              <span v-if="personalRuleForm.role_type && personalRuleForm.role_type.length!=0">
                <span v-for="(item,index) in personalRuleForm.role_type" :key="index">
                  {{item == '1'?'主讲':(item == '2'?'班主任':'助教')}}
                  <span
                    v-if="index<personalRuleForm.role_type.length-1"
                  >、</span>
                </span>
              </span>
              <span v-else>-</span>
            </span>
          </el-form-item>
          <el-form-item label="授课学科" size="mini" prop="class">
            <el-select
              v-if="showEdit"
              multiple
              v-model="personalRuleForm.class"
              class="select-style"
              placeholder="请选择授课学科"
            >
              <el-option
                v-for="item in subjectsData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-if="!showEdit">
              <span v-if="personalRuleForm.class_name && personalRuleForm.class_name.length!=0">
                <span
                  v-for="item in personalRuleForm.class_name"
                  :key="item.id"
                >{{item?item+' ':'-'}}</span>
              </span>
              <span v-else>-</span>
            </span>
          </el-form-item>
          <el-form-item label="授课项目" size="mini" prop="project">
            <el-select
              v-if="showEdit"
              multiple
              filterable
              v-model="personalRuleForm.project"
              class="select-style"
              placeholder="请选择授课项目，可多选"
            >
              <el-option
                v-for="item in itemidsData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-if="!showEdit">
              <!-- <span v-if="personalRuleForm.project_name && personalRuleForm.project_name.length!=0">
                <span v-for="item in personalRuleForm.project_name" :key="item.id">{{item}}</span>
              </span>-->
              <span v-if="personalRuleForm.project_name">{{personalRuleForm.project_name}}</span>
              <span v-else>-</span>
            </span>
          </el-form-item>
          <el-form-item label="授课年级" size="mini" prop="grade">
            <el-select
              v-if="showEdit"
              multiple
              v-model="personalRuleForm.grade"
              class="select-style"
              placeholder="请选择授课年级，可多选"
            >
              <el-option
                v-for="item in gradeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-if="!showEdit">
              <!-- <span v-if="personalRuleForm.grade_name&&personalRuleForm.grade_name.length!=0">
                <span v-for="item in personalRuleForm.grade_name" :key="item.id">{{item}}</span>
              </span>-->
              <span v-if="personalRuleForm.grade_name">{{personalRuleForm.grade_name}}</span>
              <span v-else>-</span>
            </span>
          </el-form-item>
          <el-form-item
            label="教师等级"
            size="mini"
            prop="teacher_level"
            v-if="addstatus != 'addTeacher' && personalRuleForm.role_type.indexOf('1') !=-1 "
          >
            <el-select
              v-if="showEdit"
              v-model="personalRuleForm.teacher_level"
              class="select-style"
              placeholder="请选择教师等级"
            >
              <el-option
                v-for="item in levelTeacher"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-if="!showEdit">{{personalRuleForm.teacher_level_name || '-'}}</span>
          </el-form-item>
          <el-form-item
            label="助教等级"
            size="mini"
            prop="assistant_level"
            v-if="addstatus != 'addTeacher' && personalRuleForm.role_type.indexOf('3') !=-1 && teacherDetail.staff_type != 1"
          >
            <el-select
              v-if="showEdit"
              v-model="personalRuleForm.assistant_level"
              class="select-style"
              placeholder="请选择助教等级"
            >
              <el-option
                v-for="item in assistantTeacherLevel"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <span v-if="!showEdit">{{personalRuleForm.assistant_level_name || '-'}}</span>
          </el-form-item>
          <el-form-item label="教师照片" size="mini" prop="picture" class="item-common">
            <div v-if="showEdit" class="teacher-picture">
              <el-upload
                class="avatar-uploader"
                :action="$qiniu"
                :data="{token:qiniu_token}"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-exceed="handleExceed"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <span v-if="imageUrl">
                <el-button icon="el-icon-search" circle @click="handlePictureCardPreview"></el-button>
                <el-button icon="el-icon-delete" circle @click="imageUrl=''"></el-button>
              </span>
              <span class="picter-style" v-if="!imageUrl">
                请上传老师的半身照
                <br />比例为1:1大小不超过5MB
              </span>
            </div>
            <span v-if="!showEdit">
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <span v-else>-</span>
            </span>
          </el-form-item>
          <el-form-item label="教师视频" size="mini" class="item-common">
            <div v-if="showEdit" class="teacher-picture">
              <el-upload
               v-if="!videoForm.Video && !videoForm.playVideo && !videoFlag"
                class="avatar-uploader el-upload--text"
                ref="upload"
                action="filename"
                :http-request="httpRequest"
                :show-file-list="false">
                <i v-if="videoFlag == false"
                  class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
               <el-progress
                  v-if="videoFlag == true"
                  type="circle"
                  :percentage="videoUploadPercent"
                  class="video-progress"
                ></el-progress>
              <div v-if="videoForm.Video && !videoForm.playVideo && !videoFlag" class="video-zhuanma">视频转码中</div>
              <video
                  v-if="videoForm.playVideo && !videoFlag"
                  :src="videoForm.playVideo"
                  class="avatar"
                  controls="controls"
                >您的浏览器不支持视频播放</video>
              <el-button
                icon="el-icon-delete"
                circle
                @click="deleteVideo"
                v-if="videoForm.Video || videoFlag"
                class="video-del"
              ></el-button>
              <span class="picter-style" v-if="!videoForm.Video && !videoFlag">请上传老师的宣传视频<br>
                MP4、MOV格式且不超过700MB</span>

            </div>
            <span v-if="!showEdit">
              <video
                v-if="videoForm.playVideo"
                :src="videoForm.playVideo"
                class="avatar"
                controls="controls"
              >您的浏览器不支持视频播放</video>
                <div v-else-if="videoForm.Video && !videoForm.playVideo" class="video-zhuanma">视频转码中</div>
              <span v-else>-</span>
            </span>
          </el-form-item>
          <el-form-item label="教师标签" size="mini" prop="tag" class="item-common">
            <!-- <span
              class="is_required"
              v-if="showTagRole"
            >*</span> -->

            <div v-if="showEdit">
              <el-tag
                v-for="(tag,index) in dynamicTags"
                :key="'tag'+index"
                closable
                :disable-transitions="false"
                @close="tabHandleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="tabInputVisible"
                v-model="tabInputValue"
                placeholder="添加至少1个标签，8个字以内"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="tabInputConfirm"
                @blur="tabInputConfirm"
              ></el-input>
              <el-button
                v-show="!tabInputVisible && dynamicTags.length<4"
                class="button-new-tag"
                size="small"
                @click="tabShowInput"
              >+ 新标签</el-button>
            </div>
            <span v-if="!showEdit">
              <span v-if="dynamicTags.length!=0">
                <el-tag :key="'tag'+ index" v-for="(tag,index) in dynamicTags">{{tag}}</el-tag>
              </span>
              <span v-else>-</span>
            </span>
            <!-- <span class="is_required_msg" v-if="showTagRole_msg">请填写教师标签</span> -->
          </el-form-item>
          <el-form-item label="教师介绍" size="mini" prop="jieshao" class="item-common">
            <el-input
              v-if="showEdit"
              v-model="personalRuleForm.jieshao"
              type="textarea"
              :rows="6"
              placeholder="学历、经历、成果"
            ></el-input>
            <span
              v-if="!showEdit"
              class="text-wrapper"
              v-html="personalRuleForm.jieshao_msg || '-'"
            ></span>
          </el-form-item>
          <el-form-item label="个性介绍" size="mini" prop="gexing" class="item-common">
            <el-input
              v-if="showEdit"
              v-model="personalRuleForm.gexing"
              type="textarea"
              :rows="6"
              placeholder="特长、教学理念、荣誉、风格等"
            ></el-input>
            <span v-if="!showEdit" class="text-wrapper" v-html="personalRuleForm.gexing_msg || '-'"></span>
          </el-form-item>
          <el-form-item v-if="showEdit" class="item-common">
            <el-button class="cancle-btn" @click="cancelEdit">取消</el-button>
            <el-button
              type="primary"
              v-if="addBtnShow"
              @click="onSubmit('personalRuleForm')"
              class="commit-btn"
            >提交</el-button>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <el-dialog :visible.sync="imgDialogVisible">
      <img width="100%" :src="imageUrl" />
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { gettoken, addjoininteacher, savejoininteacher, getuploadsignature,getVideoDetail,videoProcedure } from "../api/index";
import TcVod from 'vod-js-sdk-v6'
import {
  itemids,
  grade,
  subjects,
  profitcenter,
  schoolids,
  setGrade
} from "../api/index";
// import func from '../../vue-temp/vue-editor-bridge';

export default {
  props: ["dataList"],
  props: {
    listType: String,
    dataDetail: Object,
    detailForm: Object,
    addRuleForm: Object, // 加盟老师个人信息
    addstatus: String, // 判断添加加盟老师
    OperationBtnLs: Object, // 判断是否有权限修改
    teacherIds: Object, // 教师参数携带
    defaultBtnLs: Array,
    
  },
  data() {
    return {
      player: null,
      showEdit: false,
      teacherDetail: null,
      personalRuleForm: {
        lirun: "",
        lirun_name: "",
        zhiyuanlirun: [],
        zhiyuanlirun_name: "",
        city: "",
        city_name: "",
        zhiyuanCity: "",
        zhiyuanCity_name: "",
        role_type: [],
        class: [],
        class_name: [],
        project: [],
        project_name: [],
        grade: [],
        teacher_level: "",
        teacher_level_name: "",
        assistant_level: "",
        assistant_level_name: "",
        jieshao: "",
        jieshao_msg: "",
        gexing: "",
        gexing_msg: ""
      },
      otherRules: {
        lirun: [
          { required: true, message: "请填写利润中心", trigger: "change" }
        ],
        city: [{ required: true, message: "请填写城市", trigger: "change" }],
        role_type: [
          { required: true, message: "请填写角色", trigger: "change" }
        ]
      },
      Rules: {
        lirun: [
          { required: true, message: "请填写利润中心", trigger: "change" }
        ],
        city: [{ required: true, message: "请填写城市", trigger: "change" }],
        role_type: [
          { required: true, message: "请填写角色", trigger: "change" }
        ],
        class: [
          { required: true, message: "请填写授课学科", trigger: "change" }
        ],
        project: [
          { required: true, message: "请填写授课项目", trigger: "change" }
        ],
        grade: [
          { required: true, message: "请填写授课年级", trigger: "change" }
        ],
        teacher_level: [
          { required: true, message: "请填写教师等级", trigger: "change" }
        ],
        jieshao: [
          { required: true, message: "请填写教师介绍", trigger: "change" }
        ],
        gexing: [
          { required: true, message: "请填写个性介绍", trigger: "change" }
        ]
      },
      imageUrl: "",
      imgDialogVisible: false,
      dynamicTags: [],
      tabInputVisible: false,
      tabInputValue: "",
      profitData: [],
      schoolData: [],
      subjectsData: [],
      itemidsData: [],
      gradeData: [],
      levelTeacher: [
        // 教师等级
        {
          id: "1",
          name: "A"
        },
        {
          id: "2",
          name: "B"
        },
        {
          id: "3",
          name: "C"
        },
        {
          id: "4",
          name: "D"
        },
        {
          id: "5",
          name: "S"
        }
      ],
      assistantTeacherLevel: [
        //助教等级
        {
          id: "6",
          name: "普通"
        },
        {
          id: "7",
          name: "优秀"
        },
        {
          id: "8",
          name: "金牌"
        }
      ],

      videoForm: {
        Video: "",
        video_pic: "",
        playVideo:''
      },
      videoFlag: false,
      videoUploadPercent: 0,
      qiniu_token: "",
      addBtnShow: false,
      showTagRole: false,
      showTagRole_msg: false,
      flag: true,
      uploaderG:null,
      lineType:'',
      cityChange: false
    };
  },

  watch: {
    listType:{
      handler(newVal,oldval){
        if (newVal == "editTeacher") {
          this.showEdit = true;
        } else {
          this.showEdit = false;
        }
      },
      deep:true
    },
    dataDetail(newVal) {
      this.teacherDetail = JSON.parse(JSON.stringify(newVal));
      this.dataInit();
    }
  },
  created() {
    gettoken().then(res => {
      this.qiniu_token = res.uptoken;
    });
  },
  mounted() {
    if (this.listType == "editTeacher") {
      this.showEdit = true;
    }
    this.cityChange = this.listType == "teacherDetail" ? true : false
    this.getItemids();
    this.getProfitcenter();
    this.getSchoolids();
    this.getSubjects();
    this.getGrade();
    if (!this.teacherIds.id) {
      this.addBtnShow = this.defaultBtnLs.indexOf(14) > -1 ? true : false;
    } else {
      this.addBtnShow = this.defaultBtnLs.indexOf(15) > -1 ? true : false;
    }
    window.addEventListener('offline', this.updateOnlineStatus);
    window.addEventListener('online', this.updateOnlineStatus);

  },
  methods: {
    // 判断是否断网--这里只影响视频上传
    updateOnlineStatus(e){
      // 断网状态，并且视频正在上传状态，提示报错
        const { type } = e;
        this.lineType = type;
        if(type == 'offline' && this.videoFlag){
          this.$message.error('网络失去连接，上传失败')
          this.deleteVideo()
        }

    },

    // 传入数据初始化
    dataInit() {
      const _this = this
      this.personalRuleForm.role_type = this.teacherDetail.role_type
        ? this.teacherDetail.role_type.split(",")
        : [];
      this.personalRuleForm.lirun = this.teacherDetail.profit_center_id;
      this.personalRuleForm.lirun_name = this.teacherDetail.profit_center_name;

      this.personalRuleForm.zhiyuanlirun = this.teacherDetail
        .profit_center_support
        ? this.teacherDetail.profit_center_support.split(",")
        : [];
      this.personalRuleForm.zhiyuanlirun_name = this.teacherDetail.profit_center_support_name;

      this.personalRuleForm.city = this.teacherDetail.city;
      this.personalRuleForm.city_name = this.teacherDetail.city_name;
      this.personalRuleForm.zhiyuanCity = this.teacherDetail.support_city_id
        ? this.teacherDetail.support_city_id.split(",")
        : [];
      this.personalRuleForm.zhiyuanCity_name = this.teacherDetail.support_city_name;
      this.personalRuleForm.class = this.teacherDetail.subject_id
        ? this.teacherDetail.subject_id.split(",")
        : [];
      this.personalRuleForm.class_name = this.teacherDetail.subject_name.split(
        ","
      );

      this.personalRuleForm.project = this.teacherDetail.item_id
        ? this.teacherDetail.item_id.split(",")
        : [];
      this.personalRuleForm.project_name = this.teacherDetail.item_id_name;

      this.personalRuleForm.grade = this.teacherDetail.grade
        ? this.teacherDetail.grade.split(",")
        : [];

      this.personalRuleForm.grade_name = this.teacherDetail.grade_name;

      this.personalRuleForm.level = this.teacherDetail.level;
      this.personalRuleForm.level_name = this.teacherDetail.level_name;

      this.dynamicTags = this.teacherDetail.tag
        ? this.teacherDetail.tag.split(",")
        : [];
      this.personalRuleForm.jieshao = this.teacherDetail.introduce;
      this.personalRuleForm.jieshao_msg = this.teacherDetail.introduce.replace(
        /(\r\n|\n|\r)/gm,
        "<br/>"
      );

      this.personalRuleForm.gexing = this.teacherDetail.personality;
      this.personalRuleForm.gexing_msg = this.teacherDetail.personality.replace(
        /(\r\n|\n|\r)/gm,
        "<br/>"
      );

      this.imageUrl = this.teacherDetail.picture;

      // 请求视频详情
      if(this.teacherDetail.video_address){
        getVideoDetail({
                file_id:this.teacherDetail.video_address,
                video_type:'operating_activity' 
              }).then(res =>{
                  if(res && res.mp4_info){
                    const temp = JSON.parse(res.mp4_info)
                    _this.videoForm.playVideo = temp.url
                  }
                }).catch(err => {
                  console.log(err)
              })
      }
      
      this.videoForm.Video = this.teacherDetail.video_address;
      this.personalRuleForm.teacher_level =
        this.teacherDetail.teacher_level == "0"
          ? ""
          : this.teacherDetail.teacher_level; // 教师等级
      this.personalRuleForm.teacher_level_name = this.teacherDetail.teacher_level_name;
      this.personalRuleForm.assistant_level =
        this.teacherDetail.assistant_level == "0"
          ? ""
          : this.teacherDetail.assistant_level; // 助教等级
      this.personalRuleForm.assistant_level_name = this.teacherDetail.assistant_level_name;
    },

    // 取消编辑
    cancelEdit() {
      this.showEdit = false;
      this.$emit("refreshTeacherDetail", "commitSuccess");
    },

    // 表单提交
    onSubmit(formName) {
      this.$emit("rules");
      // 判断是否是主讲-主讲必填教师标签
      // if (
      //   this.personalRuleForm.role_type.indexOf("1") != -1 &&
      //   this.dynamicTags.length == 0
      // ) {
      //   this.showTagRole = true;
      //   this.showTagRole_msg = true;
      // } else {
      //   this.showTagRole = false;
      //   this.showTagRole_msg = false;
      // }

      this.$refs[formName].validate(valid => {
        if (valid) {
          // if (this.showTagRole_msg) return;

          if (this.videoFlag == true) {
            this.$message.error("视频正在上传，请稍后提交");
            return;
          }

          let detail = this.teacherDetail;
          let data = null;
          // 加盟老师（origin_type: 2 || origin_type: 3）
          if (
            (detail && (detail.origin_type == 2 || detail.origin_type == 3)) ||
            this.addstatus == "addTeacher"
          ) {
            data = {
              teacher_id: detail && detail.id ? detail.id : "",
              mobile: this.addRuleForm.phone,
              name: this.addRuleForm.name,
              surname: this.addRuleForm.surname,
              gender: this.addRuleForm.sex,
              profit_center_id: this.personalRuleForm.lirun,
              city: this.personalRuleForm.city,
              origin_type: 2,
              school: "",
              joining_status: this.addRuleForm.jiameng,
              profit_center_support: this.personalRuleForm.zhiyuanlirun.join(
                ","
              ),
              support_city_id: this.personalRuleForm.zhiyuanCity.join(","),
              role_type: this.personalRuleForm.role_type.sort().join(","),
              subject_id: this.personalRuleForm.class.join(),
              item_id: this.personalRuleForm.project.join(),
              grade: this.personalRuleForm.grade.join(","),
              tag: this.dynamicTags.join(","),
              personality: this.personalRuleForm.gexing,
              introduce: this.personalRuleForm.jieshao,
              picture: this.imageUrl,
              video_address: this.videoForm.Video,
              video_cover: this.videoForm.video_pic
            };
            if (detail && detail.id) {
              // 编辑加盟老师
              if (!this.flag) return false;
              this.flag = false;
              savejoininteacher(data)
                .then(res => {
                  if (!res) return;
                  if (detail.is_work == 2) {
                    this.$message.success("保存成功并成功启用排课");
                  } else {
                    this.$message.success("保存成功");
                  }
                  this.$router.push({
                    path: "/teacher"
                  });
                })
                .catch(err => {
                  console.log(err);
                })
                .finally(() => {
                  setTimeout(() => {
                    this.flag = true;
                  }, 1100);
                });
            } else {
              // 创建加盟老师
              if (!this.addRuleForm.surname) {
                this.$message.error("请输入姓名拼音");
                return;
              }  else {
                const reg = /^[A-Za-z]+$/;
                if (this.addRuleForm.surname && !reg.test(this.addRuleForm.surname)) {
                  this.$message.error("姓名拼音不能为中文、数字或特殊字符");
                  return;
                }
                if (this.addRuleForm.surname && this.addRuleForm.surname.length > 30) {
                  this.$message.error("姓名拼音输入过长（应小于30位）");
                  return;
                }
              }
              if (!this.flag) return false;
              this.flag = false;
              addjoininteacher(data)
                .then(res => {
                  if (!res) return;
                  this.$message.success("教师添加成功并成功启用排课");
                  this.$router.push({
                    path: "/teacher"
                  });
                })
                .catch(err => {
                  console.log(err);
                })
                .finally(() => {
                  setTimeout(() => {
                    this.flag = true;
                  }, 1100);
                });
            }
          } else {
            // 正式老师
            data = {
              teacher_level: this.personalRuleForm.teacher_level,
              assistant_level: this.personalRuleForm.assistant_level,
              origin_type: detail.origin_type,
              teacher_id: detail.id,
              account: detail.account,
              support_city_id: this.personalRuleForm.zhiyuanCity.join(","),
              role_type: this.personalRuleForm.role_type.sort().join(","),
              subject_id: this.personalRuleForm.class.join(),
              item_id: this.personalRuleForm.project.join(),
              grade: this.personalRuleForm.grade.join(","),
              picture: this.imageUrl,
              video_cover: this.videoForm.video_pic,
              video_address: this.videoForm.Video,
              tag: this.dynamicTags.join(),
              introduce: this.personalRuleForm.jieshao,
              profit_center_support: this.personalRuleForm.zhiyuanlirun.join(
                ","
              ),
              status: detail.status,
              is_work: detail.is_work,
              personality: this.personalRuleForm.gexing,
              school_id: detail.city,
              profit_center_id: detail.profit_center_id
            };
            if (this.teacherDetail.is_new == 2) {
              // 编辑正式老师（旧老师）
              if (!this.flag) return false;
              this.flag = false;
              savejoininteacher(data)
                .then(res => {
                  if (!res) return;
                  if (detail.is_work == 2) {
                    this.$message.success("保存成功并成功启用排课");
                  } else {
                    this.$message.success("保存成功");
                  }
                  this.$router.push({
                    path: "/teacher"
                  });
                })
                .catch(err => {
                  this.$message.error(err);
                })
                .finally(() => {
                  setTimeout(() => {
                    this.flag = true;
                  }, 1100);
                });
            } else {
              // 编辑正式老师（新老师）
              if (!this.flag) return false;
              this.flag = false;
              addjoininteacher(data)
                .then(res => {
                  if (!res) return;
                  if (detail.is_work) {
                    if (detail.is_work == 2) {
                      this.$message.success("保存成功并成功启用排课");
                    } else {
                      this.$message.success("保存成功");
                    }
                  } else {
                    this.$message.success("保存成功并成功启用排课");
                  }
                  this.$router.push({
                    path: "/teacher"
                  });
                })
                .catch(err => {})
                .finally(() => {
                  setTimeout(() => {
                    this.flag = true;
                  }, 1100);
                });
            }
          }
        } else {
          if (!this.cityChange) {
            this.$message.error("有信息项未填写，请重新核对");
          } else {
            if (!this.personalRuleForm.lirun || !this.personalRuleForm.city) {
              this.$message.error("缺少城市或利润中心，请去staff进行管理");
            }
          }
        }
      });
    },

    // 上传教师照片成功回调
    handleAvatarSuccess(res, file) {
      this.imageUrl = "https://img.zhugexuetang.com/" + res.key;
    },

    // 上传照片前回调
    beforeAvatarUpload(file) {
      if (!this.qiniu_token) {
        gettoken()
          .then(res => {
            this.qiniu_token = res.uptoken;
          })
          .catch(err => {
            console.log(err);
          });
      }
      const isJPG = file.type === "image/jpg";
      const isJPEG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isOK = isJPG || isJPEG || isPNG;
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isOK) {
        this.$message.error("上传头像图片只能是 JPG、JPEG 或 PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
        return false;
      }
      const isSize = new Promise(function(resolve, reject) {
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width == img.height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          this.$message.error("上传头像图片比例应为1:1");
          return Promise.reject();
        }
      );
      return isOK && isLt2M && isSize;
    },

    // 教师照片查看大图
    handlePictureCardPreview(file) {
      // this.imageUrl = file.url;
      this.imgDialogVisible = true;
    },

    // 限制照片数量的警告回调
    handleExceed(files, fileList) {
      this.$message.warning("只能上传一张照片");
    },

    // 视频-自定义地址
    httpRequest(file){
        const _this = this
       
        // const time = new Date().getTime()
        // const radomData = (Math.random() * 100).toFixed(0)
        // const mediaFile = `${time}${radomData}${file.file.name}`

        if(this.lineType == 'offline'){
            this.$message.error("网络开小差了，请稍后重试");
            return false
        }

          const isLt10M = file.file.size / 1024 / 1024 < 700;
          if (["video/mp4", "video/quicktime"].indexOf(file.file.type) == -1) {
            this.$message.error("视频格式有误，上传失败");
            return false;
          }
          if (!isLt10M) {
            this.$message.error("请上传MP4、MOV格式且不超过700MB的视频哦!");
            return false;
          }
            _this.videoFlag = true
            this.videoUploadPercent=0
          // 获取视频签名
        const getSignature = async function(){
          return await getuploadsignature({
            video_type:'operating_activity'
          }).then(res => {
             return res
          })
        }

       // 前文中所述的获取上传签名的函数
        const tcVod = new TcVod({
          getSignature:getSignature
         })
        const uploader = tcVod.upload({
          mediaFile: file.file,
          // mediaName: mediaFile, // 媒体文件（视频或音频或图片），类型为 File
        })
        this.uploaderG = uploader // 定义全局用于取消上传

        // 进度
        uploader.on('media_progress', function(info) {
            _this.videoUploadPercent = parseInt(info.percent * 100);
        })

        uploader.done().then((doneResult) => {
            _this.videoFlag = false
            _this.videoForm.Video = doneResult.fileId
            const data = {
              file_id:doneResult.fileId, // 腾讯云file_id
              video_type:'operating_activity', // 视频类型 运营活动-教务管理传 operating_activity
              video_name:'', // 视频名称
              video_url: doneResult.video && doneResult.video.url?doneResult.video.url:'',// 视频地址
              video_ext:'', // 视频后缀，没有后端会自动取视频地址后缀
              course_id: '',// 课程ID，没有传空
              course_name: '',// 课程名字，没有传空
              lesson_id: '',// 课节ID，没有传空
              lesson_name:'', // 课节名字，没有传空
              start_time: '',// 课程开始时间，没有传空
              finish_time:'', // 课程结束时间，没有传空
              teacher_account:'', // 讲师账号，没有传空
              teacher_name:'' // 讲师姓名，没有传空
            }
            // 腾讯视频转码
            videoProcedure(data)
            .then(res => {
            }).catch(err => {
              console.log(err)
            })
        }).catch( (err) => {
          console.log(err)
        })
    },

    // 删除视频
    deleteVideo() {
      if(this.uploaderG){
        this.uploaderG.cancel()
      }
      this.videoForm.Video = "";
      this.videoForm.playVideo = "";
      this.videoFlag = false;
      this.videoUploadPercent=0
    },

    // 删除tab标签
    tabHandleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    // 显示新增tab输入框
    tabShowInput() {
      this.tabInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    // 提交tab内容
    tabInputConfirm() {
      let tabInputValue = this.tabInputValue;
      if (!tabInputValue) {
        this.tabInputVisible = false;
        return;
      }
      if (
        this.dynamicTags.length > 0 &&
        this.dynamicTags.indexOf(tabInputValue) != -1
      ) {
        this.$message.error("已经添加了相同的标签");
        this.tabInputValue = "";
        this.tabInputVisible = false;
        return;
      }
      if (tabInputValue.length < 9 && this.dynamicTags.length < 4) {
        this.dynamicTags.push(tabInputValue);
      } else {
        this.$message.error("最多支持4个标签,每个标签限制8个字内");
      }
      this.tabInputVisible = false;
      // this.showTagRole_msg = false;
      this.tabInputValue = "";
    },

    // 获取城市列表
    getSchoolids() {
      schoolids({
        type: 1
      })
        .then(res => {
          if (res) {
            this.schoolData = res;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取利润中心
    getProfitcenter() {
      profitcenter({
        type: 1
      })
        .then(res => {
          if (res) {
            this.profitData = res;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取授课项目
    getItemids() {
      itemids()
        .then(res => {
          if (res) {
            this.itemidsData = res;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 获取授课年级
    getGrade() {
      setGrade()
        .then(res => {
          if (res) {
            this.gradeData = res;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取授课学科
    getSubjects() {
      subjects()
        .then(res => {
          if (res) {
            this.subjectsData = res;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 切换角色，判断表单验证情况
    changeRoleType(val) {
      // if (val == 1) {
      //   this.showTagRole = true;
      // } else {
      //   this.showTagRole = false;
      //   this.showTagRole_msg = false;
      //   this.$refs.personalRuleForm.clearValidate([
      //     "class",
      //     "project",
      //     "grade",
      //     "teacher_level",
      //     "jieshao",
      //     "gexing"
      //   ]);
      // }
      if (val.indexOf("1") == -1) {
        this.personalRuleForm.teacher_level = "";
      } else if (val.indexOf("3") == -1) {
        this.personalRuleForm.assistant_level = "";
      }
    }
  },

  beforeDestroy(){
    window.removeEventListener('offline', this.updateOnlineStatus);
    window.removeEventListener('online', this.updateOnlineStatus);

  }
};
</script>

<style lang="scss" scoped>
.personal-box {
  width: 100%;
}

.personal-title {
  padding: 14px 33px;
  font-weight: bold;
  background: #fafafa;
}
.box-border {
  border: 1px solid #eee;
  margin-bottom: 30px;
}
// pre-wrap:保留空白并且正常换行。
.text-wrapper {
  white-space: pre-wrap;
}
.personal-style {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 24px 0 0;
  margin: 0 0 0 36px;
  .teacher-role {
    margin-left: 25px !important;
  }
  .el-form-item {
    width: 33%;
    margin: 0 30px 18px 10px;
  }
  .select-style {
    width: 100%;
  }
  .select-city {
    margin-left: 25px;
    width: 92%;
  }
  .item-common {
    width: 100%;
    position: relative;
    .is_required {
      color: #f56c6c;
      position: absolute;
      top: 0;
      left: -93px;
    }
    .is_required_msg {
      color: #f56c6c;
      font-size: 12px;
    }
    img {
      width: 148px;
      height: 148px;
      border: 1px solid #eee;
      padding: 5px;
    }
  }
  .el-radio {
    margin-right: 20px;
  }
  .common-inp {
    width: 70%;
  }
  .cancle-btn {
    width: 96px;
    height: 32px;
    line-height: 8px;
    background: #fafafa;
    border: 1px solid #dddddd;
  }
  .commit-btn {
    width: 96px;
    height: 32px;
    line-height: 8px;
    background: #774c90;
    border: 1px solid #774c90;
  }
  .teacher-picture {
    display: flex;
    align-items: flex-end;
    position: relative;
    span {
      margin-left: 20px;
      color: #999999;
    }
    .video-del {
      margin-left: 20px;
    }
    .video-progress {
      margin-top: 10px;
      width: 148px;
      height: 148px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .picter-style {
      position: absolute;
      left: 150px;
      top: 30%;
      color: #cccccc;
    }
  }
}
.el-textarea {
  width: 55%;
}

  .video-zhuanma{
      width: 148px;
      height: 148px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      background: url('../assets/videologo.png') no-repeat center 15px;
      background-size: 60% 60%;
      background-color: #fff;
      opacity: 0.5;
      color: #000;
    }
</style>
<style lang="scss">
.personal-style {
  .picture-icon {
    i {
      font-size: 25px;
      margin-left: 20px;
      position: relative;
      bottom: 0;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 148px;
    height: 148px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
    border: 1px dashed #d9d9d9;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 232px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .el-form-item--mini .el-form-item__error {
    padding-top: 4px !important;
  }
}
</style>
