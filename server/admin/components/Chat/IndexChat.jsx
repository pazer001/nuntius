import React from 'react';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import Chats from './Chats.jsx';
import Banners from './Banners.jsx';
import Actions from './Actions.jsx';
import Sessions from './Sessions.jsx';

export default class Index extends React.Component {
    render() {
        return (
            <article>
                <div className="row">
                    <Sessions />
                </div>
                <div className="row">
                    <Actions />
                </div>
                <Banners />
                <Chats />
            </article>
        )
    }
}