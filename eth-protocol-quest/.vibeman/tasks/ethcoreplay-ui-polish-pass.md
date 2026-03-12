---
id: ethcoreplay-ui-polish-pass
title: ethcoreplay-ui-polish-pass.md
type: feature
status: backlog
priority: medium
tags: []
created_at: '2026-03-11T22:28:08.876Z'
updated_at: '2026-03-11T22:34:19.362Z'
---

# UI 优化任务（ETHCorePlay）

## 目标
对 `ethcoreplay.cc.cd` 做一轮可感知 UI 提升，保持 Infinite Garden 设计语言一致性，并确保核心页面在桌面与移动端都可读、可点、可理解。

## 范围
- 首页（Hero、Topics Islands、Cross-pollination、Timeline）
- 课程页（Trail Sidebar、章节展开阅读壳）
- 术语图谱（节点、连线、右侧面板）
- 总览页（成长轨迹、可执行看板）

## 具体任务
1. 统一按钮语义（开始学习 / 继续学习 / 去复测 / 去实战）
2. 统一卡片层级与留白（标题、正文、meta 信息间距）
3. 修正移动端关键区：
   - Hero 主 CTA 可见
   - 图谱和地图不溢出
   - 侧栏降级展示合理
4. 提升可读性：
   - 文章正文行宽控制（720~820）
   - callout/代码块层级清晰

## 验收标准
- [ ] 主页、课程、总览、术语、地图 5 个路由视觉一致
- [ ] 主要按钮文案无冲突、无重复
- [ ] 手机宽度 375px 下无明显遮挡/错位
- [ ] `npm run build` 通过

## 输出
- 提交说明（改动点+截图建议）
- Commit message 建议：`style(ui): polish cross-page consistency and mobile readability`
