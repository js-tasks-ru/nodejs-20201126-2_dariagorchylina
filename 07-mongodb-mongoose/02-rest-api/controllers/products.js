const Product = require('../models/Product');
const mongoose = require('mongoose');

const transformProduct = (productBySubcategory) => ({
  id: productBySubcategory._id,
  title: productBySubcategory.title,
  images: productBySubcategory.images,
  category: productBySubcategory.category,
  subcategory: productBySubcategory.subcategory,
  price: productBySubcategory.price,
  description: productBySubcategory.description,
});

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (!ctx.request.query.subcategory) {
    return next();
  }
  const productsBySubcategory = await Product.find({subcategory: ctx.request.query.subcategory});
  ctx.body = {products: productsBySubcategory.map(transformProduct)};
};

module.exports.productList = async function productList(ctx, next) {
  const productList = await Product.find();
  ctx.body = {products: productList.map(transformProduct)};
};

module.exports.productById = async function productById(ctx, next) {
  try {
    const productByID = await Product.findById(ctx.params.id);
    if (!productByID) {
      ctx.response.status = 404;
      return;
    }
    ctx.body = {product: transformProduct(productByID)};
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      ctx.throw(400);
      return;
    }
    ctx.throw(500);
  }
};

