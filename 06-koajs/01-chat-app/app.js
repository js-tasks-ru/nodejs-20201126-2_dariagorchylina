const path = require('path');
const Koa = require('koa');
const {EventEmitter} = require('events');

const ee = new EventEmitter();
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve, reject) => {
    ee.on('newMessage', (message) => {
      resolve(message);
      ee.removeAllListeners('newMessage');
    });
  });

  ctx.status = 200;
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const {message} = ctx.request.body;
  if (!message) {
    return;
  }
  ee.emit('newMessage', message);
  ctx.status = 201;
  ctx.body = {message};
});

app.use(router.routes());

module.exports = app;
