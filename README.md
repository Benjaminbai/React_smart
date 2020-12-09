# React_smart
realizing react frame of short version

# 实现思路
1. 在index.html中定义好id，方便react接管，引入脚本
2. 引入自己写的react，和react-dom，模拟写法，函数组件，class组件，传入render方法
3. 首先需要引入一个包解读jsx文件--“transform-react-jsx”， react必须实现一个createelement的方法
4. createelement需要接收n个参数，标签，属性，和子节点，将其包装成一个对象然后返回
5. 实现react-dom
    - render方法，接收虚拟dom，和容器，实现挂载
    - _render方法， 判断节点类型，如果是string类型，直接创建文本节点，否则需要判断是函数组件还是class组件
    - 如果是函数类型，就需要创建组件/设置属性/挂载base，class组件直接new，函数组件需要转换成class组件，就需要在react里创建一个component
    - 还要考虑到子节点，需要使用递归调用render
6. 实现生命周期
    - 在react-dom中创建组件/设置组件/渲染组件的不同节点中设置生命周期
7. 实现diff算法
    - 之前更新元素是直接替换父级元素的，现在需要在render中调用diff
    - 在判断组件类型是，需要判断是否是同一种类型，如果不是就需要移除旧的，重新创建新的
    - 有过有子节点，调用diffchildren
        - 判断旧的子节点是否有“key”属性，“key”是在react中component里定义好的
        - 遍历虚拟dom，递归调用diffnode
8. 实现异步state
    - 先声明两个队列，一个setstatequeue，一个renderqueue，当setstatequeue个数为0时，调用异步，否则就添加到队列，renderqueue判断是否存在component，不存在就添加
    - 每次取队列到最后一个，如果component没有prevstate，把当前state给prev
    - 如果传递到是一个函数，则调用函数后，合并到state
    - 如果不是就直接合并
    - 取renderqueue最后一个component，调用react-dom里到rendercomponent方法更新

