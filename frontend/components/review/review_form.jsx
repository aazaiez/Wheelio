import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import ReviewsContainer from "./review_form_container";



class ReviewForm extends React.Component {

  constructor(props) {
    super(props);
   this.state = {
     bodyValue: this.props.review.body,
     ratingValue: this.props.review.user_rating,
   };
   this.handleSubmit = this.handleSubmit.bind(this);
   this.bodyChange = this.bodyChange.bind(this);
  this.updateAllState = this.updateAllState.bind(this);
     this.clearState = this.clearState.bind(this);
     this.ratingChange = this.ratingChange.bind(this);
 }

 updateAllState() {
   this.setState({
     bodyValue: this.props.review.body,
     ratingValue: this.props.review.rating,
   });
 }

  componentDidMount() {
    this.props.fetchCar(this.props.match.params.carId);
    if (this.props.formType === "edit") {
      this.props
        .fetchReview(this.props.match.params.reviewId)
        .then(this.updateAllState);
    }
  }


  clearState() {
  this.setState({
    bodyValue: "",
    ratingValue: "",
  });
}

  componentWillReceiveProps(nextProps) {
    if (this.props.formType !== nextProps.formType) {
      this.clearState();
    }
  }



  handleSubmit(event) {
      event.preventDefault();
      if (this.props.formType === "new") {
        this.props
          .createReview({
            body: this.state.bodyValue,
            user_rating: this.state.ratingValue,
            car_id: this.props.match.params.carId,
            user_id: this.props.currentUser.id
          })
          .then(() =>
            this.props.history.push(
              `/cars/${this.props.match.params.carId}`
            )
          );
      } else {
        this.props
          .updateReview({
            body: this.state.bodyValue,
            user_rating: this.state.ratingValue,
            car_id: this.props.match.params.carId,
            user_id: this.props.currentUser.id,
          })
          .then(() =>
            this.props.history.push(
              `/cars/${this.props.match.params.carId}`
            )
          );
      }
    }


    bodyChange(event) {
    this.setState({ bodyValue: event.target.value });
    }


    ratingChange(event) {
      console.log("CHANGING RA");
    this.setState({ ratingValue: event.target.value });
    }






  update(type){
    console.log(this.state);
    return (e) =>(
      this.setState({[type]: e.target.value})
    );
  }



  render() {
    if (this.props.car === undefined) {
     return null;
   } else if (!this.props.review) {
     return null;
   }




        return (
          <div className="post-review-page">
            <div className="post-review-wrapper-padding">

                  <form onSubmit={this.handleSubmit} className="review-form">
                    <div className="review-form-center">
                       <div className="review-form-title">
                            <span>{this.props.car.year} {this.props.car.make} {this.props.car.model} Review</span>
                       </div>

                       <div className="review-form-rating">
                            <label>Overall Rating:
                                <input type="text" value={this.state.ratingValue} onChange={this.ratingChange}/>
                            </label>
                       </div>

                      <div className="review-submit-content">
                           <label>
                             <textarea onChange={this.bodyChange} value={this.state.bodyValue} placeholder="Your review helps other drivers learn about your car."/>
                          </label>
                      </div>


                      <div className="review-submit-button">
                        <input type="submit" value="Submit" />
                      </div>

                </div>
                  </form>

            </div>

          </div>
        );


  }




}


export default withRouter(ReviewForm);
