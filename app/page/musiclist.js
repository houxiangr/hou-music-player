import React from 'react'
import MusicListItem from '../components/musicListItem'

class MusicList extends React.Component{
    render(){
        console.log(this.props);
        let listEle=this.props.musiclist.map((item) => {
            return <MusicListItem key={item.id} musicItem={item} focus={item === this.props.currentMusicItem}/>
        });
        return (
            <ul>
                { listEle }
            </ul>
        )
    }
}

export default MusicList;