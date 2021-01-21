import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './Gantt.css';
 
export default class Gantt extends Component {
//repaint the view on updates
    componentDidMount() {
        gantt.config.columns = [
            {name: "wbs", label: "WBS", width: 70, template: gantt.getWBSCode, resize:true},
            {name: "text", label: "Name", tree: true, width: 300, resize:true},
            {name: "start_date", label:"Start", align: "center", width: 100, resize:true},
            {name: "end_date", label:"End", align: "center", width: 100, resize:true},
            {name: "duration", label: "Duration", align: "center", width: 100, resize:true},
            // more columns
            {name:"add", label:"", width:44 }
        ];
        gantt.config.date_format = "%Y-%m-%d %H:%i";//資料讀取格式
        gantt.config.work_time = true;  // removes non-working time from calculations
        gantt.config.open_tree_initially = true;

        gantt.serverList("people", [
            {key: 1, label: "John"},
            {key: 2, label: "Mike"},
            {key: 3, label: "Anna"},
            {key: 4, label: "Bill"},
            {key: 7, label: "Floe"}
          ]);
        gantt.config.lightbox.sections = [
            {name: "details", height: 38, type: "textarea", focus: true},
            {name:"leader", type:"resources", options:gantt.serverList("people"),map_to:"owner", default_value:0},//因為沒付費resources功能不完整
            {name: "time", type: "duration", map_to: "auto"},
          ];
        gantt.locale.labels.section_details = "Details";
        gantt.locale.labels.section_leader = "Leader";

        const { tasks } = this.props;
        gantt.init(this.ganttContainer);
        this.initGanttDataProcessor();
        gantt.parse(tasks);
    }

    render() {
        const { zoom } = this.props;
        this.setZoom(zoom);
        return (
          <div
            ref={(input) => { this.ganttContainer = input }}
            style={{ width: '100%', height: '100%' }}
          ></div>
          
       );
    }

    setZoom(value) {
        switch (value) {
            case 'Hours':
                gantt.config.scale_unit = 'day';
                gantt.config.date_scale = '%d %M';

                gantt.config.scale_height = 60;
                gantt.config.min_column_width = 30;
                gantt.config.subscales = [
                    { unit:'hour', step:1, date:'%H' }
                ];
            break;
            case 'Days':
                gantt.config.min_column_width = 70;
                gantt.config.scale_unit = 'week';
                gantt.config.date_scale = '#%W';
                gantt.config.subscales = [
                    { unit: 'day', step: 1, date: '%d %M' }
                ];
                gantt.config.scale_height = 60;
            break;
            case 'Months':
                gantt.config.min_column_width = 70;
                gantt.config.scale_unit = 'month';
                gantt.config.date_scale = '%F';
                gantt.config.scale_height = 60;
                gantt.config.subscales = [
                    { unit:'week', step:1, date:'#%W' }
                ];
            break;
            case 'Quarters':
                var quarterScaleTemplate = function (date) {
                    var dateToStr = gantt.date.date_to_str("%M");
                    var endDate = gantt.date.add(gantt.date.add(date, 3, "month"), -1, "day");
                    return dateToStr(date) + " - " + dateToStr(endDate);
                  };
                gantt.config.min_column_width = 70;
                gantt.config.scale_unit = 'quarter';
                gantt.templates.date_scale = quarterScaleTemplate;
                gantt.config.scale_height = 60;
                gantt.config.subscales = [
                    { unit: "month", step: 1, format: "%M" }
                ];
            break;
            case 'Years':
                gantt.config.min_column_width = 70;
                gantt.config.scale_unit = 'year';
                gantt.config.date_scale = "%Y";
                gantt.config.scale_height = 60;
                gantt.config.subscales = [
                    { unit: "month", step: 1, date: "%M" }
                ];
            break;
            default:
            break;
        }
    }


//determine if we need to update the view
    shouldComponentUpdate(nextProps) {
        return this.props.zoom !== nextProps.zoom;
    }

    componentDidUpdate() {
        gantt.render();
    }
//更改紀錄
    initGanttDataProcessor() {
        const onDataUpdated = this.props.onDataUpdated;
        this.dataProcessor = gantt.createDataProcessor((entityType, action, item, id) => {
            return new Promise((resolve, reject) => {
                if (onDataUpdated) {
                    onDataUpdated(entityType, action, item, id);
                }
                return resolve();
            });
        });
    }
    componentWillUnmount() {
        if (this.dataProcessor) {
            this.dataProcessor.destructor();
            this.dataProcessor = null;
        }
    }

}