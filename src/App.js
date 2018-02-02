import React, { Component } from 'react'
import $ from 'jquery'
import moment from 'moment'
import _ from 'lodash'
import './App.css'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import TransitionModal from './transition-modal'

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
      likes: [],
      isShowingModal: false,
      allConnections: []
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  componentWillMount() {
    const { id } = this.props.match.params
    const firstImages = []
    const allImages = []
    $.ajax({
      url: `${hostName}/api/v3/session/single/${id}`,
      type: "GET",
      cache: false,
      success: (data) => {
        if (data.data.length > 0) {
          data.data[0].SessionConnection.map((sessionConnection) => {
            sessionConnection.SessionParts.map((sessionPart) => {
              sessionPart.SessionDescription = sessionConnection.SessionDescription
              sessionConnection.SessionParts[0].sessionTransition = 'rotate'
              allImages.push(sessionPart)
            })
          })
          data.data[0].SessionConnection.map((sessionConnection) => {
            firstImages.push(sessionConnection.SessionParts[0])
          })
          this.setState({
            firstName: _.get(data.data[0], 'User.FirstName', 'Fyndario'),
            connectionTitle: _.get(data.data[0], 'ConnectionTitle') !== '' ? _.get(data.data[0], 'ConnectionTitle', 'Fyndario') : _.get(data.data[0], 'SessionDescription', 'Fyndario'),
            createdAt: moment(_.get(data.data[0], 'created', moment())).from(moment()),
            sessionConnections: firstImages,
            profileImageUrl: _.get(data.data[0], 'User.ProfileImageURL', '/images/Fyndario_icon.png'),
            allImages,
            allConnections: data.data[0].SessionConnection
          })
        }
      }
    })
    $.ajax({
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6MTQ2LCJpYXQiOjE1MTQ3OTk0ODIsImV4cCI6MTU0NjM1NzA4Mn0.avGl_ouS7My73mSwDMjQ_RTkQOGD2iFTtdAyL7k37pA'
      },
      url: `${hostName}/api/v3/user/comment/${id}`,
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
      url: `${hostName}/api/v3/session/user/likes/${id}`,
      type: "GET",
      cache: false,
      success: (data) => {
        this.setState({
          likes: data.data
        })
      }
    })
  }

  handleClick() {
    this.setState({ isShowingModal: true })
    setTimeout(()=>{
      $(".narcissus_17w311v").parent().css({ background: "#262626" })
    }, 100)
  }

  handleClose() {
    this.setState({ isShowingModal: false })
  }

  render() {
    const { likes, comments, firstName, profileImageUrl, sessionConnections, createdAt, connectionTitle, allImages, allConnections } = this.state
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
                  <div id="myCarousel" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner" onClick={this.handleClick}>
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
                            </div>
                          )
                        }
                      })}
                    </div>
                    <div className={sessionConnections.length > 1 ? 'dots-box' : 'display-none'}>
                      <ol className="carousel-indicators">
                        {sessionConnections.map((sessionConnection, i) => {
                          return(
                            <li key={i} data-target="#myCarousel" data-slide-to={i} className={i === 0 ? 'active' : ''}></li>
                          )
                        })}
                      </ol>
                    </div>
                    {sessionConnections.length > 1 && <div>
                      <a className="left carousel-control" href="#myCarousel" data-slide="prev">
                        <span className="glyphicon glyphicon-chevron-left"></span>
                        <span className="sr-only">Previous</span>
                      </a>
                      <a className="right carousel-control" href="#myCarousel" data-slide="next">
                        <span className="glyphicon glyphicon-chevron-right"></span>
                        <span className="sr-only">Next</span>
                      </a>
                    </div>}
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
            {
              this.state.isShowingModal &&
              <ModalContainer onClose={this.handleClose}>
                <ModalDialog onClose={this.handleClose}>
                  <TransitionModal images={allImages} connections={allConnections} closeModal={this.handleClose}/>
                </ModalDialog>
              </ModalContainer>
            }
            <div className="modal" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-body">
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
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
