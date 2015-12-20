"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

var RatioCard = require('react-d3-mobile-card').RatioCard;
var BarChart = require('react-d3-basic').BarChart;

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

  for(var key in raw) {
    var titleSet = title(raw[key]);
    var maxSet = max(raw[key]);
    var valueSet = value(raw[key]);
    var noteSet = note(raw[key]);

    data.push(raw[key]);

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
        colorRange= {['rgb(26,152,80)', 'rgb(165,0,38)']}
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

      if(width < 1200) {
        // small device
        return (
          <div>
            {cards}
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
