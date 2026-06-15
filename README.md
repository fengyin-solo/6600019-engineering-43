# solo-6600019: 地震波形 P/S 波自动拾取分析

## 技术栈
- Frontend: Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS + ECharts
- Backend: Python FastAPI + NumPy/SciPy + ObsPy (production)

## 核心特性
1. **三轴波形实时绘制**：BHZ/BHN/BHE 三通道地震波形 ECharts 渲染
2. **STA/LTA 自动拾取**：Short-Term Average / Long-Term Average 算法自动识别 P 波/S 波到时
3. **参数调节**：STA 窗口、LTA 窗口、触发阈值实时调节
4. **台站管理**：台站列表查看，经纬度坐标展示
5. **事件目录**：地震事件震级/深度/位置信息管理
6. **SAC/miniSEED 上传**：支持专业地震数据格式文件上传解析

## 快速开始（推荐）

### 一键联调（Make 方式）
```bash
# 1. 安装所有依赖
make install

# 2. 一键启动前后端联调环境
make dev

# 3. 新开终端，检查服务健康状态
make check
```

### 一键联调（NPM 方式）
```bash
# 1. 安装所有依赖
npm run install:all

# 2. 一键启动前后端联调环境
npm run dev

# 3. 新开终端，检查服务健康状态
npm run health
```

---

## 传统启动方式

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8001
```

---

## 联调工具命令说明

| 命令 | 说明 |
|------|------|
| `make install` / `npm run install:all` | 安装前后端所有依赖 |
| `make dev` / `npm run dev` | 一键启动前后端，自动等待后端就绪后启动前端 |
| `make check` / `npm run health` | 检查所有服务健康状态 |
| `make stop` | 停止所有相关服务 |
| `make dev-backend` | 仅启动后端服务 |
| `make dev-frontend` | 仅启动前端服务 |

## 服务地址

- 前端: http://localhost:5179
- 后端 API: http://localhost:8001
- API 文档: http://localhost:8001/docs
- 健康检查: http://localhost:8001/api/health
