import React, { Component } from 'react';
import Gantt from './Gantt';
import Toolbar from './Toolbar';
import MessageArea from './MessageArea';

const data = require('./json_array_output.json');//讀取本地資料

class GanttView extends Component {
//message
state = {
  currentZoom: 'Days',
  messages: [],
};

addMessage(message) {
    const maxLogLength = 5;
    const newMessate = { message };
    const messages = [
        newMessate,
        ...this.state.messages
    ];

    if (messages.length > maxLogLength) {
        messages.length = maxLogLength;
    }
    this.setState({ messages });
}

logDataUpdate = (entityType, action, itemData, id) => {
    let text = itemData && itemData.text ? ` (${itemData.text})`: '';
    let message = `${entityType} ${action}: ${id} ${text}`;
    if (entityType === 'link' && action !== 'delete' ) {
        message += ` ( source: ${itemData.source}, target: ${itemData.target} )`;
    }
    this.addMessage(message);
}

//schedule scale 
  handleZoomChange = (zoom) => {
    this.setState({
        currentZoom: zoom
    });
  }
  render() {
    const { currentZoom, messages } = this.state;
    return (
        <div >
            <div className="zoom-bar">
                <Toolbar
                    zoom={currentZoom}
                    onZoomChange={this.handleZoomChange}
                />
            </div>
            <div className="gantt-container">
                <Gantt
                    tasks={data}
                    zoom={currentZoom}
                    onDataUpdated ={ this.logDataUpdate }
                />
            </div>
            <MessageArea
                messages={ messages }
            />
        </div>
    );
  }
}
export default GanttView;
