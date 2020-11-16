
const ReactDom = {
    render: (vnode, container) => {
        container.innerHTML = ""
        return render(vnode, container)
    }
}

function render(vnode, container) {
    // //判断vnode如果是空
    // if (vnode == undefined) return
    // //判断vode如果是文本
    // if (typeof vnode === "string") {
    //     const textNode = document.createTextNode(vnode)
    //     return container.appendChild(textNode)
    // }
    // //否则就是虚拟dom对象
    // const { tag } = vnode
    // const dom = document.createElement(tag)

    // if (vnode.attrs) {
    //     //如果有属性
    //     Object.keys(vnode.attrs).forEach(key => {
    //         const val = vnode.attrs[key]
    //         //设置属性
    //         setAttribute(dom, key, val)
    //     })
    // }
    // // 递归渲染子节点
    // vnode.childrens.forEach(child => render(child, dom))
    return container.appendChild(_render(vnode))
}

function setAttribute(dom, key, value) {
    if (key === "className") {
        key = "class"
    }
    if (/on\w/.test(key)) {
        key = key.toLowCase()
        dom[key] = value || ""
    } else if (key === "style") {
        if (!value || typeof value === "string") {
            dom.style.cssText = value || ""
        } else if (value && typeof value === "object") {
            for (let k in value) {
                if (typeof value[k] === "number") {
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

export function renderComponent(comp) {
    let base
    const renderer = comp.render()
    base = _render(renderer)

    if (comp.base && comp.base.parentNode) {
        comp.base.parentNode.replaceChild(base, comp.base)
    }
    comp.base = base
}

export default ReactDom