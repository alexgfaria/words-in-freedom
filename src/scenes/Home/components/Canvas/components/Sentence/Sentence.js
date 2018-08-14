import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Draggable from 'react-draggable'

class Sentence extends Component {
  static propTypes = {
    initialX: PropTypes.number.isRequired,
    initialY: PropTypes.number.isRequired,
    color: PropTypes.shape({}).isRequired,
    sentence: PropTypes.string.isRequired,
    font: PropTypes.shape({
      family: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      rotation: PropTypes.string.isRequired,
    }).isRequired,
    offsetParent: PropTypes.any.isRequired,
    onClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.state = {
      position: {
        x: props.initialX,
        y: props.initialY,
      },
      family: undefined,
      fontColor: undefined,
      size: undefined,
      sentence: undefined,
      rotation: undefined,
      spacing: undefined,
      height: undefined,
      linkedToGlobal: false,
    }
  }

  getTransformOrigin = () => {
    const { position } = this.state
    const { offsetParent } = this.props

    const originX = offsetParent.clientWidth / 2 - position.x
    const originY = offsetParent.clientHeight / 2 - position.y
    
    return `${originX}px ${originY}px`
  }

  handleDrag = (ev) => {
    this.setState(() => {
      const x = ev.x - this.mouseX
      const y = ev.y - this.mouseY

      return { position: { x, y }}
    })

  }

  handleMouseDown = (ev) => {
    this.props.onClick()
    this.mouseX = ev.nativeEvent.x - this.state.position.x 
    this.mouseY = ev.nativeEvent.y - this.state.position.y
  }

  setSentenceParameter = (params, linkedToGlobal) => {
    this.setState({
      ...params,
      linkedToGlobal,
    })
  }

  getCustomStyle = () => {
    const { color, font } = this.props
    const {
      fontColor,
      family,
      size,
      spacing,
      rotation,
      height,
      linkedToGlobal
    } = this.state

    const isGlobal = (self, global) => linkedToGlobal
      ? global
      : self || global

    return {
      display: 'inline-block',
      cursor: 'pointer',
      whiteSpace: 'pre',
      color: isGlobal(fontColor, color.foreground),
      fontFamily: isGlobal(family, font.family),
      fontSize: isGlobal(size, font.size) + 'px',
      transform: `rotate(${isGlobal(rotation, font.rotation)}deg)`,
      transformOrigin: 'center', // (linkedToGlobal && rotation) ? 'center' : this.getTransformOrigin(),
      letterSpacing: `${isGlobal(spacing, font.spacing)}px`,
      lineHeight: height ? `${height}px` : undefined,
    }
  }

  render() {
    const {
      sentence,
      initialX,
      initialY,
      onClick,
      ...props
    } = this.props

    return (
      <Draggable
        axis="both"
        defaultPosition={{
          x: initialX,
          y: initialY,
        }}
        position={this.state.position}
        onDrag={this.handleDrag}
        onMouseDown={this.handleMouseDown}
        handle=".sentence"
        {...props}
      >
        <div style={{ position: 'absolute' }} onClick={onClick}>
          <span className="sentence" style={{...this.getCustomStyle()}}>
            {this.state.sentence || sentence}
          </span>
        </div>
      </Draggable>
    )
  }
}

export default Sentence