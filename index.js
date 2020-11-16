import React from './react'
import ReactDOM from './react-dom'
const ele = <div className='title' title='123'>
    <h3 className='3'>hello <span><a href='http://www.baidu.com'>react</a> </span></h3>
</div>
ReactDOM.render(ele, document.getElementById('root'))
