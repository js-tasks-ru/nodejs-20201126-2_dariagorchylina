const mongoose = require('mongoose');
const connection = require('../libs/connection');
const {Schema} = mongoose;

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    index: true,
    required: true,
  },
});

const categorySchema = new Schema({
  subcategories: [subCategorySchema],
  title: {
    type: String,
    index: true,
    required: true,
  },

});

module.exports = connection.model('Category', categorySchema);
