/**
 *
 * Copyright (c) 2014 "Signal K" [http://signalk.github.io]
 *
 * This file is part of react-consumer
 *
 * react-consumer is free software: you can redistribute it and/or modify it
 * under the terms of the GNU Affero General Public License as published by the
 * Free Software Foundation, either version 3 of the License, or (at your
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License
 * for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 * @jsx React.DOM
 */

var DataList = React.createClass({
  getInitialState: function() {
    return {data: {
      "navigation": {
		 "courseOverGroundMagnetic":{"value": null},
        "courseOverGroundTrue":{"value": null},
        "speedOverGround": {"value": null},
        "position": {
          "latitude": {"value": null},
          "longitude": {"value": null}
        }
      },
      "environment": {
        "wind": {
          "directionApparent": {"value": null},
			"directionTrue": {"value": null},
			"speedTrue": {"value": null},
          "speedApparent": {"value": null}
        }
      }
    }};
  },
  componentDidMount: function() {
	  console.log("Loading socket..");
	  var location = "ws://"+window.location.hostname+":9292/signalk/stream";
			//alert(location);
			
	var socket = new WebSocket(location);
	socket.binaryType = "arraybuffer";
   // var socket = io.connect(this.props.url);
    var that = this;
    //socket.on('signalk', function(data) {
	  socket.onopen = function() {
			};
	  socket.onmessage = function(m) {
		  var mObj = JSON.parse(m.data);
		  //console.log(JSON.stringify(mObj));
		  var s = mObj.vessels.self;//data.self;
			console.log(s);
		  that.setState({data: s});
		};
	  socket.onclose = function() {
				socket = null;
			};
		socket.onerror = function(error) {
			//popped = true;
			alert('Cannot connect to Freeboard server:'+JSON.stringify(error));
			//popped=false;
		};
  },
  render: function() {
	  console.log("Loading page..");
    var loc = [
      {name: "Latitude", value: this.state.data.navigation.position.latitude.value,
       unit: "\u00B0"},
      {name: "Longitude", value: this.state.data.navigation.position.longitude.value,
       unit: "\u00B0"}
    ];

    var cog = [
		{name:"Magnetic", value: this.state.data.navigation.courseOverGroundMagnetic.value,
       unit: "\u00B0"},
      {name:"True", value: this.state.data.navigation.courseOverGroundTrue.value,
       unit: "\u00B0"}
    ];

    var sog = [
      {value: this.state.data.navigation.speedOverGround.value,
       unit: "m/s"}
    ];

   

    var twd = [
      {name: "Angle", value: this.state.data.environment.wind.directionTrue.value,
       unit: "\u00B0"},
      {name: "Speed", value: this.state.data.environment.wind.speedTrue.value,
       unit: "m/s"}
    ];

    var awd = [
      {name: "Angle",
       value: this.state.data.environment.wind.directionApparent.value,
       unit: "\u00B0"},
      {name: "Speed", value: this.state.data.environment.wind.speedApparent.value,
       unit: "m/s"}
    ];

    return (
      <div className="container-inner">
        <h1>Signal K React Demo</h1>
        <div className="dataList">
          <DataBox name="Location" data={loc} />
	
          <DataBox name="Course Over Ground" data={cog} />
          <DataBox name="Speed Over Ground" data={sog} />
         
          <DataBox name="True Wind" data={twd} />
          <DataBox name="Apparent Wind" data={awd} />
        </div>
      </div>
    );
  }
});

var DataBox = React.createClass({
  render: function() {
    var dataElements = this.props.data.map(function(d) {
      return (
        <DataElement name={d.name} value={d.value} unit={d.unit} />
      );
    });
    return (
      <div className="dataBox">
        {dataElements}
        <footer>{this.props.name}</footer>
      </div>
    );
  }
});

var DataElement = React.createClass({
  render: function() {
    var v = this.props.value || 0;
	 
	if(this.props.name === 'Latitude' || this.props.name === 'Longitude') {
      v = v.toFixed(5);
    }else{
		v = v.toFixed(2);
	}
    
    if(this.props.name) {
      this.props.name += ":";
    }
    return (
      <div className="dataElement">
        <label>{this.props.name}</label>
        <span>{v}{this.props.unit}</span>
      </div>
    );
  }
});

React.renderComponent(
    <DataList url={"ws://" + location.hostname + ":9292/signalk/stream"} />,
    document.getElementById('container')
);

