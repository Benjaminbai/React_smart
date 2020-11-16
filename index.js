import React from './react'
import ReactDOM from './react-dom'

// const ele = (
//     <div className="active" title="123">
//         hello <span>react</span>
//     </div>
// )

// function Home() {
//     return (
//         <div className="active" title="123">
//             hello <span>react</span>
//         </div>
//     )
// }
const title = 'active'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            num: 0
        }
    }
    componentWillMount() {
        console.log('组建将要加载')
    }
    componentWillReceiveProps(props) {
        console.log('props')
    }
    componentWillUpdate() {
        console.log('组建将要更新')
    }
    componentDidUpdate() {
        console.log('组建更新完成')
    }
    componentDidMount() {
        console.log('组建加载完成')
    }
    handleClicks(){
        this.setState({
            num: this.state.num + 1
        })
    }
    render() {
        return (
            <div className="active" title="123">
                hello <span>react</span> {this.state.num}
                <button onclick={this.handleClicks.bind(this)}>click</button>
            </div>
        )
    }
}

ReactDOM.render(<Home name={title} />, document.querySelector('#root'))