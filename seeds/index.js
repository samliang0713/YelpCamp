const mongoose = require("mongoose");
require("dotenv").config();

const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const campground = require("../models/campground");
const user = require("../models/user");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const db = mongoose.connection;
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const defaultImages = [
  "https://res.cloudinary.com/dchy0pwme/image/upload/v1621546686/YelpCamp/marek-piwnicki-s4G-4rxQmMY-unsplash_nycdnj.jpg",
  "https://res.cloudinary.com/dchy0pwme/image/upload/v1621546685/YelpCamp/victor-larracuente-JQfYGhUcDSg-unsplash_rrmwbg.jpg",
  "https://res.cloudinary.com/dchy0pwme/image/upload/v1621546685/YelpCamp/josh-hild-8f_VQ3EFbTg-unsplash_myqluv.jpg",
  "https://res.cloudinary.com/dchy0pwme/image/upload/v1621546684/YelpCamp/ben-duchac-3fJOXw1RbPo-unsplash_a0ieeb.jpg",
  "https://res.cloudinary.com/dchy0pwme/image/upload/v1621546683/YelpCamp/clay-banks-Ppz6b-YUDHw-unsplash_qatqda.jpg",
  "https://res.cloudinary.com/dchy0pwme/image/upload/v1621546682/YelpCamp/zach-betten-K9olx8OF36A-unsplash_wxwcyg.jpg",
  "https://res.cloudinary.com/dchy0pwme/image/upload/v1621546679/YelpCamp/andrew-gloor-I1RZSDvvStY-unsplash_sax3vs.jpg",
  "https://res.cloudinary.com/dchy0pwme/image/upload/v1621544587/YelpCamp/uwnagebnum8bwjzz2ejt.jpg",
];

const defaultDescriptions = [
  "Start your next adventure at",
  "Great way to explore",
  "Check out this nice camp at",
  "A great option for out-door adventures near",
];

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Manually set date ranges for seed
const start = new Date("2020-01-02");
const end = new Date("2020-06-02");

const seedDB = async () => {
  await campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const imageIndex = Math.floor(Math.random() * defaultImages.length);
    const descriptionIndex = Math.floor(
      Math.random() * defaultDescriptions.length
    );
    const camp = new campground({
      author: "607228d420752f6d7411e41f",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: defaultImages[imageIndex],
          filename: `Default Image # ${imageIndex}`,
        },
      ],
      description: `${defaultDescriptions[descriptionIndex]} ${cities[random1000].city}, ${cities[random1000].state}!`,
      price: price,

      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      createDate: randomDate(start, end).toISOString().slice(0, 10),
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
