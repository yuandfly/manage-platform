/* 创建table对象 */
export class Table {
  constructor(createUser) {
    this.id = ''
    this.tableName = ''
    this.createTime = ''
    this.createUser = createUser
    this.updateTime = ''
    this.updateUser = ''
    this.state = ''
    this.statisticalTableFieldAOList = []
  }
}

/* 单元格对象 */
export class Column {
  constructor(createUser) {
    this.id = +new Date()
    this.fieldName = ''
    this.orders = ''
    this.tableNameId = ''
    this.createTime = ''
    this.createUser = createUser
    this.updateTime = ''
    this.updateUser = ''
    this.state = ''
    this.statisticalTableRuleDOList = []
    this.edit = true
  }
}
/* 规则对象 */
export class Rule {
  constructor(createUser) {
    this.id = +new Date()
    this.planCode = ''
    this.planName = ''
    this.elementCode = ''
    this.elementName = ''
    this.orders = ''
    this.operator = ''
    this.operatorName = ''
    this.fieldId = ''
    this.createTime = ''
    this.createUser = createUser
    this.updateTime = ''
    this.updateUser = ''
    this.state = ''
  }
}
