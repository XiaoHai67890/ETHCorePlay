---
id: feature-you-hua-ui-6266
title: 优化 UI
type: feature
status: in-progress
priority: medium
tags: [ui, frontend]
created_at: '2026-03-11T22:27:59.515Z'
updated_at: '2026-03-11T22:28:14.062Z'
---

1. 首页气质从“课程目录”改成“花园入口”
Infinite Garden 的核心不是强推、不是交易感，而是“进入、漫游、持续参与”。EF 对这个比喻的描述就是：生态不是被单一主体设计出来的，而是被很多人共同培育出来的。 ￼
所以首页 Hero 不要只是标题 + 按钮，建议改成：
	•	一句更有画面感的主文案，例如：
Enter the Infinite Garden of Ethereum Protocol
或
Grow from first principles to client internals
	•	副文案强调“学习路径是生长式的，不是刷课式的”
	•	背景用柔和渐变、薄雾、节点、枝叶式连线，而不是硬核 grid / neon hacker 风

2. 视觉配色别做成“深黑 + 荧光蓝”，改成“柔和紫系 + 雾感中性色”
ethereum.org 公开提供的品牌资产里，ETH 的官方主视觉就有 gray、purple、white、多彩 diamond 等版本；社区讨论里也明确提到 Ethereum 站点常见的是一组偏 pastel 的紫、蓝绿、粉、浅青 配色。 ￼
你可以用这套思路：
	•	背景：雾白 / very light lavender / soft gray
	•	主色：Ethereum purple
	•	辅色：teal、mist blue、soft pink
	•	强调色：只在 CTA 或状态点缀上用亮一点的紫
	•	避免大面积纯黑，因为它更像交易终端，不像 Infinite Garden

3. 版式从“信息堆叠”改成“生态分层”
ethereum.org 首页不是一股脑塞知识点，而是把内容拆成清晰板块：what is Ethereum、use cases、activity、builders、resources。这样既有教育性，也有呼吸感。 ￼
你的网站可以按下面重构：
	•	Hero：世界观 + 入口
	•	Learning Paths：Execution / Consensus / Networking / Cryptography / Clients
	•	Garden Map：把知识结构画成“花园地图”
	•	Activity / Progress：展示课程进度、贡献者、更新频率
	•	Community / Contribution：把“学习者也能参与修剪花园”表达出来

4. 把课程导航做成“Garden Map”，这是最能拉开差异的地方
Infinite Garden 最适合的不是传统 sidebar，而是“地图式学习导航”。
比如：
	•	Roots：基础密码学、P2P、状态机、区块结构
	•	Trunk：Execution Layer / Consensus Layer
	•	Branches：EVM、Gas、State、Mempool、Fork Choice、PBS、DA
	•	Flowers：案例、客户端源码、EIP、研究议题
	•	Seeds：初学者任务、练习、quiz、reading list

这样用户不是“在看文档树”，而是在“探索一个会生长的系统”。这也更符合 EF 对生态“living, evolving space”的描述。 ￼

5. 强化“可信感”，别只有美术，要有 protocol credibility
ethereum.org 的设计原则里，Credible 很重要：内容要新、要一致、要通过生态规模和活跃度建立信任。 ￼
所以 UI 上建议增加：
	•	每个模块显示更新时间
	•	每篇内容标注难度级别：Beginner / Intermediate / Core Research
	•	每条路径标注推荐前置知识
	•	显示“最后同步到哪个网络升级 / 哪批资料”
	•	加一个“Sources / References”区域，链接到官方 blog、docs、EIPs、epf.wiki

这样你的站会从“个人学习站”升级成“可信的协议学习入口”。

6. 字体和排版要更“学术 + 温和”，别太赛博朋克
Infinite Garden 不是 aggressive 的视觉语言，它更像“安静但有深度的研究花园”。
建议：
	•	标题字体偏现代、几何、留白充足
	•	正文字体以高可读性 sans-serif 为主
	•	行宽收窄一点，段落间距拉开
	•	少用全大写、少用高频描边和发光
	•	卡片边框尽量轻，改用淡阴影和半透明层

7. 插画和图形语言尽量采用“ETH diamond + organic forms”
ethereum.org 官方有灰、紫、白、多彩版 ETH diamond 资产，也有插画资源。 ￼
你可以把 ETH diamond 当成“种子 / 晶体 / 花蕊”来用，但别直接满屏贴 logo。更好的方式是：
	•	用 diamond 解构成几何花瓣
	•	把网络节点画成藤蔓状连接
	•	用轻微漂浮动画表现“生长”
	•	hover 时做“发芽 / 展开 / 分叉”而不是机械弹窗

8. CTA 文案从“学习 / 开始”升级成更有叙事感的动作
Infinite Garden 风格很吃文案。你现在如果按钮还是普通的 Start / Learn More，会有点平。
可以换成：
	•	Enter the Garden
	•	Explore the Layers
	•	Follow the Learning Path
	•	Start with the Roots
	•	Contribute a Branch

这会让品牌感更完整。

9. 首页一定要有“故事感”而不只是课程感
ethereum.org 的原则里专门强调 A Good Story。 ￼
所以建议在首页中段放一个短区块：
	•	为什么理解 protocol 很难
	•	为什么理解 Ethereum 像培育一座花园
	•	为什么你这个站希望降低进入门槛

这一段会让整个站从“资源聚合”变成“有灵魂的产品”。

10. 如果你想最快落地，我建议先做这 5 个可见改动
	1.	Hero 改成柔和渐变背景 + 更有世界观的标题
	2.	顶部导航精简成 4–5 个主入口
	3.	课程列表改成 Garden Map / Path 卡片
	4.	卡片统一圆角、浅边框、半透明层
	5.	增加更新时间、难度、参考来源三个“可信标签”  
