const Review = require('../models/review');
const campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
    const cg = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    review.createDate = Date.now();
    cg.reviews.push(review);
    await review.save();
    await cg.save();
    req.flash('success', 'created new review!')
    res.redirect(`/campgrounds/${cg._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'succesfully delted review')
    res.redirect(`/campgrounds/${id}`);
}