import {enqueueSetState} from './ser_state_queue'
import { renderComponent } from '../react-dom'

// 是渲染函数组件的时候，把函数组件转换成class组件时用到的
class Component {
    constructor(props = {}) {
        this.props = props
        this.state = {}
    }
    setState(stateChange) {
        // Object.assign(this.state, stateChange)
        // renderComponent(this)

        // 模拟移步setState的方法
        enqueueSetState(stateChange, this)
    }
}

export default Component