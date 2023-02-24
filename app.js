//pkg -t win package.json    -PKG打包指令
const express = require('express');
const app = express();
const router = require('./router');
const cors = require('cors');
let port = 6699;

app.listen(port, () => {
  console.log('服务器已经启动!http://127.0.0.1:' + port);
});
app.use(express.urlencoded());
app.use(express.json());
//挂载静态文件

app.use((req, res, next) => {
  //解决跨域
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  );
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use(cors({ credentials: true }));
app.set('view engine', 'ejs');
app.use('/', router);

module.exports = app;
