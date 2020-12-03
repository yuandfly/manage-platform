import {
  user
} from '@/common/js/loginInfo'

/* 元素的原始数据 */
export const elementMap = {
  /* 主键 */
  elementCode: null, //主键
  // 元素名称
  elementName: null,
  //  排序号 private Integer ordernum;
  ordernum: null,
  //  外键到模块编码 private String tableElementCode;
  tableElementCode: null,
  // 状态 1在用 2不用private Integer state;
  state: null,
  // 数据创建人 private String createuser;
  createuser: user.nickname,
  // 数据创建时间 private Date createtime;
  createtime: null,
  // 数据修改人 private String updateuser;
  updateuser: null,
  // 最近修改时间 private Date updatetime;
  updatetime: null,
  /* 数据类型：整形 字符 日期 浮点型 private Integer dataType; 
   0: '数字', {number} 
   1: '日期', {Date}
   2: '文字' {String}
   */
  dataType: null,
  // 数据长度 private String dataLength;
  dataLength: null,
  // 1是 2 否 private Integer isRequired;
  isRequired: null,
  // 必填项提示信息 private String promptLanguage;
  promptLanguage: null,
  // 默认值 private String defaultValue;
  defaultValue: null,
  // 取值范围 最大值： 最小值： private String validValueRange;
  validValueRange: null,
  // 特殊指定类型 不为空时查指定字典表 private String specificTypes;
  specificTypes: null,
  // 元素框类型：1文本 2下拉 3 日期 4单选 private Integer componentType;
  componentType: 0,
  // 数据源（下拉框数据） private String dataSource;
  dataSource: null,
  // 行号 private Integer rownum; 做格数使用
  rownum: 1,
  // 列号 private Integer colnum; 做序号使用
  colnum: null,
  // 单元格内容 private String cellContent;
  cellContent: null,
  // 单元格类型 大文本 计算  private Integer cellType;
  cellType: null,
  // 1求和 2求平均 3求差 private Integer cellResult;
  cellResult: null,
  placeholder: '',
  //  备注 private String remark;
  remark: null,
  // 持有的下拉菜单list private List<DictionaryTableDO> dictionaryTableDOList;
  dictionaryTableDOList: [],
  /* 预留 */
  indentValue: 0, //元素lebal的缩进值
  reserveCode2: null,
  elementNumber: '', //元素序号
  reserveName2: ''
}

/* 元素的选项原始数据 */
export const optionsMap = {
  id: '', //主键
  // 值 private String configValue;
  configValue: '',
  // 状态 private Integer state;
  state: null,
  // 数据创建人 private String createuser;
  createuser: user.nickname,
  // 数据创建时间年月日时分秒 private Date createtime;
  createtime: null,
  // 最近修改人 private String updateuser;
  updateuser: null,
  // 最近修改时间 private Date updatetime;
  updatetime: null,
  // 元素编码,外键到元素表 private String elementCode;
  elementCode: null,
  //  备注 private String remark;
  remark: null,
    //序号
    ordernum:null
}

/* 模块的原始数据 */
export const moduleMap = {
  basicElementVOList: [],
  createtime: null,
  createuser: user.nickname,
  nameLocation: 0,
  ordernum: 0,
  remark: '',
  seatNumber: 0,
  state: 0,
  surveyCode: '',
  tableElementCode: '', //主键
  tableElementName: '',
  updatetime: null,
  updateuser: ''
}

/* 一级表单的原始数据 */
export const formMap = {
  approveNo: '',
  approveUnit: '',
  basicModuleVOList: [],
  code: '', //主键
  createtime: '',
  createuser: user.nickname,
  endtime: '',
  expired: null,
  isPublish: null,
  level: 1,
  ordernum: 0,
  remark: '',
  seatNumber: 0,
  starttime: '',
  state: 0,
  submitUnit: '',
  surveyName: '',
  surveyNo: '',
  tableFrame: 0,
  updatetime: '',
  updateuser: ''
}
/* 页面 & 二级*/
export const pageMap = {
  approveNo: '',
  approveUnit: '',
  basicTableVOList: [],
  code: '', //主键
  createtime: '',
  createuser: user.nickname,
  endtime: '',
  expired: 0,
  isPublish: 0,
  level: 2,
  ordernum: 0,
  remark: '',
  seatNumber: 0,
  starttime: '',
  state: 0,
  submitUnit: '',
  surveyName: '',
  surveyNo: '',
  tableFrame: 0,
  updatetime: '',
  updateuser: ''
}

/* 元素的类型 */
const dataType = {
  0: '数字', //number
  1: '日期', //Date
  2: '文字' //String
}

/* 计算规则元素的类型 */
const typeCode = {
  0: '元素',
  1: '加号',
  2: '减号',
  3: '乘号',
  4: '除号',
  5: '等于',
  6: '大于',
  7: '小于'
}
