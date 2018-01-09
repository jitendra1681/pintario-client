import React, { Component } from 'react'
import $ from 'jquery'
import moment from 'moment'
import _ from 'lodash'
// import logo from './logo.svg'
import './App.css'
const hostName = 'http://52.14.73.5:9000'
// const hostName = 'http://localhost:9000'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      connectionTitle: '',
      createdAt: '',
      sessionConnections: [],
      comments: [],
      likes: []
    }
  }

  componentWillMount() {
    const { id } = this.props.match.params
    $.ajax({
      url: `${hostName}/api/v2/session/single/${id}`,
      type: "GET",
      cache: false,
      success: (data) => {
        console.log(data.data[0])
        this.setState({
          firstName: _.get(data.data[0], 'User.FirstName', 'Fyndario'),
          connectionTitle: _.get(data.data[0], 'ConnectionTitle') !== '' ? _.get(data.data[0], 'ConnectionTitle', 'Fyndario') : _.get(data.data[0], 'SessionDescription', 'Fyndario'),
          createdAt: moment(_.get(data.data[0], 'created', moment())).from(moment()),
          sessionConnections: _.get(data.data[0], 'SessionConnection', 'Fyndario'),
          profileImageUrl: _.get(data.data[0], 'User.ProfileImageURL', '/images/Fyndario_icon.png')
        })
      }
    })
    $.ajax({
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTQ2LCJpYXQiOjE1MTQ3OTk0ODIsImV4cCI6MTU0NjM1NzA4Mn0.avGl_ouS7My73mSwDMjQ_RTkQOGD2iFTtdAyL7k37pA'
      },
      url: `${hostName}/api/v2/user/comment/${id}`,
      type: "GET",
      cache: false,
      success: (data) => {
        // console.log(data)
        this.setState({
          comments: data.data
        })
      }
    })
    $.ajax({
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTQ2LCJpYXQiOjE1MTQ3OTk0ODIsImV4cCI6MTU0NjM1NzA4Mn0.avGl_ouS7My73mSwDMjQ_RTkQOGD2iFTtdAyL7k37pA'
      },
      url: `${hostName}/api/v2/session/user/likes/${id}`,
      type: "GET",
      cache: false,
      success: (data) => {
        // console.log(data)
        this.setState({
          likes: data.data
        })
      }
    })
  }

  render() {
    return (
      <div className="App">
        <div className="main-wrapper">
          <header className="header"> 
            <div className="container bg-white" style={{maxWidth: '880px', width: '100%'}}>
              <div className="row">
                <div className="col-md-2 pull-left">
                  <a href="#"><img src="images/logo.png" className="img-responsive logo-img"/></a>
                </div> 
                <div className="col-md-3 pull-right text-right">
                  <button className="btn btn-default get-the-app">Get the app</button>
                </div>
              </div>
            </div>
          </header> 

           <div id="container"> 
            <div className="row">
              <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="left-slider">
                {this.state.sessionConnections.map((sessionConnection) => {
                  return(
                    sessionConnection.SessionParts.map((sessionPart, i) => {
                      return(
                      <div id="myCarousel" className="carousel slide" data-ride="carousel">
                       
                        <div className="carousel-inner">
                            <div className="item active">
                            <iframe width="100%" height="auto" src={sessionPart.URL} frameBorder="0" gesture="media" allow="encrypted-media" allowFullScreen></iframe>
                            </div>

                            {/*<div className="item">
                            <iframe width="100%" height="auto" src="https://www.youtube.com/embed/F0tXuanr7a8" frameBorder="0" gesture="media" allow="encrypted-media" allowFullScreen></iframe>
                            </div>

                            <div className="item" >
                           <iframe width="100%" height="auto" src="https://www.youtube.com/embed/F0tXuanr7a8" frameBorder="0" gesture="media" allow="encrypted-media" allowFullScreen></iframe>
                            </div>*/}
                        </div>
                        <div className="carousel-caption slider-bottom-box">
                              <p>{sessionConnection.SessionDescription}</p>
                          </div> 
                         <ol className="carousel-indicators">
                            <li data-target="#myCarousel" data-slide-to={i} className="active"></li>
                            {/*<li data-target="#myCarousel" data-slide-to="1"></li>
                            <li data-target="#myCarousel" data-slide-to="2"></li>*/}
                         </ol>
                        <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                            <span className="glyphicon glyphicon-chevron-left"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="right carousel-control" href="#myCarousel" data-slide="next">
                            <span className="glyphicon glyphicon-chevron-right"></span>
                            <span className="sr-only">Next</span>
                        </a>
                      </div>
                    )})
                  )})}
                </div>
              </div>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="right-side">
                  <div className="profile-sec">
                    <div className="comment">
                      <div className="dotts">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                      <img src={this.state.profileImageUrl} className="photo"/>
                      <div className="comment-text">
                        <p className="name">{this.state.firstName}</p>
                        <span className="time">{this.state.createdAt}</span>
                        <h2>{this.state.ConnectionTitle}</h2>
                      </div>
                      </div>
                  </div>
                  <div className="comment-like">
                    <div className="row">
                      <div className="col-md-6 col-sm-6 col-xs-6 text-center">
                        <p>{this.state.comments.length} Comment</p>
                      </div>
                      <div className="col-md-6 col-sm-6 col-xs-6 text-center">
                        <p>{this.state.likes.length} Likes</p>
                      </div>
                    </div>
                  </div>
                  {this.state.comments.map((comment, i) => {
                    return(
                      <div className="comment" key={i}>
                        <img src={_.get(comment, 'User.ProfileImageURL', '/images/Fyndario_icon.png')} className="photo img-responsive"/>
                        <div className="comment-text">
                          <p className="name">{comment.User.FirstName}</p>
                          <span className="time">{moment(comment.Created).from(moment())}</span>
                          <p>{comment.Comment}</p>
                        </div>
                      </div>
                    )
                  })}
                   
{/*                    <div className="comment">
                      <img src="https://pbs.twimg.com/profile_images/675012405047517184/Ye3-zMaW.jpg" className="photo img-responsive"/>
                      <div className="dotts">
                        <span className="comments-count">
                          23 COMMENTS
                        </span>
                      </div>
                      <div className="comment-text">
                        <p className="name">oberynmartell </p>
                        <span className="time">3 hours ago</span>
                        <p>It is rare to meet a Lannister who shares my enthusiasm for dead Lannisters.</p>
                      </div>
                    </div>
                    
                    <div className="comment">
                      <img src="https://pbs.twimg.com/profile_images/675012405047517184/Ye3-zMaW.jpg" className="photo"/>
                      <div className="comment-text">
                        <p className="name">petyrbaelish </p>
                        <span className="time">3 hours ago</span>
                        <p>Money buys a man's silence for a time. A bolt in the heart buys it forever.</p>
                      </div>
                    </div>*/}
                </div>  
                <div className="right-side-bottom">
                  <p>To Like and comment <b>get the app</b></p>
                </div>
              </div>
            </div>            
            </div>

          <footer className="footer"> 
            <div className="container" style={{maxWidth: '880px', width: '100%'}}>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-xs-12 pull-left">
                  <p>Get the app to follow people who inspire you</p>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12 pull-right btn-align-right">
                  <button className="btn btn-default get-the-app">Get the app</button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}

export default App
