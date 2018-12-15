import React from 'react'
import './progress.less'

class Progress extends React.Component{
    constructor(props){
        super(props);
        this.changeProgress = this.changeProgress.bind(this);
    }
    changeProgress(e){
        // 通过ref获取progressBar元素
        let progressBar = this.refs.progressBar;
        let progress = (e.clientX - progressBar.getBoundingClientRect().left)/progressBar.clientWidth;
        if(this.props.onProgressChange){
            this.props.onProgressChange(progress);
        }
        e.stopPropagation();
        e.preventDefault();
    }
    render() {
        return (
          <div className="components-progress" onClick={this.changeProgress} ref="progressBar">
              <div className="progress" style={{width: `${this.props.progress}%`,background:`${this.props.barColor}`}}/>
          </div>
        );
    }
}

export default Progress;