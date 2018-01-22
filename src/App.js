import React, { Component } from 'react'
import $ from 'jquery'
import moment from 'moment'
import _ from 'lodash'
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
    const myArray = []
    $.ajax({
      url: `${hostName}/api/v2/session/single/${id}`,
      type: "GET",
      cache: false,
      success: (data) => {
        if (data.data.length > 0) {
          data.data[0].SessionConnection.map((sessionConnection) => {
            sessionConnection.SessionParts.map((sessionPart) => {
              sessionPart.SessionDescription = sessionConnection.SessionDescription
              myArray.push(sessionPart)
            })
          })
          this.setState({
            firstName: _.get(data.data[0], 'User.FirstName', 'Fyndario'),
            connectionTitle: _.get(data.data[0], 'ConnectionTitle') !== '' ? _.get(data.data[0], 'ConnectionTitle', 'Fyndario') : _.get(data.data[0], 'SessionDescription', 'Fyndario'),
            createdAt: moment(_.get(data.data[0], 'created', moment())).from(moment()),
            sessionConnections: myArray,
            profileImageUrl: _.get(data.data[0], 'User.ProfileImageURL', '/images/Fyndario_icon.png')
          })
        }
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
        this.setState({
          likes: data.data
        })
      }
    })
  }

  render() {
    const { likes, comments, firstName, profileImageUrl, sessionConnections, createdAt, connectionTitle} = this.state
    return (
      <div className="">
        <div className="main-wrapper">
          <header className="header"> 
            <div className="container bg-white" style={{maxWidth: '880px', width: '100%'}}>
              <div className="row">
                <div className="col-md-2 pull-left">
                  <a href="#"><img alt="" src="images/logo.png" className="img-responsive logo-img"/></a>
                </div> 
                <div className="col-md-3 pull-right text-right">
                  <button className="btn btn-default get-the-app" type="button" data-toggle="modal" data-target="#exampleModal">Get the app</button>
                </div>
              </div>
            </div>
          </header> 

           <div id="container"> 
            <div className="row">
              <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="left-slider">
                  <div id="myCarousel" className="carousel slide" data-ride="carousel" >
                    <div className="carousel-inner">
                      {sessionConnections.map((sessionConnection, i) => {
                        if (sessionConnection.ContentType !== 4) {
                          return(
                            <div className={i === 0 ? "item active" : "item"} key={i}>
                              <div className="fram-box">
                                <img className="img-responsive" src={sessionConnection.URL}/>
                              </div>
                              <div className="carousel-caption slider-bottom-box">
                                <p>{sessionConnection.SessionDescription}</p>
                              </div> 
                            </div>
                          )
                        } else {
                          return(
                            <div className={i === 0 ? "item active" : "item"} key={i}>
                              <div className="fram-box">
                                <video className="img-responsive" width="400" controls autoPlay>
                                  <source src={sessionConnection.URL} type="video/mp4"/>
                                </video>
                              </div>
                              {/*<div className="carousel-caption slider-bottom-box">
                                <p>{sessionConnection.SessionDescription}</p>
                              </div>*/} 
                            </div>
                          )
                        }
                      })}
                    </div>
                    <ol className="carousel-indicators">
                      {sessionConnections.map((sessionConnection, i) => {
                        return(
                          <li key={i} data-target="#myCarousel" data-slide-to={i} className={i === 0 ? 'active' : ''}></li>
                        )
                      })}
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
                </div>
              </div>
              <div className="col-md-6 col-sm-6 col-xs-12">
                <div className="right-side">
                  <div className="right-side-inner">
                    <div className="profile-sec">
                      <div className="comment">
                          <img alt="" src={profileImageUrl !== "" ? profileImageUrl : '/images/Fyndario_icon.png'} className="photo"/>
                          <div className="comment-text">
                            <p className="name">{firstName}</p>
                            <span className="time">{createdAt}</span>
                            <h2>{connectionTitle}</h2>
                          </div>
                        </div>
                    </div>
                    <ul className="nav nav-tabs comment-like" role="tablist">
                        <li role="presentation" className="active">
                          <a href="#home" aria-controls="home" role="tab" data-toggle="tab">
                            <p>{comments.length} {comments.length === 1 ? 'Comment': 'Comments'}</p>
                          </a>
                      </li>
                        <li role="presentation">
                          <a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">
                            <p>{likes.length} {likes.length === 1 ? 'Like': 'Likes'}</p>
                          </a>
                        </li>                  
                    </ul>
                    <div className="comment-section">               
                        <div className="tab-content">
                          <div role="tabpanel" className="tab-pane active" id="home">
                          {comments.map((comment, i) => {
                            return(
                              <div className="comment" key={i}>
                                <img alt="" src={_.get(comment, 'User.ProfileImageURL') === '' ? '/images/Fyndario_icon.png' : _.get(comment, 'User.ProfileImageURL')} className="photo img-responsive"/>
                                <div className="comment-text">
                                  <p className="name">{comment.User.FirstName}</p>
                                  <span className="time">{moment(comment.Created).from(moment())}</span>
                                  <p>{comment.Comment}</p>
                                </div>
                              </div>
                            )
                          })}
                          </div>
                          <div role="tabpanel" className="tab-pane" id="profile">
                            {likes.map((like, i) => {
                              return (
                                <div className="comment" key={i}>
                                  <img alt="" src={_.get(like, 'User.ProfileImageURL') === '' ? '/images/Fyndario_icon.png' : _.get(like, 'User.ProfileImageURL')} className="photo img-responsive"/>
                                  <div className="comment-text">
                                    <p className="name">{like.User.FirstName}</p>
                                    <span className="time">{moment(like.Created).from(moment())}</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                    </div>
                  </div>
                </div>  
                <div className="right-side-bottom">
                  <p>To Like and comment <b><a href="javascript:void(0)" data-toggle="modal" data-target="#exampleModal">get the app</a></b></p>
                </div>
              </div>
            </div>            
            </div>
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <h2><strong>Experience the best version of Fyndario by getting the app.</strong></h2>
                  </div>
                  <div className="app-store">
                    <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.googleassistant&hl=en">
                      <img src="images/google-play-badge.png" className="google-play" alt=""/>
                    </a>
                    <a href="https://itunes.apple.com/us/app/fyndario/id1216195721?mt=8">
                      <img src="images/download-on-the-app-store.png" className="ios-store" alt=""/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          <footer className="footer navbar-fixed-bottom"> 
            <div className="container" style={{maxWidth: '880px', width: '100%'}}>
              <div className="row">
                <div className="col-md-6 col-sm-6 col-xs-12 pull-left">
                  <p>Get the app to follow people who inspire you</p>
                </div>
                <div className="col-md-3 col-sm-6 col-xs-12 pull-right btn-align-right">
                  <button className="btn btn-default get-the-app" type="button" data-toggle="modal" data-target="#exampleModal">Get the app</button>
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
