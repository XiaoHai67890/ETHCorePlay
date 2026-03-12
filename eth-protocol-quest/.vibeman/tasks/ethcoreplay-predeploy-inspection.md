---
id: ethcoreplay-predeploy-inspection
title: ethcoreplay-predeploy-inspection.md
type: feature
status: backlog
priority: medium
tags: []
created_at: '2026-03-11T22:28:05.211Z'
updated_at: '2026-03-11T22:34:20.345Z'
---

# 发布前巡检任务（ETHCorePlay）

## 目标
在 push 到远端触发部署前，做最小但关键的发布前检查，降低线上回滚风险。

## 巡检步骤
1. 代码状态
- [ ] `git status` 干净（或确认仅包含本次变更）
- [ ] 无意外临时文件进入提交

2. 构建检查
- [ ] 执行 `npm run build`
- [ ] 构建成功
- [ ] 记录构建 warning（可接受/需修复）

3. 路由可用性（本地快速验证）
- [ ] 首页
- [ ] 课程页
- [ ] 总览页
- [ ] 术语页
- [ ] 地图页

4. 风险项复核
- [ ] 白屏风险点已复测（Progress/Curriculum）
- [ ] Command-K 可正常唤起
- [ ] 地图过滤与图谱交互可用

5. 提交与说明
- [ ] commit message 清晰
- [ ] 变更摘要可读（做了什么、影响哪些页面）

## 发布建议
- 先在低流量时段推送
- push 后 5~10 分钟观察线上关键路径

## 输出
- 发布前结论：可发布 / 暂缓发布
- 备注：潜在风险和后续计划
- Commit hash：
