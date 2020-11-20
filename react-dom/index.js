import Component from '../react/component'
import { diff, diffNode } from './diff'
//实现reaactdom的render
const ReactDom = {
    render
}

// 接受两个参数，一个虚拟dom，一个容器元素
function render(vnode, container, dom) {
    // 返回生成的元素
    // return container.appendChild(_render(vnode))
    return diff(dom, vnode, container)
}

export function renderComponent(comp) {
    let base
    const renderer = comp.render()
    // base = _render(renderer)
    base = diffNode(comp.base, renderer)
    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate()
    }
    if (comp.base) {
        if (comp.componentDidUpdate) comp.componentDidUpdate()
    } else if (comp.componentDidMount) {
        comp.componentDidMount()
    }
    // if (comp.base && comp.base.parentNode) {
    //     comp.base.parentNode.replaceChild(base, comp.base)
    // }
    comp.base = base
}

export function createComponent(comp, props) {
    let inst
    if (comp.prototype && comp.prototype.render) {
        inst = new comp(props)
    } else {
        inst = new Component(props)
        inst.constructor = comp
        inst.render = function () {
            return this.constructor(props)
        }
    }
    return inst
}

export function setComponentProps(comp, props) {
    if (!comp.base) {
        if (comp.componentWillMount) comp.componentWillMount()
    } else if (comp.componentWillReceiveProps) {
        comp.componentWillReceiveProps()
    }
    comp.props = props
    renderComponent(comp)
}

function _render(vnode) {
    // 判断传入的内容---是空
    if (vnode === undefined || vnode === null || typeof vnode === "boolean") vnode = ""
    // 是数字类型转换为字符类型
    if (typeof vnode === "number") vnode = String(vnode)
    if (typeof vnode === "string") {
        //直接返回文本
        return document.createTextNode(vnode)
    }
    // 如果是组建
    if (typeof vnode.tag === "function") {
        // 创建组建
        const comp = createComponent(vnode.tag, vnode.attrs)
        // 设置属性
        setComponentProps(comp, vnode.attrs)
        // 挂载到组建
        return comp.base

    }
    // 取到虚拟dom的标签和属性
    const { tag, attrs } = vnode
    const dom = document.createElement(tag)

    // 如果有属性
    if (attrs) {
        Object.keys(attrs).forEach(key => {
            const value = attrs[key]
            setAttribute(dom, key, value)
        })
    }
    if (vnode.childrens) {
        vnode.childrens.forEach(child => render(child, dom))
    }
    return dom
}

export function setAttribute(dom, key, value) {
    if (key === "className") {
        key = "class"
    }

    if (/on\w/.test(key)) {
        key = key.toLowerCase()
        dom[key] = value || ""
    } else if (key === "style") {
        if (!value || typeof value === "string") {
            dom.style.cssText = value || ""
        } else if (value && typeof value === "object") {
            for (let k in value) {
                if (typeof value[k] === 'number') {
                    dom.style[k] = value[k] + "px"

                } else {
                    dom.style[k] = value[k]
                }
            }
        }
    } else {
        if (key in dom) {
            dom[key] = value || ""
        }
        if (value) {
            dom.setAttribute(key, value)
        } else {
            dom.removeAttribute(key)
        }
    }
}

export default ReactDom