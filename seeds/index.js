const mongoose = require('mongoose');

const cities = require('./cities');

const { places, descriptors } = require('./seedHelpers')

const campground = require('../models/campground');
const user = require('../models/user');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true

})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("database connected");
})

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            author: "607313d1d0cf0d5c78f3061c",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dchy0pwme/image/upload/v1617832395/YelpCamp/hc8eodpozwnlx8axtist.jpg',
                    filename: 'YelpCamp/hc8eodpozwnlx8axtist'
                }
            ],
            description: "lorem lorem lorem lorem lorem lorem lorem",
            price: price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }
        })
        await camp.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
});