var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: false
  },
  img: {
    type: String,
    required: false
  },
  info: {
    type: String,
    required: false
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: false
  }
});

// This creates our model from the above schema, using mongoose's model method
var Saved = mongoose.model("Saved", ArticleSchema);


// Export the Article model
module.exports = Saved;