
import { setAttribute, setComponentProps, createComponent } from './index'
export function diff(dom, vnode, container) {
    const ret = diffNode(dom, vnode)
    if (container) {
        container.appendChild(ret)
    }

    return ret
}

export function diffNode(dom, vnode) {
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

    if (typeof vnode.tag === 'function') {
        return diffComponent(out, vnode)
    }

    if (!dom) {
        out = document.createElement(vnode.tag)
    }
    if (vnode.childrens && vnode.childrens.length > 0 || (out.childNodes && out.childNodes > 0)) {
        diffChildren(out, vnode.childrens)
    }
    diffAttribute(out, vnode)
    return out
}

function diffComponent(dom, vnode) {
    let comp = dom
    if (comp && comp.constructor === vnode.tag) {
        setComponentProps(comp, vnode.attrs)
        dom = comp.base
    } else {
        if (comp) {
            unmountComponent(comp)
            comp = null
        }
        comp = createComponent(vnode.tag, vnode.attrs)
        setComponentProps(comp, vnode.attrs)
        dom = comp.base
    }
    return dom
}

function unmountComponent(comp) {
    removeNode(comp.base)
}
function removeNode(dom) {
    if (dom && dom.parentNode) {
        dom.parentNode.removeNode(dom)
    }
}
function diffChildren(dom, vchildrens) {
    const domChildren = dom.childNodes
    const children = []
    const keyed = {}

    if (domChildren.length > 0) {
        domChildren.forEach((c) => {
            if (c.attributes && "key" in c.attributes) {
                keyed.attributes["key"] = c
            } else {
                children.push(c)
            }
        })
    }

    if (vchildrens && vchildrens.length > 0) {
        let min = 0
        let childrenLen = children.length
        const vchildrensArray = [...vchildrens]
        vchildrensArray.forEach((vchild, i) => {
            const key = vchild.key
            let child
            if (key) {
                if (keyed[key]) {
                    child = keyed[key]
                    keyed[key] = undefined
                }
            } else if (childrenLen > min) {
                for (let j = min; j < childrenLen; j++) {
                    let c = children[j]
                    if (c) {
                        child = c
                        children[j] = undefined
                        if (j == childrenLen - 1) childrenLen--
                        if (j == min) min++
                        break
                    }
                }
            }
            child = diffNode(child, vchild)
            const f = domChildren[i]
            if (child && child !== dom && child !== f) {
                if (!f) {
                    dom.appendChild(child)
                } else if (child === f.nextSibling) {
                    removeNode(f)
                } else {
                    dom.insertBefore(child, f)
                }
            }
        });
    }
}

function diffAttribute(dom, vnode) {
    const oldAttrs = {}
    const newAttrs = vnode.attrs
    const domAttrs = dom.attributes
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