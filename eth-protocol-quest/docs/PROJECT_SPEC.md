# ETHCorePlay x EPF Wiki Project Spec

版本：v1.0  
文档性质：项目规范 / Phase 1 冻结范围 / 研发治理  
来源：依据当前会话中提供的《ETHCorePlay × epf.wiki 内容整合深度开发文档》整理

## 1. 项目定义

ETHCorePlay 的定位不是重建一个新的上游知识真源，而是：

- 上游权威内容的中文入口
- 多源学习资源的统一索引层
- 学习路径、任务、产出、进度的编排层
- 从“看资料”走向“做输出、做贡献”的转化层

一级权威源只承认：

- `epf.wiki`
- `study.epf.wiki`
- `eth-protocol-fellows/protocol-studies`

## 2. 当前冻结范围

当前前端实现与数据模型只允许落在以下范围：

- 首页 / Start Here
- Track 页
- Module 页
- Knowledge Node 页
- Contribution Hub 页
- 基础模块执行状态
- source refs 登记层

当前冻结的顶层 Track：

- Ethereum Protocol 101
- Cryptography of Ethereum
- Lean Ethereum/zkEVM

## 3. 内容整合规则

- 只同步结构与索引，不做全文镜像。
- 页面必须展示上游来源。
- ETHCorePlay 只补中文导学、术语、误区、依赖、任务和回流路径。
- 模块完成不等于“读过”，必须至少满足：
  - 已查看上游入口
  - 已完成 checkpoint
  - 已提交 1 个输出

## 4. Phase 1 验收目标

- 顶层三大 Track 映射完成
- 基础模块树上线
- 上游 source refs 接通
- 中文导学页模板上线
- 基础进度系统上线

## 5. 研发治理：严禁 Codex 发散思维

这一节按原文保留。

### 16.1 总原则

严禁 Codex 发散思维。

Codex 在本项目中只能作为 受约束的实现执行器，不得作为产品定义者、架构重写者、范围扩张者、内容创造真源。

### 16.2 Codex 允许做的事

按已批准 schema 生成 CRUD 代码  
按既定 API 契约补全 handler / service / tests  
按给定页面原型实现 UI  
按固定 parser 规则实现同步逻辑  
按明确字段定义生成迁移脚本  
按现有组件库拼装页面  
按既定 lint / test / CI 规则修复问题

### 16.3 Codex 严禁做的事

自主扩展需求范围  
自主新增模块、页面、流程  
自主改写信息架构  
自主更换技术栈  
自主引入新的状态管理或 ORM  
自主抽象“更优雅”的通用层  
自主发明课程结构、术语定义、内容真源  
在未获批准前重构数据库 schema  
用猜测补齐缺失业务逻辑  
因“感觉更合理”而偏离 PRD / 技术方案

### 16.4 Codex 行为约束

Codex 的所有输出必须遵守：

No scope expansion  
No speculative abstraction  
No product decision making  
No autonomous refactor  
No source-of-truth mutation  
No hidden behavior insertion

### 16.5 Codex 工作流

Codex 只能在以下输入完整时开始工作：

已冻结的需求描述  
已批准的数据模型  
已定义的 API 契约  
已给定的页面结构  
已明确的验收标准

若输入不完整，Codex 只能：

标记缺失项  
按 TODO 占位  
请求人工补充

Codex 不得自行脑补。

### 16.6 Codex 输出验收规则

所有 Codex 产出必须通过：

类型检查  
单元测试  
E2E 关键路径测试  
人工代码审阅  
与 PRD 差异比对

任何与 PRD 不一致的“聪明优化”，一律视为缺陷，不视为加分项。
