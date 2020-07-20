export const bookRules = {
  study_year: [{ required: true, message: "请选择教学年", trigger: "change" }],
  term_type: [{ required: true, message: "请选择季度", trigger: "change" }],
  school_id: [{ required: true, message: "请选择城市", trigger: "change" }],
  campus_id: [{ required: false, message: "请选择校区", trigger: "change" }],
  profit_center_id: [
    { required: true, message: "请选择利润中心", trigger: "change" }
  ],
  class_day: [{ required: true, message: "请选择上课日", trigger: "change" }],
  frequency_type: [
    { required: true, message: "请选择开课频次", trigger: "change" }
  ],
  bd_time: [{ required: true, message: "请选择上课时间", trigger: "change" }],
  lesson_num: [{ required: true, message: "请选择班级课节数", trigger: "change" }],
  teacher_num: [{ required: true, message: "请选择班级老师数", trigger: "change" }],
  tmp_id: [{ required: true, message: "请选择排课模版", trigger: "change" }],
  addr: [{ required: true, message: "请选择老师位置", trigger: "change" }]
};
export const nobookRules = {
  study_year: [{ required: true, message: "请选择教学年", trigger: "change" }],
  term_type: [{ required: true, message: "请选择季度", trigger: "change" }],
  school_id: [{ required: true, message: "请选择城市", trigger: "change" }],
  class_day: [{ required: true, message: "请选择不排课日", trigger: "change" }],
  frequency_type: [
    { required: true, message: "请选择不开课频次", trigger: "change" }
  ],
  bd_time: [{ required: true, message: "请选择不排课时间", trigger: "change" }],
  stop_time: [{ required: true, message: "请选择不排课日期", trigger: "change" }],
  stop_time_type: [{ required: true, message: "请选择不排课时间段", trigger: "change" }],
  tmp_id: [{ required: true, message: "请选择不排课模版", trigger: "change" }],
  remark: [{ required: true, message: "请选择不排课备注", trigger: "change" }],
};