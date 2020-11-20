import { setAttribute } from './index'
export function diff(dom, vnode, container) {
    const ret = diffNode(dom, vnode)
    if (container) {
        container.appendChild(ret)
    }

    return ret
}

function diffNode(dom, vnode) {
    let out = dom
    // 判断传入的内容---是空
    if (vnode === undefined || vnode === null || typeof vnode === "boolean") vnode = ""
    // 是数字类型转换为字符类型
    if (typeof vnode === "number") vnode = String(vnode)
    if (typeof vnode === "string") {
        if (dom && dom.nodeType === 3) {
            if (dom.textContent !== vnode) {
                dom.textContent = vnode
            }
        } else {
            out = document.createTextNode(vnode)
            if (dom && dom.parentNode) {
                dom.parentNode.replaceNode(out, dom)
            }
        }
        return out
    }

    if (!dom) {
        out = document.createElement(vnode.tag)
    }
    if (vnode.childrens && vnode.childrens.length > 0 || (out.childNodes && out.childNodes > 0)) {
        diffChildren(out, vnode.childrens)
    }
    diffAttribute(out, vnode.childrens)
    return out
}

function diffChildren(dom, vchildrens) {

}

function diffAttribute(dom, vnode) {
    const oldAttrs = {}
    const newAttrs = vnode.attrs
    const domAttrs = document.querySelector('#root').attributes
    const attrArray = [...domAttrs]
    attrArray.forEach(item => {
        oldAttrs[item.name] = item.value
    })

    for (let key in oldAttrs) {
        if (!(key in newAttrs)) {
            setAttribute(dom, key, undefined)
        }
    }

    for (let key in newAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            setAttribute(dom, key, newAttrs[key])
        }
    }
}