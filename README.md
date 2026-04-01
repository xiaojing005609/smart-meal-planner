# 智能膳食搭配工具

## 1. 启动后端

```bash
npm run dev --prefix backend
```

后端默认运行在 `http://localhost:3001`。

## 2. 启动前端

新开一个终端执行：

```bash
npm run dev --prefix frontend
```

前端启动后，按终端提示打开浏览器地址（通常是 `http://localhost:5173`）。

## 3. 云端部署（推荐低成本方案）

### 3.1 后端部署到 Render

1. 打开 [Render Dashboard](https://dashboard.render.com/) 并登录  
2. 点击 `New +` -> `Blueprint`，连接本项目仓库  
3. 选择仓库根目录，Render 会自动识别 `render.yaml`  
4. 等待部署完成，拿到后端地址，例如：  
   `https://smart-meal-planner-api.onrender.com`  
5. 确认健康检查：  
   `https://你的后端域名/api/health`

### 3.1.1 防休眠保活（Render Cron）

Render 免费服务在无请求时会休眠。项目已在 `render.yaml` 增加保活定时任务：

- Cron 服务名：`smart-meal-planner-keepalive`
- 执行频率：每 10 分钟一次（`*/10 * * * *`）
- 执行命令：`npm run ping:health`
- 目标地址：环境变量 `PING_URL`（默认指向 `/api/health`）

如果你的 Render 服务域名不是 `smart-meal-planner-api.onrender.com`，请在 Render 后台把 Cron 的 `PING_URL` 改成你自己的地址，例如：

`https://你的后端域名/api/health`

### 3.2 前端部署到 Vercel

1. 打开 [Vercel Dashboard](https://vercel.com/dashboard) 并登录  
2. 导入本项目仓库，Root Directory 选择 `frontend`  
3. 在环境变量中新增：  
   - `VITE_API_BASE_URL = https://你的后端域名/api`
4. 部署完成后访问前端域名

> 前端 API 地址已支持环境变量。未配置时默认指向本地 `http://localhost:3001/api`。

## 4. 已实现功能

- 每日三餐自动生成（早餐/午餐/晚餐）
- 根据身高体重年龄性别活动量计算目标营养
- 支持忌口过滤和偏好优先
- 展示当日营养汇总与达标状态
- 历史记录本地保存

## 5. 说明

- 当前为低成本可运行版本，菜品库较小（用于演示流程）
- 后续可继续扩展：多方案、手动替换、目标模式、采购清单、周报等
