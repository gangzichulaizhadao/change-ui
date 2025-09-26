// 优雅的拿到引入此js文件的vue实例
let _this = null
export const receiveThis = vm => (_this = vm)

const validatePass = (rule, value, callback) => {
  if (value === '111') {
    callback(new Error('不允许输入111'))
  } else {
    callback()
  }
}

export const formList = [
  {
    type: 'datetimerange',
    formItemAttrs: {
      label: '日期',
      prop: 'date',
      required: true
    },
    attrs: {
      // clearable: false
    },
    listeners: {
      change: val => {
        console.log(val)
      }
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'name',
      // required 和 rules 不能同时使用
      // required: true
      rules: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
      ]
    },
    attrs: {
      clearable: true
      // placeholder: '请输入名称1'
    },
    // 在此js文件中的定义的事件内是无法取到this，如果想使用this需要使用receiveThis方法
    listeners: {
      blur: e => {
        console.log(e, 'blur', _this)
        _this.inputBlur()
      },
      clear: () => {
        console.log('clear')
      }
    },
    slots: {
      // 在js文件中使用jsx语法，插槽参数处需要接收h函数，不然会浏览器控制台报错 h is not defined
      // 这样eslint会报提示，因为实际h函数在我们编写代码时是没有用到h函数，但是在是在vue底层编译时用到了
      // 加上下边的注释即可
      // eslint-disable-next-line
      prefix: h => {
        return <i class="el-input__icon el-icon-search" />
      },
      // eslint-disable-next-line
      suffix: h => {
        return <i class="el-input__icon el-icon-date" />
      }
    }
  },
  {
    type: 'select',
    formItemAttrs: {
      label: '性别',
      prop: 'sex',
      required: true
      // rules: [
      //   { required: true, message: '请输入名称', trigger: 'blur' },
      //   { validator: validatePass, trigger: 'blur' }
      // ]
    },
    attrs: {
      // placeholder: '请输入名称1'
      clearable: true,
      options: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 0
        }
      ]
    },
    listeners: {
      change: val => {
        console.log(val, 111)
      },
      focus: val => {
        console.log(val, 222)
      }
    },
    slots: {
      prefix: h => {
        return h('i', { class: 'el-input__icon el-icon-search' })
      },
      empty: h => {
        return h('i', { class: 'el-input__icon el-icon-date' })
      }
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'a',
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'b',
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'c',
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'd',
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'e',
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'f',
    }
  },
  {
    slot: 'a',
    // colAttrs: {
    //   span: 6
    // },
    formItemAttrs: {
      label: '地区',
      prop: 'address',
      required: true
      // rules: [
      //   { required: true, message: '请输入地区', trigger: ['change', 'blur'] },
      //   { validator: validatePass, trigger: 'blur' }
      // ]
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'g',
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'h',
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'i',
    }
  },
  {
    type: 'input',
    formItemAttrs: {
      label: '名称',
      prop: 'j',
    }
  }
]
// 随机0或1函数
function random() {
  return Math.floor(Math.random() * 2)
}

export const tableData = (function () {
  const data = []
  for (let i = 0; i < 20; i++) {
    data.push({
      date: '2016-05-02',
      name: '王小虎',
      a: 'a',
      b: 'b',
      c: 'c',
      d: 'd',
      e: 'e',
      f: 'f',
      g: 'g',
      h: 'h',
      sex: random()
    })
  }
  return data
})()

export const tableColumns = [
  {
    type: 'selection',
    width: 55,
  },
  {
    type: 'index',
    label: '序号',
    width: 55
  },
  {
    label: '日期',
    prop: 'date',
    formatter: row => {
      return row.date + ' 11:11:11'
    }
  },
  {
    label: '名称',
    prop: 'name'
  },
  {
    label: 'a',
    prop: 'a'
  },
  {
    label: 'b',
    prop: 'b'
  },
  {
    label: 'c',
    prop: 'c'
  },
  {
    label: 'd',
    prop: 'd'
  },
  {
    label: 'e',
    prop: 'e'
  },
  {
    label: '插槽',
    slot: 'chacao'
  },
  {
    label: 'f',
    prop: 'f'
  },
  {
    label: 'g',
    prop: 'g'
  },
  {
    label: 'h',
    prop: 'h'
  },
  {
    label: '性别',
    prop: 'sex',
    align: 'left',
    options: [
      {
        label: '男',
        value: 1
      },
      {
        label: '女',
        value: 0
      }
    ]
  },
  {
    label: '操作',
    slot: 'action'
  }
]

export const pagination = {
  current: 1,
  size: 10,
  total: 100,
  events: {
    'update:current': val => (pagination.current = val),
    'update:size': val => (pagination.size = val),
    pagination: ({ current, size }) => {
      console.log(current, size, pagination)
    }
  }
}
