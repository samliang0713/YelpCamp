const mongoose = require('mongoose');
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createDate: String
});

reviewSchema.virtual('daysAgo').get(function () {
    const differenceInTime = Date.now() - this.createDate;
    return Math.floor(differenceInTime / (1000 * 3600 * 24));
})

module.exports = mongoose.model('Review', reviewSchema)