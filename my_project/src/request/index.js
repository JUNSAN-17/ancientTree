const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const multer = require('multer');
const path = require('path');
const Service = require("./pgService");  // 你的数据库服务
const app = express();
const port = 4000;

// multer 配置，处理文件上传
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 设置文件上传目录
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // 使用原文件名
  }
});
const upload = multer({ storage });



// 解决跨域问题
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "content-type");
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == "options") {
    res.send(200); // 让 options 尝试请求快速结束
  } else {
    next();
  }
});

// 设置文件上传路由
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "./uploads")));  // 访问上传的静态文件

// 设置代理
app.use('/weather-api', createProxyMiddleware({
  target: 'https://api.caiyunapp.com',  // 要代理的目标 API
  changeOrigin: true,
  pathRewrite: {
    '^/weather-api': '',  // 去掉 /weather-api 前缀
  },
  onProxyRes: function (proxyRes, req, res) {
    // 在这里可以对响应做一些额外的处理
  }
}));

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

// 数据库实例
const s = new Service();
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
      sql = "UPDATE public.tree3 SET index1 = $1, index2 = $2 WHERE id = $3";
      values = [index1, index2, item];
    } else {
      sql = "UPDATE public.tree3 SET index1 = $1, index2 = $2 WHERE id = $3";
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
app.get('/allTree', (req, res) => {
  const sql = "SELECT * FROM public.tree3 ORDER BY index1, index2 ASC";
  s.select(sql, [], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('查询失败');
    }
    res.send(result.rows);
  });
});

//获取分页的数据
app.get('/treeData', (req, res) => {
  const page = parseInt(req.query.page) || 1; // 当前页码，默认为1
  const pageSize = parseInt(req.query.pageSize) || 7; // 每页条数，默认为10
  const offset = (page - 1) * pageSize; // 计算偏移量

  // 获取总记录数的 SQL
  const sqlCount = "SELECT COUNT(*) FROM public.tree3";
  // 获取分页数据的 SQL
  const sqlData = `
    SELECT * 
    FROM public.tree3
    ORDER BY index1, index2 ASC
    LIMIT $1 OFFSET $2
  `;

  // 执行获取总记录数的查询
  s.select(sqlCount, [], (err, countResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send('查询总记录数失败');
    }

    const totalCount = parseInt(countResult.rows[0].count); // 总记录数
    const totalPages = Math.ceil(totalCount / pageSize); // 总页数

    // 执行获取分页数据的查询
    s.select(sqlData, [pageSize, offset], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('查询分页数据失败');
      }

      // 返回分页数据和总记录数
      res.send({
        data: result.rows,
        totalCount: totalCount,
        totalPages: totalPages,
        currentPage: page,
      });
    });
  });
});


// 右侧搜索框的数据接口
app.post('/search', (req, res) => {
  const rightSearchId = req.body.rightSearchId;
  const sql = "SELECT * FROM public.tree3 WHERE id = $1";
  s.select(sql, [rightSearchId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('查询失败');
    }
    res.send(result.rows);
  });
});


// // add增加数据的接口
// app.post('/add', upload.single('file'), (req, res) => {
//   const body = JSON.parse(req.body.id);
//   const data = body.properties;
//   const item = data.id;
//   const num = item.indexOf('-');
//   const index = +item;
//   const index1 = +item.slice(0, num);
//   const index2 = +item.substr(num + 1);
//   const judge = item.includes('-');
//   let src = req.file ? req.file.originalname : "tree3.png";
//   let sql, values;

//   if (judge) {
//     sql = "INSERT INTO public.tree(index1, index2, id, name, families, area, location, age, bustline, crown, height, rank, src) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
//     values = [index1, index2, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src];
//   } else {
//     sql = "INSERT INTO public.tree(index1, index2, id, name, families, area, location, age, bustline, crown, height, rank, src) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
//     values = [index, 0, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src];
//   }

//   s.insert(sql, values, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('添加失败');
//     }
//     s.select("SELECT * FROM public.tree ORDER BY index1, index2 ASC", [], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send('查询失败');
//       }
//       res.send(result.rows);
//     });
//   });
// });

// add增加数据的接口
app.post('/add', upload.single('file'), (req, res) => {
  const body = JSON.parse(req.body.id);  // 从前端获取数据
  const data = body.properties;
  const item = data.id;
  const num = item.indexOf('-');
  const index = +item;
  const index1 = +item.slice(0, num);
  const index2 = +item.substr(num + 1);
  const judge = item.includes('-');

  let src = req.file ? req.file.originalname : "tree3.png";  // 如果没有文件上传，使用默认图片

  let sql, values;

  // 判断数据id的格式，选择插入SQL语句
  if (judge) {
    sql = "INSERT INTO public.tree3(index1, index2, id, name, families, area, location, age, bustline, crown, height, rank, src) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
    values = [index1, index2, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src];
  } else {
    sql = "INSERT INTO public.tree3(index1, index2, id, name, families, area, location, age, bustline, crown, height, rank, src) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
    values = [index, 0, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src];
  }

  // 执行插入操作
  s.insert(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('添加失败');
    }

    // 插入成功后，查询总记录数和当前页的数据
    const page = req.query.page || 1;  // 当前页，默认为1
    const pageSize = req.query.pageSize || 7;  // 每页显示数量，默认为7

    // 查询数据总数
    s.select("SELECT COUNT(*) AS totalItems FROM public.tree3", [], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('查询失败');
      }

      const totalItems = result.rows[0].totalitems;

      // 查询当前页的数据
      const offset = (page - 1) * pageSize;
      s.select("SELECT * FROM public.tree3 ORDER BY index1, index2 ASC LIMIT $1 OFFSET $2", [pageSize, offset], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('查询失败');
        }
        // 返回总记录数和当前页的数据
        res.send({
          data: result.rows,  // 当前页数据
          totalItems: totalItems,  // 总记录数
          currentPage: page,  // 当前页码
        });
      });
    });
  });
});


// delete删除数据的接口
// app.post('/del', (req, res) => {
//   const id = req.body.id;
//   const sql = "DELETE FROM public.tree WHERE id = $1";
//   s.delete(sql, [id], (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('删除失败');
//     }
//     s.select("SELECT * FROM public.tree ORDER BY index1 ASC", [], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send('查询失败');
//       }
//       res.send(result.rows);
//     });
//   });
// });
app.post('/del', (req, res) => {
  const id = req.body.id;
  const page = req.body.page || 1;  // 当前页，默认为1
  const pageSize = req.body.pageSize || 7;  // 每页显示数量，默认为7

  const sql = "DELETE FROM public.tree3 WHERE id = $1";
  s.delete(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('删除失败');
    }

    // 删除成功后查询总记录数和当前页数据
    s.select("SELECT COUNT(*) AS totalItems FROM public.tree3", [], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('查询失败');
      }

      const totalItems = result.rows[0].totalitems;

      // 查询当前页的数据
      const offset = (page - 1) * pageSize;
      s.select("SELECT * FROM public.tree3 ORDER BY index1 ASC LIMIT $1 OFFSET $2", [pageSize, offset], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('查询失败');
        }

        // 返回数据和分页信息
        res.send({
          data: result.rows,  // 当前页数据
          totalItems: totalItems,  // 总记录数
          currentPage: page,  // 当前页码
        });
      });
    });
  });
});


app.post('/delPic', (req, res) => {
  const id = req.body.id;
  const sql = "UPDATE public.tree3 SET src = NULL WHERE id = $1";
  s.delete(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('删除失败');
    }
  });
});





// // edit更新数据的接口
// app.post('/upd', upload.single('file'),(req, res) => {
//   const body = JSON.parse(req.body.id);
//   const data = body.properties;
//   const item = data.id;   

//   const num = item.indexOf('-');
//   const index = +item;
//   const index1 = +item.slice(0, num);
//   const index2 = +item.substr(num + 1);
//   const judge = item.includes('-');
//   console.log(req.file);
//   let src = req.file.originalname;

//   let sql, values;

//   if (judge) {
//     sql = "UPDATE public.tree SET index1 = $1, index2 = $2, id = $3, name = $4, families = $5, area = $6, location = $7, age = $8, bustline = $9, crown = $10, height = $11, rank = $12, src = $13 WHERE id = $14";
//     values = [index1, index2, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src, data.oldid];
//   } else {
//     sql = "UPDATE public.tree SET index1 = $1, index2 = $2, id = $3, name = $4, families = $5, area = $6, location = $7, age = $8, bustline = $9, crown = $10, height = $11, rank = $12, src = $13 WHERE id = $14";
//     values = [index, 0, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src, data.oldid];
//   }

//   s.update(sql, values, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send('更新失败');
//     }
//     s.select("SELECT * FROM public.tree ORDER BY index1, index2 ASC", [], (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send('查询失败');
//       }
//       res.send(result.rows);
//     });
//   });
// });

app.post('/upd', upload.single('file'), (req, res) => {
  const body = JSON.parse(req.body.id);
  const data = body.properties;
  const item = data.id;
  const num = item.indexOf('-');
  const index = +item;
  const index1 = +item.slice(0, num);
  const index2 = +item.substr(num + 1);
  const judge = item.includes('-');
  let src = req.file ? req.file.originalname : data.src;  // 确保文件存在时取文件名
  let sql, values;

  if (judge) {
    sql = "UPDATE public.tree3 SET index1 = $1, index2 = $2, id = $3, name = $4, families = $5, area = $6, location = $7, age = $8, bustline = $9, crown = $10, height = $11, rank = $12, src = $13 WHERE id = $14";
    values = [index1, index2, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src, data.oldid];
  } else {
    sql = "UPDATE public.tree3 SET index1 = $1, index2 = $2, id = $3, name = $4, families = $5, area = $6, location = $7, age = $8, bustline = $9, crown = $10, height = $11, rank = $12, src = $13 WHERE id = $14";
    values = [index, 0, data.id, data.name, data.families, data.area, data.location, data.age, data.bustline, data.crown, data.height, data.rank, src, data.oldid];
  }

  s.update(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('更新失败');
    }

    // 获取分页数据
    const page = req.body.page || 1; // 当前页码
    const pageSize = req.body.pageSize || 7; // 每页显示数量
    const offset = (page - 1) * pageSize;
    console.log(page);


    const countSql = "SELECT COUNT(*) FROM public.tree3"; // 获取总记录数
    s.select(countSql, [], (err, countResult) => {
      if (err) {
        console.error(err);
        return res.status(500).send('查询总记录数失败');
      }

      const totalItems = countResult.rows[0].count;

      // 检查当前页是否有效
      const dataSql = `SELECT * FROM public.tree3 ORDER BY index1, index2 ASC LIMIT $1 OFFSET $2`; // 查询分页数据
      s.select(dataSql, [pageSize, offset], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('查询分页数据失败');
        }

        if (result.rows.length === 0 && page > 1) {
          // 如果当前页没有数据，尝试返回上一页的数据
          const prevPage = page - 1;
          const prevOffset = (prevPage - 1) * pageSize;

          s.select(dataSql, [pageSize, prevOffset], (err, prevResult) => {
            if (err) {
              console.error(err);
              return res.status(500).send('查询上一页数据失败');
            }
            res.send({
              data: prevResult.rows,
              totalItems,
              currentPage: prevPage,
              pageSize
            });
          });
        } else {
          res.send({
            data: result.rows, // 当前页数据
            totalItems,         // 总记录数
            currentPage: page,  // 当前页
            pageSize            // 每页条数
          });
        }
      });
    });
  });
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})