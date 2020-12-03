export const ruleDTO = {

  // @ApiModelProperty(value = "")
  id: null,

  // @ApiModelProperty(value = "规则id")
  rulesId: '',

  // @ApiModelProperty(value = "外键到表")
  surveyCode: '',

  // @ApiModelProperty(value = "元素id")
  elementCode: '',
  // 元素名称
  elementName: '',
  // @ApiModelProperty(value = "类型编码 0 数字 1+ 2 -")
  typeCode: null,

  // @ApiModelProperty(value = "位置号 计算公式中的位置")
  seatNumber: null,

  // @ApiModelProperty(value = "创建人")
  createuser: '',

  //   @JsonFormat(timezone = "GMT+8", pattern="yyyy-MM-dd HH:mm:ss")
  // @ApiModelProperty(value = "创建时间")
  createtime: null,

  // @ApiModelProperty(value = "数据修改者")
  updateuser: '',

  //   @JsonFormat(timezone = "GMT+8", pattern="yyyy-MM-dd HH:mm:ss")
  // @ApiModelProperty(value = "修改时间")
  updatetime: null,

  // @ApiModelProperty(value = "状态 是否停用 0 在用 1 停用")
  state: null
}
