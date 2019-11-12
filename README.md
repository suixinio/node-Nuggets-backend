# node-Nuggets-backend
模仿掘金论坛的内容平台


## 更新（2019/10/18） ##

## 功能 ##
- 登录 / 注册
- 发表/删除/收藏/评论文章
- 获取该用户所有收藏的文章
- 获取用户所有的发表的文章


## 技术栈 ##
- koa搭建后端服务
- Mongoose对MongoDB进行便捷操作
- 基于koa-session设置session
- 基于ccap生成登录验证码存储在session中，发送cookie验证
- 基于JWT生成token鉴权并设置过期时间
- 基于koa-bodyparser获取解析post请求数据
- 基于bcrypt md5加密解密用户密码


## 项目运行

```
项目运行之前，请确保系统已经安装以下应用
1、node
2、mongodb
```
