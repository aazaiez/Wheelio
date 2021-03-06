import React from 'react';
import { Link, withRouter } from 'react-router-dom';


class CarShow extends React.Component {

  constructor(props){
    super(props);
    this.state = {carImageIndex: 0};
    this.handleImageChangeNext = this.handleImageChangeNext.bind(this);
    this.handleImageChangePrevious = this.handleImageChangePrevious.bind(this);
    this.findAverageRating = this.findAverageRating.bind(this);
    this.handleUpvotes = this.handleUpvotes.bind(this);
    this.handleWritingReview = this.handleWritingReview.bind(this);
    this.handleNoReviews = this.handleNoReviews.bind(this);
  }

  componentDidMount() {
    this.props.fetchCar(this.props.match.params.carId);
  }

  handleNoReviews() {
    if (this.props.reviews !== undefined) {
      return "";
    } else {
      return "Write the first review";
    }
  }




  componentWillReceiveProps(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname || this.props.reviews.length !== nextProps.reviews.length) {
      this.setState({carImageIndex: 0 });
      this.props.fetchCar(nextProps.match.params.carId);
    }
    this.setState(nextProps);
  }

  handleImageChangeNext(e) {
    e.preventDefault();
    var arr = [0,1,2,3,4];
    this.setState({
      carImageIndex: arr[(this.state.carImageIndex + 1) % 5]
    });
  }

  handleImageChangePrevious(e) {
    e.preventDefault();
    this.setState({
      carImageIndex: this.state.carImageIndex > 0 ? this.state.carImageIndex - 1 : ((this.state.carImageIndex -1) % 5) + 5
    });
  }

  handleUpvotes(review) {

    let outcome = "up";
    let upvoteId = 0;
    for (var i = 0; i < review.upvotes.length; i++) {
       if (review.upvotes[i].user_id === this.props.currentUser.id && this.props.currentUser.username !== "guest" ) {
         upvoteId = review.upvotes[i].id;
         outcome = 'down';
       }
    }

    if (outcome === "up" && this.props.currentUser.username !== "guest" ) {
      this.props.createUpvote( { user_id: this.props.currentUser.id , review_id: review.id  });
    } else {
      this.props.deleteUpvote(upvoteId);
    }
  }

  handleWritingReview(e) {
    e.preventDefault();
    let writeReviewLink = "";

    // if (this.props.currentUser && this.props.currentUser.username !== "guest") {
    if (this.props.currentUser) {
      writeReviewLink = `/cars/${this.props.car.id}/reviews/new`;
    } else { writeReviewLink = `/signup`; }

    // if (this.props.currentUser && this.props.currentUser.username === "guest") {
    //   this.props.history.push(writeReviewLink);
    //   // this.props.logout();
    // }
    this.props.history.push(writeReviewLink);
  }



  findAverageRating() {
    if (this.props.car === undefined) {
      return null;
    }
    var result = 0;
    for (var i = 0; i < this.props.reviews.length; i++) {
      result += this.props.reviews[i].user_rating;
    }

    return (isNaN((result/this.props.reviews.length).toFixed(1)))? `—` :  ((result/this.props.reviews.length).toFixed(1)).concat("/10")  ;
  }

  render() {
    if (this.props.car === undefined || this.props.car.images   === undefined || this.state.carImageIndex === undefined || this.props.reviews  === undefined || this.props.currentUser  === undefined) {
      return null;
    }
    let price= "$";
    if (this.props.car.price){
      price += this.props.car.price.toLocaleString(navigator.language, { minimumFractionDigits: 0 });
    }
    // for (var i = 0; i < this.props.reviews.length; i++) {
    //   if (!(this.props.reviews[i].upvotes instanceof(Array))) {
    //     return null;
    //   }
    // }


    let iconStyle = {
      fontSize: '70px',
      margin: '10px 1px 10px 2px',
    };

    let iconStyleNext = {
      fontSize: '50px',
    };




    return(
      <div className="car-review-page">



    <div className="wrapper-padding">
      <h2 className="car-title">{this.props.car.year} {this.props.car.make} {this.props.car.model} </h2>

      <div className="car-images-and-stats-flex">



        <div id="gallerywrapper">
          <div id="gallery">
            <div id="pic1">
              <img src={this.props.car.images[this.state.carImageIndex].image_url} id="car-image" className="car-images"/>
              <a onClick={this.handleImageChangeNext}  className="next" ><i className="fas fa-chevron-right" style={iconStyleNext}></i></a>
              <a onClick={this.handleImageChangePrevious}  className="previous" ><i className="fas fa-chevron-left" style={iconStyleNext}></i></a>
            </div>
          </div>
        </div>




           <div className="score-price-mpg-0to60-flex">


             <div className="wheelio-score-component-flex">
                  <img src="http://res.cloudinary.com/aazaiez/image/upload/v1517711977/wheelio_black_logo_zwheh6.svg" className="wheelio-logo-black" style={{userSelect: 'none'}}/>

                     <div className="next-to-wheelio-logo">
                       <span className="average-car-score-string"> WHEELIO Score</span>
                       <span className="actual-car-score"> &nbsp;{this.findAverageRating()}</span>
                    </div>
            </div>

            <div className="stats-flex">

              <div>
                    <div className="price-component-flex">
                          <i className="fas fa-dollar-sign" style={{fontSize: '90px'}}></i>
                        <div className="next-to-dollar-sign">
                            <span className="price-string"> STARTING AT: </span>
                            <span className="actual-price"> {price}</span>
                        </div>
                    </div>
                    <div className="epa-component-flex">
                         <img src="http://res.cloudinary.com/aazaiez/image/upload/v1517707279/gas-station-black_isopjq.svg" className="mpg-logo" />
                         <div className="next-to-mpg">
                            <span className="mpg-string"> EPA (MPG) </span>
                            <span className="actual-mpg"> {this.props.car.mpg_city}/{this.props.car.mpg_highway}</span>
                        </div>
                    </div>

              </div>

              <div>

                <div className="zeroto60-component-flex">
                  <i className="fas fa-stopwatch" style={iconStyle}></i>
                  <div className="next-to-zeroto60">
                    <span className="zeroto60-string"> 0-60 MPH</span>
                    <span className="actual-zeroto60">{this.props.car.acceleration}s</span>
                  </div>
               </div>


               <div className="top-speed-component-flex">
                <i className="fas fa-tachometer-alt" style={{fontSize: '80px'}}></i>
                 <div className="next-to-top_speed">
                   <span className="top_speed-string"> TOP SPEED</span>
                   <span className="actual-top_speed">{this.props.car.top_speed}mph</span>
                 </div>
              </div>

              </div>

            </div>


         </div>
       </div>







        <div>
            <h2 className="description-title"> Description</h2>
            <p className="car-description">{this.props.car.description}</p>
        </div>

        <div className="review-outline">

        <div>

          <div className="write-review-flex">
            <h2 className="description-title">Reviews</h2>
            <a className="submit-review" onClick={this.handleWritingReview}>Write a Review</a>
          </div>

          <div> {this.handleNoReviews()}</div>
          {this.props.reviews.map((review, idx) =>

          <div key={idx} className="review-content-flex">

              <div className="reviewer-corner" >
                <div>
                    <p className="reviewer-name">{review.username}</p>
                </div>


                {( review !== null) && (this.props.currentUser) && (review.username === this.props.currentUser.username ) &&
                  <div className="optional-buttons-flex">
                      <Link className="edit-review" to={`/cars/${this.props.car.id}/reviews/${review.id}/edit`} >Edit Review</Link>
                      <a className="delete-review" onClick={() => this.props.deleteReview(review.id)} >Delete Review</a>
                </div>
                }

              </div>

              <div className="review-rating-flex">

                <div className="rating-wrap">
                  <div style={{ color: '#666666'  }}>Rating:</div>
                  <div className="review-rating">{review.user_rating}</div>
                </div>
                <p className="review-content">{review.body}</p>

                <div className="reaction-buttons">
                  <div>
                    <a onClick={() => {this.handleUpvotes(review);}} className="review-button" >Helpful ({review.upvotes.length})</a>
                  </div>
                </div>


              </div>
          </div>
        )}



        </div>

        </div>

        </div>


      </div>
    );
  }
}

export default CarShow;
