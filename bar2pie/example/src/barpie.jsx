"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');

var RatioCard = require('react-d3-mobile-card').RatioCard;
var BarChart = require('react-d3-basic').BarChart;
var BarHorizontalChart = require('react-d3-basic').BarHorizontalChart;

var css = require('./css/style.css');

// Example
(function() {
  var width = 300;
  var height = 400;
  var raw = require('json!../data/water.json');
  var title = function(d) { return d.name; }
  var max = function(d) {return 100; };
  var value = function(d) { return d.percentage; }
  var note = function(d) {
    return '<div><b>更新時間：' + d.updateAt + '</b></div>'
    + '有效蓄水量：' + d.volumn;
  }

  var cards = [];
  var data = [];

  var color = d3.scale.quantize()
                .domain([.25, .5, 1])
                .range(['#FF7777', 'rgb(255, 160, 119)', 'steelblue'])

  for(var key in raw) {
    var titleSet = title(raw[key]);
    var maxSet = max(raw[key]);
    var valueSet = value(raw[key]);
    var noteSet = note(raw[key]);

    data.push(Object.assign(raw[key], {_style: {fill: color(valueSet / 100)}}));

    cards.push(
      <RatioCard
        key= {key}
        data= {raw[key]}
        width= {width}
        height= {height}
        title= {titleSet}
        max= {maxSet}
        value= {valueSet}
        note= {noteSet}
        colorDomain= {[.25, .5, 1]}
        colorRange= {['#FF7777', 'rgb(255, 160, 119)', 'steelblue']}
        titleClass= {"title-test-class"}
        donutClass= {"donut-test-class"}
        noteClass= {"note-test-class"}
      />
    )
  }

  var chartSeries = [
      {
        field: 'percentage',
        name: 'Percentage',
        style: {
          'fill-opacity': .8
        }
      }
    ],
    x = function(d) {
      return d.name;
    },
    xScale = 'ordinal',
    y = function(d) {
      return +d / 100;
    },
    yDomain= [.01, 1],
    yTicks = [10, "%"]

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

      var barchart = (
        <BarChart
          width= {width}
          height= {height}
          data= {data}
          chartSeries = {chartSeries}
          x= {x}
          xScale= {xScale}
          y= {y}
          yDomain= {yDomain}
          yTicks= {yTicks}
          showXGrid= {true}
          showYGrid= {true}
        />
      )

      var barhorizontalchart = (
        <BarHorizontalChart
          width= {width}
          height= {height}
          data= {data}
          chartSeries = {chartSeries}
          x= {y}
          xDomain= {yDomain}
          xTicks= {yTicks}
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
            {barchart}
          </div>
        )
      }
    }
  })


  ReactDOM.render(
    <Container/>
  , document.getElementById('blank-barpie')
  )
})()
