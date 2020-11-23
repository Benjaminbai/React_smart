import Component from './component'

// 实现react的createelement
function createElement(tag, attrs, ...childrens) {
    attrs = attrs || {}
    return {
        tag,
        attrs,
        childrens,
        // 用来标记diff算法中的key
        key: attrs.key || null
    }
}

export default {
    createElement,
    Component
}

