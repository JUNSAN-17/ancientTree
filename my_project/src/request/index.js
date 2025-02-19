const express = require('express')
const app = express()
const port = 4000

// 解析前端formdata的中间件
const multer = require('multer')
//引入path模块
const path = require("path")
//multer的相关配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
// 写图片保存在哪
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage })

// 引入解析请求体的中间件
app.use(express.json())
// 访问静态资源的中间件
app.use(express.static(path.resolve(__dirname, "./uploads")))
// 引入数据库的js
const Service = require("./pgService")
// 创建数据库的一个实例
const s = new Service()

// 解决跨域问题
app.all("*", function (req, res, next) {
  // 设置允许跨域的域名,*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  // 允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  // 跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options")
    res.send(200); // 让options 尝试请求快速结束
  else next();
});

// 处理登录请求
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // 使用 pgService 中的 select 方法来查询用户名和密码
  const sql = "SELECT * FROM public.users WHERE username = $1 AND password = $2";
  const values = [username, password];
  // 使用 pgService 类的 select 方法查询数据库
  s.select(sql, values, (err, result) => {
    if (err) {
      return res.status(500).send('数据库查询失败');
    }
    if (result.rows.length > 0) {
      res.send({ message: '登录成功', username: username });
    } else {
      res.send('无效的用户名或密码');
    }
  });
});

// 处理注册请求
app.post("/register", (req, res) => {
  const { username, password, telephone, email, address } = req.body;

  const checkSql = "SELECT * FROM public.users WHERE username = $1";
  
  s.select(checkSql, [username], (err, result) => {
    if (err) {
      console.error("数据库查询错误:", err); // 打印错误
      return res.status(500).send("数据库查询失败");
    }

    if (result.rows.length > 0) {
      return res.send("用户名已存在");
    }

    // 获取当前时间的SQL表达式
    const currentTime = 'NOW()';  // 使用 PostgreSQL 内置的 NOW() 函数

    // 设置默认的用户角色和状态
    const defaultRole = 'guest';
    const defaultStatus = 'active';

    // 修改 SQL，插入手机号、邮箱、地址、创建时间、角色和状态
    const insertSql = `
      INSERT INTO public.users (username, password, user_telephone, user_email, user_address, user_created, user_updated, user_role, user_status)
      VALUES ($1, $2, $3, $4, $5, ${currentTime}, ${currentTime}, $6, $7)
    `;

    s.insert(insertSql, [username, password, telephone, email, address, defaultRole, defaultStatus], (err, result) => {
      if (err) {
        console.error("数据库插入错误:", err); // 打印错误
        return res.status(500).send("注册失败，请重试");
      }
      res.send("注册成功");
    });
  });
});


// 页面加载时为每一个index1，index2 赋值
app.post('/updtable', (req, res) => {
  const idarr = req.body;
  for (const item of idarr) {
    const judge = item.includes('-');
    const num = item.indexOf('-');
    const index = +item;
    const index1 = +item.slice(0, num);
    const index2 = +item.substr(num + 1);
    let sql, values;

    if (judge) {
      sql = "UPDATE public.tree1 SET index1 = $1, index2 = $2 WHERE id = $3";
      values = [index1, index2, item];
    } else {
      sql = "UPDATE public.tree1 SET index1 = $1, index2 = $2 WHERE id = $3";
      values = [index, 0, item];
    }

    s.update(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('更新失败');
        return;
      }
      // 完成一个循环后响应成功
      if (idarr.indexOf(item) === idarr.length - 1) {
        res.send('更新成功');
      }
    });
  }
});


// 获取每一个数据的接口
app.get('/user', (req, res) => {
  const sql = "SELECT * FROM public.tree1 ORDER BY index1, index2 ASC";
  s.select(sql, [], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('查询失败');
    }
    res.send(result.rows);
  });
});


// 右侧搜索框的数据接口
app.post('/search', (req, res) => {
  const rightSearchId = req.body.rightSearchId;
  const sql = "SELECT * FROM public.tree1 WHERE id = $1";
  s.select(sql, [rightSearchId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('查询失败');
    }
    res.send(result.rows);
  });
});


// add增加数据的接口
app.post('/add', upload.single('file'), (req, res) => {
  const body = JSON.parse(req.body.id);
  const data = body.properties;
  const item = data.id;
  const num = item.indexOf('-');
  const index = +item;
  const index1 = +item.slice(0, num);
  const index2 = +item.substr(num + 1);
  const judge = item.includes('-');
  let src = req.file ? req.file.originalname : "tree3.png";

  let sql, values;

  if (judge) {
    sql = "INSERT INTO public.tree1(index1, index2, id, name, families, area, location, age, bustline, crown, height, rank, src) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
    values = [index1, index2, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src];
  } else {
    sql = "INSERT INTO public.tree1(index1, index2, id, name, families, area, location, age, bustline, crown, height, rank, src) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
    values = [index, 0, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src];
  }

  s.insert(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('添加失败');
    }
    s.select("SELECT * FROM public.tree1 ORDER BY index1, index2 ASC", [], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('查询失败');
      }
      res.send(result.rows);
    });
  });
});


// delete删除数据的接口
app.post('/del', (req, res) => {
  const id = req.body.id;
  const sql = "DELETE FROM public.tree1 WHERE id = $1";
  s.delete(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('删除失败');
    }
    s.select("SELECT * FROM public.tree1 ORDER BY index1 ASC", [], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('查询失败');
      }
      res.send(result.rows);
    });
  });
});


// edit更新数据的接口
app.post('/upd', (req, res) => {
  const properties = req.body.properties;
  const oldid = req.body.oldid;
  const item = req.body.properties.id;
  const num = item.indexOf('-');
  const index = +item;
  const index1 = +item.slice(0, num);
  const index2 = +item.substr(num + 1);
  const judge = item.includes('-');
  let sql, values;

  if (judge) {
    sql = "UPDATE public.tree SET index1 = $1, index2 = $2, id = $3, name = $4, families = $5, area = $6, location = $7, age = $8, bustline = $9, crown = $10, height = $11, rank = $12 WHERE id = $13";
    values = [index1, index2, properties.id, properties.name, properties.families, properties.area, properties.location, properties.age, properties.bustline, properties.crown, properties.height, properties.rank, oldid];
  } else {
    sql = "UPDATE public.tree SET index1 = $1, index2 = $2, id = $3, name = $4, families = $5, area = $6, location = $7, age = $8, bustline = $9, crown = $10, height = $11, rank = $12 WHERE id = $13";
    values = [index, 0, properties.id, properties.name, properties.families, properties.area, properties.location, properties.age, properties.bustline, properties.crown, properties.height, properties.rank, oldid];
  }

  s.update(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('更新失败');
    }
    s.select("SELECT * FROM public.tree1 ORDER BY index1, index2 ASC", [], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('查询失败');
      }
      res.send(result.rows);
    });
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})