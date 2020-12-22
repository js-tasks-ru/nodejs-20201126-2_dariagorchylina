const Koa = require('koa');
const Router = require('koa-router');
const {productsByQuery} = require('./controllers/products');

// need to run app, or include connection.js into app.
// Not sure that I can change app.js
// const mongoose = require('mongoose');
// const dbName = 'node-mongo';
// const url = `mongodb://localhost:27017/${dbName}`;
// mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true});

const app = new Koa();

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      console.error(err);
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});

const router = new Router({prefix: '/api'});

router.get('/products', productsByQuery);

app.use(router.routes());

module.exports = app;
