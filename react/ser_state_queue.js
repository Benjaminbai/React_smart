import { renderComponent } from "../react-dom"

const setStateQueue = []
const renderQueue = []
function defers(fn) {
    return Promise.resolve().then(fn)
}
export function enqueueSetState(stateChange, component) {
    if (setStateQueue.length === 0) {
        // setTimeout(() => {
        //     flush()
        // }, 0)

        defers(flush)
    }
    setStateQueue.push({
        stateChange,
        component
    })

    let r = renderQueue.some(item => {
        return item === component
    })
    if (!r) {
        renderQueue.push(component)
    }
}

function flush() {
    let item, component
    while (item = setStateQueue.shift()) {
        const { stateChange, component } = item
        if (!component.prevState) {
            component.prevState = Object.assign({}, component.state)
        }

        if (typeof stateChange === 'function') {
            Object.assign(component.state, stateChange(component.prevState, component.props))
        } else {
            Object.assign(component.state, stateChange)
        }
        component.prevState = component.state
    }

    while (component = renderQueue.shift()) {
        renderComponent(component)
    }
}