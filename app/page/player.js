import React from 'react'
import Progress from "../components/progress";
import './player.less'
import { Link } from 'react-router-dom'
import Pubsub from "pubsub-js";


let duration = null;

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            volume: 0,
            isPlay: true,
            leftTime: ''
        };
        this.progressChangeHandler = this.progressChangeHandler.bind(this);
        this.play = this.play.bind(this);
    }

    componentDidMount() {
        let player = $("#player");
        //绑定时间变化事件
        player.bind($.jPlayer.event.timeupdate, (e) => {
            duration = e.jPlayer.status.duration;
            this.setState({
                volume: e.jPlayer.options.volume * 100,
                //获取当前播放的百分比
                progress: e.jPlayer.status.currentPercentAbsolute,
                leftTime: duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100 )
            })
        });
    }

    componentWillUnmount() {
        //解绑事件
        $('#player').unbind($.jPlayer.event.timeupdate);
    }

    //变化子组件传来的点击进度条事件
    progressChangeHandler(progress) {
        $('#player').jPlayer('play', duration * progress);
    }
    //变化音量
    changeVolumeHandler(progress){
        $('#player').jPlayer('volume', progress);
    }
    play(){
        if(this.state.isPlay) {
            $("#player").jPlayer('pause');
        }else{
            $("#player").jPlayer('play');
        }
        this.setState({
            isPlay: !this.state.isPlay
        });
    }
    prev(e){
        Pubsub.publish("MUSIC_PREV");
        e.stopPropagation();
    }
    next(e){
        Pubsub.publish("MUSIC_NEXT");
        e.stopPropagation();
    }
    formatTime(time){
        let min = Math.floor(time / 60);
        let sec = Math.floor(time - min*60);
        return min+":"+sec;
    }
    render() {
        return (
            <div className="player-page">
                <h1 className="caption"><Link to="/list">我的私人音乐坊</Link></h1>
                <div className="mt20 row">
                    <div className="controll-wrapper">
                        <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                        <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                        <div className="row mt20">
                            <div className="left-time -col-auto">-{this.formatTime(this.state.leftTime)}</div>
                            <div className="volume-container">
                                <i className="icon-volume rt" style={{top: 5, left: -5}}/>
                                <div className="volume-wrapper">
                                    <Progress progress={this.state.volume} onProgressChange={this.changeVolumeHandler} barColor="#aaa"/>
                                </div>
                            </div>
                        </div>
                        <div style={{height: 10, lineHeight: '10px'}}>
                            <Progress progress={this.state.progress} onProgressChange={this.progressChangeHandler} />
                        </div>
                        <div className="mt35 row">
                            <div>
                                <i className="icon prev" onClick={this.prev.bind(this)}/>
                                <i className={`icon ml20 ${this.state.isPlay ? 'pause':'play'}`} onClick={this.play}/>
                                <i className="icon next ml20" onClick={this.next.bind(this)}/>
                            </div>
                            <div className="-col-auto">
                                <i className="icon repeat"/>
                            </div>
                        </div>
                    </div>
                    <div className="-col-auto cover">
                        <img src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Player;