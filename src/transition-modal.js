import React, { Component } from 'react'
import './App.css'
import ReactTransitions from 'react-transitions'
import 'react-transitions/dist/animations.css'

const childStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'powderblue'
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: 0,
      images: []
    }
  }

  componentWillMount() {
    const { images } = this.props
    const array = []
    images[images.length-1].last = 'last'
    images.map((image) => {
      if (image.ContentType !== 4) {
        array.push(
          <span alt={image.sessionTransition} alt2={image.last}>
            <i className="align-right fa fa-times fa-2x" onClick={() => this.props.closeModal()}/>
            <img src={image.URL} style={ childStyle }/>
          </span>
        )
      } else {
        array.push(<span alt={image.sessionTransition} alt2={image.last}>
          <i className="align-right fa fa-times fa-2x" onClick={() => this.props.closeModal()}/>
            <video style ={{ margin: '13%', float: 'right' }} controls autoPlay>
            <source src={image.URL} type="video/mp4"/>
          </video>
        </span>)
      }
    })
    this.setState({ images: array })
  }

  onTransitionClick(last) {
    if (last === 'last') {
      this.props.closeModal()
    } else {
      this.setState({ clicked: this.state.clicked + 1 })
    }
  }

  render() {
    const { clicked, images } = this.state
    const index = this.state.clicked % images.length
    const comp = React.cloneElement( images[ index ], { key: index } )
    return (
      <div className="transition">
        <ReactTransitions
          transition={comp.props.alt === 'rotate' ? 'rotate-cube-left-out-rotate-cube-left-in' : 'move-to-left-move-from-right'}
          width={ 600 }
          height={ 300 }
          onClick={this.onTransitionClick.bind(this, comp.props.alt2)}
        >
        { comp }
        </ReactTransitions>
      </div>
    )
  }
}

export default App
