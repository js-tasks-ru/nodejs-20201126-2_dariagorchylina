const Product = require('../models/Product');

const transformProduct = (productBySubcategory) => ({
  id: productBySubcategory._id,
  title: productBySubcategory.title,
  images: productBySubcategory.images,
  category: productBySubcategory.category,
  subcategory: productBySubcategory.subcategory,
  price: productBySubcategory.price,
  description: productBySubcategory.description,
});

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const productList = await Product.find(
      {$text: {$search: ctx.request.query.query}},
      {score: {$meta: 'textScore'}},
  )
      .sort({score: {$meta: 'textScore'}});
  ctx.body = {products: productList.map(transformProduct)};
};
