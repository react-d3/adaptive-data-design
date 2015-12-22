"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var TagCard = require('react-d3-mobile-card').TagCard;
var BarChart = require('react-d3-basic').BarChart;
var BarHorizontalChart = require('react-d3-basic').BarHorizontalChart;

var projectionFunc = require('react-d3-map-core').projection;
var tileFunc = require('react-d3-map-core').tileFunc;
var Voronoi = require('react-d3-map-core').Voronoi;
var Chart = require('react-d3-map-core').Chart;
var Tile = require('react-d3-map-core').Tile;

var css = require('./css/style.css');

// Example
(function() {
  var width = 300;
  var height = 400;
  var site = require('json!../data/site.json');
  var air = require('json!../data/air.json');
  var data = air[0].data;
  var title = function(d) { return d.SiteName; }
  var pm = function(d) { return d['PM2_5']; }
  // var value = function(d) { return d.Status; }
  var note = function(d) {
    return '<div>狀態：' + d.Status + '</div><div>PM2.5：' + d['PM2_5'] + '</div>';
  }

  var chartSeries = [
      {
        field: 'PM2_5',
        name: 'PM 2.5',
        style: {
          'fill-opacity': .5
        }
      }
    ],
    x = function(d) {
      return d.SiteName;
    },
    xScale = 'ordinal',
    y = function(d) {
      return +d;
    }

  data.map(function(d) {

    var pmSet = pm(d);
    var color;
    var text;

    if(pmSet < 12 && pmSet >= 0) {
      color = 'rgb(156, 255, 156)';
      text = '低';
    }else if(pmSet < 24 && pmSet >= 12) {
      color = 'rgb(49, 255, 0)';
      text = '低'
    }else if(pmSet < 36 && pmSet >= 24) {
      color = 'rgb(49, 207, 0)';
      text = '低'
    }else if(pmSet < 42 && pmSet >= 36) {
      color = 'rgb(255, 255, 0)';
      text = '中'
    }else if(pmSet < 48 && pmSet >= 42) {
      color = 'rgb(255, 207, 0)';
      text = '中'
    }else if(pmSet < 54 && pmSet >= 48) {
      color = 'rgb(255, 154, 0)'
      text = '中'
    }else if(pmSet < 59 && pmSet >= 54) {
      color = 'rgb(255, 100, 100)'
      text = '高'
    }else if(pmSet < 65 && pmSet >= 59) {
      color = 'rgb(255, 0, 0)'
      text = '高'
    }else if(pmSet < 71 && pmSet >= 65) {
      color = 'rgb(153, 0, 0)'
      text = '高'
    }else if(pmSet >= 71) {
      color = 'rgb(206, 48, 255)'
      text = '非常高'
    }

    d._style = {
      fill: color
    }

    d.StatusText = text;

    return d;
  })

  var m = d3.map(data, function(d) {
    return d.SiteName;
  })

  // map site and add style
  var siteData = site.map(function(d) {
    var c = m.get(d.SiteName);
    var pm = c['PM2_5'];
    var color;

    if(pm < 12 && pm >= 0) {
      color = 'rgb(156, 255, 156)';
    }else if(pm < 24 && pm >= 12) {
      color = 'rgb(49, 255, 0)';
    }else if(pm < 36 && pm >= 24) {
      color = 'rgb(49, 207, 0)';
    }else if(pm < 42 && pm >= 36) {
      color = 'rgb(255, 255, 0)';
    }else if(pm < 48 && pm >= 42) {
      color = 'rgb(255, 207, 0)';
    }else if(pm < 54 && pm >= 48) {
      color = 'rgb(255, 154, 0)'
    }else if(pm < 59 && pm >= 54) {
      color = 'rgb(255, 100, 100)'
    }else if(pm < 65 && pm >= 59) {
      color = 'rgb(255, 0, 0)'
    }else if(pm < 71 && pm >= 65) {
      color = 'rgb(153, 0, 0)'
    }else if(pm >= 71) {
      color = 'rgb(206, 48, 255)'
    }

    d.style = {
      'fill': color,
      'fill-opacity': .3
    };

    d.publish = c.PublishTime

    return d;
  })


  var Container = React.createClass({
    getInitialState: function() {
      return {width: window.innerWidth - 50, height: window.innerHeight - 50}
    },
    updateDimensions: function() {
      this.setState({width: window.innerWidth- 50, height: window.innerHeight - 50});
    },
    componentWillMount: function() {
      this.updateDimensions();
    },
    componentDidMount: function() {
      window.addEventListener("resize", this.updateDimensions);
    },
    render: function() {
      var width = this.state.width;
      var height = this.state.height;

      // map settings
      var scale = 10000;
      var center = [120.979531, 23.5];
      var translate = [width / 2, height / 2];
      var projection = 'mercator';

      var proj = projectionFunc({
        projection: projection,
        scale: scale,
        translate: translate,
        center: center
      });

      var xMap = function(d) { return +proj([d.TWD97Lon, d.TWD97Lat])[0]; }
      var yMap = function(d) { return +proj([d.TWD97Lon, d.TWD97Lat])[1]; }

      var tiles = tileFunc({
        scale: proj.scale() * 2 * Math.PI,
        translate: proj([0, 0]),
        size: ([width, height])
      })

      var cards = data.map(function(d, i) {

        var noteSet = note(d);
        var titleSet = title(d);
        var tagWidth = width

        if(tagWidth > 500) tagWidth = 500;

        return (
          <TagCard
            key= {i}
            data= {d}
            width= {tagWidth}
            height= {400}
            title= {titleSet}
            margins= {{left: 30, bottom: 30, right: 30, top: 30}}
            value= {d.StatusText}
            color= {d._style.fill}
            titleClass= {"tag-item-title"}
            itemClass= {"tag-item"}
            noteClass= {"tag-item-note"}
            note= {noteSet}
          />
        )
      })

      var map = (
        <Chart
          width= {width}
          height= {height}
        >
          <Tile
            scale= {tiles.scale}
            translate= {tiles.translate}
            tiles= {tiles}
          />
          <Voronoi
            width= {width}
            height= {height}
            data= {siteData}
            x= {xMap}
            y= {yMap}
          />
        </Chart>
      )

      var barhorizontalchart = (
        <BarHorizontalChart
          width= {width}
          height= {1500}
          data= {data}
          chartSeries = {chartSeries}
          x= {y}
          y= {x}
          yScale= {xScale}
          showXGrid= {true}
          showYGrid= {true}
        />
      )

      if(width < 800) {
        // small device
        return (
          <div>
            {cards}
          </div>
        )
      }else if(width < 1200) {
        // pad device
        return (
          <div>
            {barhorizontalchart}
          </div>
        )
      }else {
        // else device
        return (
          <div>
            {map}
          </div>
        )
      }
    }
  })


  ReactDOM.render(
    <Container/>
  , document.getElementById('blank-barordinal')
  )
})()
