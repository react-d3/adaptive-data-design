"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');

var BarChart = require('react-d3-basic').BarChart;
var BarHorizontalChart = require('react-d3-basic').BarHorizontalChart;
var topojson = require('topojson');
var MapChoropleth = require('react-d3-map-choropleth').MapChoropleth;

var css = require('./css/style.css');

// Example
(function() {

  var topodata = require('json!../data/twTown1982.topo.json');
  var population = require('json!../data/population.json')['102']

  // data should be a MultiLineString
  var dataMeshCounties = topojson.mesh(topodata, topodata.objects["twTown1982.geo"], function(a, b) { return a !== b; });
  /// data should be polygon
  var dataCounties = topojson.feature(topodata, topodata.objects["twTown1982.geo"]).features;

  dataCounties.forEach(function(d, i) {
        if(d.properties.TOWNID === "1605" || d.properties.TOWNID === "1603" ||  d.properties.TOWNID=== "1000128") {
            dataCounties.splice(i, 1);
        }
    })

  var valArr = []
  var i = 0;
  for (var key in population) {
    for (var reg in population[key]) {
      valArr.push({
        "place": key.trim(),
        "region": key.trim() + '/' + reg.trim(),
        "value": +population[key][reg]
      });
    }
  }

  var regionN = ['新北市','台北市','基隆市','桃園縣','新竹縣','新竹市','宜蘭縣'];
  var regionM = ['台中市','苗栗縣','南投縣','彰化縣','雲林縣'];
  var regionS = ['高雄市','台南市','嘉義縣','嘉義市','高雄縣','澎湖縣'];
  var regionE = ['台東縣','花蓮縣'];
  var regionO = ['金門縣','連江縣']

  // domain
  var domain = {
    scale: 'quantize',
    domain: d3.extent(valArr, function(d) {return d.value;}),
    range: d3.range(11).map(function(i) { return "q" + i + "-11"; })
  };
  var domainValue = function(d) { return +d.value; };
  var domainKey = function(d) {return d.region};
  var mapKey = function(d) {return d.properties.name.trim()};
  var tooltipContent = function(d) { return d.properties;}

  var scale = 10000;
  var center = [120.979531, 23.978567];
  var projection = 'mercator';

  var chartSeries = [
      {
        field: 'value',
        name: 'population',
        style: {
          'fill-opacity': .5
        }
      }
    ],
    x = function(d) {
      return d.region;
    },
    xScale = 'ordinal',
    y = function(d) {
      return +d;
    }


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

      var map = (
        <MapChoropleth
          width= {width}
          height= {height}
          dataPolygon= {dataCounties}
          dataMesh= {dataMeshCounties}
          scale= {scale}
          domain= {domain}
          domainData= {valArr}
          domainValue= {domainValue}
          domainKey= {domainKey}
          mapKey = {mapKey}
          center= {center}
          projection= {projection}
          tooltipContent= {tooltipContent}
          showGraticule= {false}
        />
      )

      var barhorizontalchart = (
        <BarHorizontalChart
          width= {width}
          height= {height}
          data= {valArr}
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
        // return (
        //   <div>
        //     {cards}
        //   </div>
        // )
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
  , document.getElementById('blank-mapbar')
  )

})()
