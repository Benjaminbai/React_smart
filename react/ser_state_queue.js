import { renderComponent } from "../react-dom"

const setStateQueue = []
const renderQueue = []
function defers(fn) {
    return Promise.resolve().then(fn)
}
export function enqueueSetState(stateChange, component) {
    // 如果队列为空， 则异步执行flush
    if (setStateQueue.length === 0) {
        // setTimeout(() => {
        //     flush()
        // }, 0)

        defers(flush)
    }
    // 如果不为空， 把stateChange/component 添加进队列
    setStateQueue.push({
        stateChange,
        component
    })

    // 查看队列中是否存在当前component
    let r = renderQueue.some(item => {
        return item === component
    })
    // 如果没有渲染组件，则添加进队列
    if (!r) {
        renderQueue.push(component)
    }
}

function flush() {
    let item, component
    // 取队列中的最后一次的状态
    while (item = setStateQueue.shift()) {
        const { stateChange, component } = item
        // 如果component没有prevstate
        if (!component.prevState) {
            // 则合并赋值给prev
            component.prevState = Object.assign({}, component.state)
        }

        // 如果传递的是函数
        if (typeof stateChange === 'function') {
            // 合并到state，
            Object.assign(component.state, stateChange(component.prevState, component.props))
        } else {
            Object.assign(component.state, stateChange)
        }

        // 保存prevstate
        component.prevState = component.state
    }

    // 获取render队列的最后一次更新
    while (component = renderQueue.shift()) {
        renderComponent(component)
    }
}