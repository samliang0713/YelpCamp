const campground = require("../models/campground");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await campground.find();

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const results = {};

  if (endIndex < campgrounds.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }

  results.results = campgrounds.slice(startIndex, endIndex);
  res.render("campgrounds/index", { results, campgrounds, page });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const cg = new campground(req.body.campground);
  cg.geometry = geoData.body.features[0].geometry;
  cg.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  cg.author = req.user._id;
  await cg.save();
  console.log(cg);
  req.flash("success", "Sucessfully made a new campground");
  res.redirect(`/campgrounds/${cg._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  const cg = await campground
    .findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!cg) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  await res.render("campgrounds/show", { cg });
};

module.exports.renderEditForm = async (req, res, next) => {
  const { id } = req.params;
  const cg = await campground.findById(id);
  if (!cg) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { cg });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const cg = await campground.findByIdAndUpdate(id, { ...req.body.campground });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  cg.images.push(...imgs);
  await cg.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await cg.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  res.redirect(`/campgrounds/${cg._id}`);
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  req.flash("success", "successfully deleted");
  res.redirect("/campgrounds");
};
