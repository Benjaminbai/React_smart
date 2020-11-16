import Component from '../react/component'
const ReactDom = {
    render
}

function render(vnode, container) {
    return container.appendChild(_render(vnode))
}

export function renderComponent(comp) {
    let base
    const renderer = comp.render()
    base = _render(renderer)
    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate()
    }
    if (comp.base) {
        if (comp.componentDidUpdate) comp.componentDidUpdate()
    } else if (comp.componentDidMount) {
        comp.componentDidMount()
    }
    if (comp.base && comp.base.parentNode) {
        comp.base.parentNode.replaceChild(base, comp.base)
    }
    comp.base = base
}

function createComponent(comp, props) {
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

function setComponentProps(comp, props) {
    if (!comp.base) {
        if (comp.componentWillMount) comp.componentWillMount()
    } else if (comp.componentWillReceiveProps) {
        comp.componentWillReceiveProps()
    }
    comp.props = props
    renderComponent(comp)
}

function _render(vnode) {
    if (vnode === undefined || vnode === null || typeof vnode === "boolean") vnode = ""
    if (typeof vnode === "number") vnode = String(vnode)
    if (typeof vnode === "string") {
        return document.createTextNode(vnode)
    }

    if (typeof vnode.tag === "function") {
        const comp = createComponent(vnode.tag, vnode.attrs)
        setComponentProps(comp, vnode.attrs)
        return comp.base

    }

    const { tag, attrs } = vnode
    const dom = document.createElement(tag)

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

function setAttribute(dom, key, value) {
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