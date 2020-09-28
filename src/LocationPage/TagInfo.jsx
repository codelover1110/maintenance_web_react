import React from "react";

function TagInfo(props) {
    return (
        <div>
            <h5>Technical Category: {props.technical_category}</h5>
            <h6>Equipment Name: {props.equipment_name}</h6>
            <h6>Service Interval: {props.service_interval}</h6>
            <h6>Legal: {props.legit}</h6>
            <h6>Latest Service: {props.latest_service}</h6>
            <h6>Expected Service: {props.expected_service}</h6>
            <img src={'http://localhost:8000/media/' + props.imgURL} className="info-image" />
        </div>
    );
}

export { TagInfo }