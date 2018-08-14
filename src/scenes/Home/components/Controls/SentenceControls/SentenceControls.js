import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Slider from '../Slider/Slider'
import Select from '../Select/Select'

class SentenceControls extends Component {
  static propTypes = {
    sentenceRef: PropTypes.shape({
      setSentenceParameter: PropTypes.func,
      props: PropTypes.shape({}),
    }),
    color: PropTypes.shape({}).isRequired,
    fonts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }
  
  static defaultProps = {
    sentenceRef: {},
  }

  constructor(props) {
    super(props)

    this.state = {
      isLinkedToGlobal: false,
      value: '',
    }

    this.options = props.fonts.map(font => ({
      value: font.family,
      label: font.family,
    }))
  }

  componentWillReceiveProps({ sentenceRef }) {
    if ((sentenceRef !== this.props.sentenceRef)) {
      this.setState({ value: sentenceRef.state.sentence || sentenceRef.props.sentence })
    }
  }

  handleSentenceChange = ev => {
    ev.persist()
    const { sentenceRef } = this.props

    const value = ev.nativeEvent.target.value

    this.setState({ value })
    sentenceRef.setSentenceParameter({ sentence: value }, this.state.isLinkedToGlobal)
  }

  handleParameter = param => value => {
    this.props.sentenceRef.setSentenceParameter({
      [param]: value,
    }, this.state.isLinkedToGlobal)
  }

  render() {
    const {
      sentenceRef,
      color,
    } = this.props

    const {
      props,
      state,
    } = sentenceRef

    const baseStyle = styles(color)

    return props ? (
      <div style={baseStyle.container}>
        <textarea style={baseStyle.textarea} value={this.state.value} onChange={this.handleSentenceChange}/>
        <Select
          color={color}
          options={this.options}
          defaultValue={(state && state.family) || (props && props.font.family)}
          onChange={data => this.handleParameter('family')(data.value)}
          placeholder="Select font family"
        />
        <div style={baseStyle.sliders}>
          <Slider
            color={color}
            minValue={10}
            maxValue={60}
            onChange={this.handleParameter('size')}
            value={(state && state.size) || (props && props.font.size)}
            label="Font Size"
            style={baseStyle.slider}
          />
          <Slider
            color={color}
            minValue={4}
            maxValue={100}
            onChange={this.handleParameter('height')}
            value={(state && state.height) || (props && props.font.size)}
            label="Line Height"
            style={baseStyle.slider}
          />
          <Slider
            color={color}
            minValue={-180}
            maxValue={180}
            onChange={this.handleParameter('rotation')}
            value={(state && state.rotation) || (props && props.font.rotation)}
            label="Rotation"
            style={baseStyle.slider}
          />
          <Slider
            color={color}
            minValue={-20}
            maxValue={20}
            onChange={this.handleParameter('spacing')}
            value={(state && state.spacing) || (props && props.font.spacing)}
            label="Letter Spacing"
            style={baseStyle.slider}
          />
        </div>
      </div>
    ) : null
  }
}

const styles = color => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    flex: 1,
  },
  slider: {
  },
  sliders: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    widt: '100%',
    flexWrap: 'wrap',
    overflow: 'auto',
  },
  textarea: {
    flex: 1,
    resize: 'none',
    outline: 'none',
    color: color.foreground,
    fontSize: '20px',
    backgroundColor: color.background,
  }
})

const mapStateToProps = ({ color, fonts }) => ({ color, fonts: fonts.fonts })

export default connect(mapStateToProps)(SentenceControls)