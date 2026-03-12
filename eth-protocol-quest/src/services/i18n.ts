export type Lang = 'zh' | 'en';
const KEY = 'epq_lang_v1';

const dict = {
  zh: {
    homeMainGoal: '今天只做一件事',
    nextAction: '下一步学习动作',
    etaMins: '预计耗时',
    startLearning: '开始学习',
    continueLearning: '继续学习',
    expandSecondary: '展开次屏信息',
    collapseSecondary: '收起次屏信息',
    secondaryTitle: '次屏：统计 / 图谱 / 推荐解释',
    progressTitle: '学习进度总览',
    progressDesc: '你的学习状态、错题分布与知识图谱都在这里统一查看。',
    growthCard: '分享增长卡（周报）',
    oneClickShare: '一键分享',
    mapSkeleton: '地图加载中…',
    graphSkeleton: '图谱加载中…'
  },
  en: {
    homeMainGoal: 'Do one thing today',
    nextAction: 'Next best action',
    etaMins: 'ETA',
    startLearning: 'Start learning',
    continueLearning: 'Continue learning',
    expandSecondary: 'Expand secondary panel',
    collapseSecondary: 'Collapse secondary panel',
    secondaryTitle: 'Secondary: stats / map / recommendation reason',
    progressTitle: 'Learning Progress',
    progressDesc: 'Track status, wrong answers, and full-stack map in one place.',
    growthCard: 'Growth Share Card (Weekly)',
    oneClickShare: 'One-click share',
    mapSkeleton: 'Loading map…',
    graphSkeleton: 'Loading graph…'
  }
} as const;

export function getLang(): Lang {
  const v = localStorage.getItem(KEY);
  return v === 'en' ? 'en' : 'zh';
}

export function setLang(v: Lang) {
  localStorage.setItem(KEY, v);
}

export function t(key: keyof typeof dict['zh'], lang = getLang()) {
  return dict[lang][key] || dict.zh[key];
}
