# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



1. 在腾讯云 CDB 上准备好信息

假设你已经在腾讯云创建好了一个 MySQL 实例，并拿到了：

实例内网/公网地址：cdb-xxxxx.tencentcdb.com

端口：3306

管理员账号：root（建议另建业务账号）

你要用的数据库名：oa_system

业务账号：oa_user

业务密码：StrongPassword123!

如果还没建库和账号，在腾讯云控制台（“数据库管理”里的 phpMyAdmin 或自带控制台）执行：

-- 1) 创建业务数据库
CREATE DATABASE oa_system
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2) 创建业务账号（% 表示允许所有 IP，开发测试可以；生产建议限制 IP）
CREATE USER 'oa_user'@'%' IDENTIFIED BY 'StrongPassword123!';

GRANT ALL PRIVILEGES ON oa_system.* TO 'oa_user'@'%';
FLUSH PRIVILEGES;


English
Create DB oa_system and user oa_user with a strong password, then grant permissions.

2. 安全组 / 访问白名单设置（腾讯云侧）

在 “云数据库 MySQL 控制台” → 选择实例 → 安全组：

给实例绑定一个安全组，规则里允许：

协议：TCP

端口：3306

源：你的本地公网 IP（例如 1.2.3.4/32）

如果你使用的是公网地址连接：

确认“数据库连接”里勾选了**“开启公网访问”**，并记住公网地址，例如：cdb-xxxxx.tencentcdb.com

本地测试一次：

mysql -h cdb-xxxxx.tencentcdb.com -P 3306 -u oa_user -p
# 输入 StrongPassword123!
# 如果能进到 mysql> 就说明网络没问题

3. 把本地 MySQL 数据导入腾讯云 CDB

假设你本地已经有 oa_system 这套库，想整体搬过去：

3.1 本地导出
mysqldump -u root -p oa_system > oa_system_dump.sql

3.2 导入到腾讯云 CDB
mysql -h cdb-xxxxx.tencentcdb.com -P 3306 -u oa_user -p oa_system < oa_system_dump.sql


English
Use mysqldump to export local DB and import into the Tencent Cloud CDB.

4. Spring Boot 配置示例（application.yml）

你用 application.yml 比较清晰，直接参考：

spring:
  datasource:
    url: jdbc:mysql://cdb-xxxxx.tencentcdb.com:3306/oa_system?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
    username: oa_user
    password: StrongPassword123!
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: none   # 你现在已经手工建好表，就用 none / validate
    show-sql: true
    properties:
      hibernate:
        format_sql: true


把 cdb-xxxxx.tencentcdb.com、oa_user、StrongPassword123! 换成你自己的实际值即可。

如果你用的是 application.properties
spring.datasource.url=jdbc:mysql://cdb-xxxxx.tencentcdb.com:3306/oa_system?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8
spring.datasource.username=oa_user
spring.datasource.password=StrongPassword123!
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

5. 本地启动 + 验证

启动你的 Spring Boot 项目（IDE 或 mvn spring-boot:run）。

控制台会打印类似：

HikariPool-1 - Starting...
HikariPool-1 - Start completed.


没有报 “Communications link failure” / “Access denied”，说明已经连上腾讯云 CDB。

打你现有的接口，例如：

POST http://localhost:8080/api/employee/leave

GET http://localhost:8080/api/employee/leave/my

然后去腾讯云控制台里看 oa_system.leave_request 表，确认数据在云上变动。

English
If Hikari pool starts without error and your APIs are working, you’re now running local code against Tencent Cloud MySQL.

6. 简短总结（给你一个Checklist）

中文 Checklist：

腾讯云 CDB 创建实例，记住 host + port。

在 CDB 里建库 oa_system。

建账号 oa_user + 授权 oa_system.*。

安全组开放 3306 给你本地公网 IP。

本地 mysqldump 导出 → 云端 mysql 导入。

修改 application.yml 或 application.properties 指向云端。

启动 Spring Boot，确认能正常连接和读写。