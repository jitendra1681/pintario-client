import React, { Component } from 'react'
import $ from 'jquery'
import moment from 'moment'
import _ from 'lodash'
import './App.css'
import ReactTransitions from 'react-transitions'
import 'react-transitions/dist/animations.css'

const centeredStyle = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  top: '50%',
  left: '50%'
};
const noWrapStyle = {
  whiteSpace: 'nowrap'
};
const childStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'powderblue'
};
const divGrandStyle = {
  textAlign: 'center',
  fontFamily: '"Lato", Calibri, Arial, sans-serif',
  fontSize: 60,
  color: '#fff'
};
const divCenteredGrandStyle = {
  ...divGrandStyle,
  ...centeredStyle
};
const divSemiGrandStyle = {
  ...divGrandStyle,
  height: '50%',
  position: 'relative'
};
const divSemiGrandUpStyle = {
  ...divSemiGrandStyle,
  backgroundColor: 'lightpink'
};
const divSemiGrandDownStyle = {
  ...divSemiGrandStyle,
  backgroundColor: 'lightgreen',
  ...noWrapStyle
};

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
    images.map((image) => {
      if (image.ContentType !== 4) {
        array.push(<img src={image.URL} style={ childStyle } alt={image.sessionTransition}/>)
      } else {
        array.push(<video controls autoPlay>
          <source src={image.URL} type="video/mp4"/>
        </video>)
      }
    })
    this.setState({ images: array })
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
          onClick={ () => this.setState( { clicked: this.state.clicked + 1 } ) }
        >
        { comp }
        </ReactTransitions>
      </div>
    )
  }
}

export default App
