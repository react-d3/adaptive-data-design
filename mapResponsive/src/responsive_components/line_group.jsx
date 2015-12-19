"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {LineGroup} from 'react-d3-map';
import {LineGroup as MobileLineGroup} from 'react-d3-map-mobile'

export default class ResponsiveLine extends Component {
  constructor(props) {
    super(props);
  }

  static contextTypes = {
    mobile: React.PropTypes.bool
  }

  render() {
    const {
      mobile
    } = this.context;

    const {
      popupContent
    } = this.props;

    var chart;

    if(mobile) {
      chart = (
        <MobileLineGroup
          {...this.props}
          overlayContent= {popupContent}
        />
      )
    }else {
      chart = (
        <LineGroup
          {...this.props}
        />
      )
    }

    return chart;
  }
}
