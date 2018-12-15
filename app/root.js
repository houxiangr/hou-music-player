import React from 'react'
import Header from './components/header'
import Player from './page/player'
import { MUSIC_LIST } from './data/musiclist'
import MusicList from './page/musiclist'
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom'
import Pubsub from 'pubsub-js'

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            musicList: MUSIC_LIST,
            currentMusicItem: MUSIC_LIST[0]
        }
    }

    playMusic(musicItem){
        //播放音乐
        $('#player').jPlayer("setMedia", {
            mp3: musicItem.file
        }).jPlayer('play');
        //更改状态
        this.setState({
            currentMusicItem: musicItem
        })
    }
    //播放下一曲
    playNext(type){
        let index = this.findMusicIndex(this.state.currentMusicItem);
        let nextIndex;
        if(type === 'next'){
            nextIndex = index+1 >= this.state.musicList.length?0:index+1;
        }else if(type === 'prev'){
            nextIndex = index-1 >= 0?(index-1):(this.state.musicList.length-1);
        }
        console.log(nextIndex);
        this.playMusic(this.state.musicList[nextIndex]);
    }
    findMusicIndex(currMusic){
        return this.state.musicList.indexOf(currMusic);
    }
    componentDidMount() {
        //设置参数
        $('#player').jPlayer({
            supplied: "mp3",
            wmode: "window",
            useStateClassSkin: true
        });
        //音乐播放完成逻辑
        $('#player').bind($.jPlayer.event.ended, (e) => {
            this.playNext('next');
        });
        this.playMusic(this.state.currentMusicItem);
        Pubsub.subscribe('DELETE_MUSIC', (msg, musicItem) => {
            this.setState({
               musicList: this.state.musicList.filter(item => {
                   return item !== musicItem;
               })
            });
        });
        Pubsub.subscribe('PLAY_MUSIC', (msg, musicItem) => {
            this.playMusic(musicItem)
        });
        Pubsub.subscribe('MUSIC_NEXT', (msg) => {
            console.log(msg);
            this.playNext("next");
        });
        Pubsub.subscribe('MUSIC_PREV', (msg) => {
            console.log(msg);
            this.playNext("prev");
        })

    }

    componentWillUnmount(){
        Pubsub.unsubscribe('DELETE_MUSIC');
        Pubsub.unsubscribe('PLAY_MUSIC');
        Pubsub.unsubscribe('MUSIC_NEXT');
        Pubsub.unsubscribe('MUSIC_PREV');
        $('#player').unbind($.jPlayer.event.ended);
    }

    render() {
        return (
            <div>
                <Header/>
                <Switch>
                    <Route exact path="/" render={(props) => (<Player {...props} currentMusicItem={this.state.currentMusicItem} />)}/>
                    <Route  path="/list" render={(props) => (<MusicList {...props} currentMusicItem={this.state.currentMusicItem} musiclist={this.state.musicList} />)} />
                </Switch>
            </div>
        );
    }
}

class Root extends React.Component {
    render(){
        return (
            <Router>
                <App/>
            </Router>
        );
    }
}

export default Root;