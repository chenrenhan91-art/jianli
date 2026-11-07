/**
 * 唯一数据源。卡片、命令面板和页脚都从这里读取。
 * Codex 数字来自 2026-11-07 已登录的资料页，不是实时接口。
 */
export type Product = {
  id: string;
  name: string;
  tagline: string;
  domain: string;
  url: string;
  year: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  logo: string;
  /** 迷你趋势图的随机种子，只做装饰 */
  seed: number;
};

export type Job = { when: string; role: string; where: string; result: string };
export type Store = { id: string; name: string; domain: string; url: string; metricLabel: string };
export type Stat = { value: string; label: string };

export const profile = {
  site: 'chenrenhan.top',
  name: '陈壬翰',
  nameEn: 'Chen Renhan',
  initial: '壬',
  role: 'AI全栈开发者 · 产品变现商业逻辑专家 · AI艺术创作家 · 专业命理师',
  portrait: 'portrait.jpg',
  pitch: {
    zh: ['0代码基础但有顶级逻辑思维表达能力。', '混沌秩序中找效率的理想主义实干家。'],
    en: ['No coding background, but exceptional logical thinking and expression.', 'A practical idealist who finds efficiency in chaos.'],
  },
  stack: ['跨境电商', 'AI 应用', '金融数据', '命理'],
  availability: { open: true, text: '求职方向：产品经理 / 全栈开发 / 独立站设计开发等', textEn: 'Seeking roles in product management, full-stack development, and independent storefront design and development' },
  phone: '18922840928',
  wechat: 'crh-000430',
  resumeUrl: './legacy/resume.html',
  projectsUrl: './#work',
  updatedAt: '2026-11-07',
  location: {
    city: '杭州',
    timeZone: 'Asia/Shanghai',
  },
  identity: [
    { label: '城市', value: '杭州' },
    { label: '生日', value: '2000.04.30' },
    { label: '类型', value: 'INTP' },
  ],
  education: {
    school: '浙江工业大学',
    major: '金融工程 · 本科',
    years: '2020 – 2024',
    college: '商学院',
    awards: ['之江杯学科创新竞赛二等奖', '商业计划书设计大赛一等奖', '谷歌官方 AI 课程认证'],
  },
  jobs: [
    {
      when: '2025.09 – 至今',
      role: '内容运营 · 前端',
      where: '杭州金羽创为',
      result: '跨境支付内容、客群对接、品牌站与物料',
    },
    {
      when: '2025.02 – 2025.09',
      role: '独立创业',
      where: '跨境独立站与社媒',
      result: '做成 5 个独立站。TikTok 与 Instagram 涨粉 1,000+',
    },
    {
      when: '2024.06 – 2024.12',
      role: '保险代理人',
      where: '安联人寿保险浙江分公司',
      result: '触达高意向客户 300+，成交 7 单',
    },
    {
      when: '2024.04 – 2024.06',
      role: '投研实习',
      where: '杭州银行投资部 · 庆春总行',
      result: '独立完成 5 份行业研究简报',
    },
    {
      when: '2023.06 – 2023.09',
      role: '展位销售实习',
      where: '英富曼企业管理有限公司',
      result: '名单转化 1,000+，促成 5 单参展',
    },
  ] satisfies Job[],
  products: [
    {
      id: 'wxhc',
      name: '万象合参',
      tagline: '四术合参',
      domain: 'wxhc.me',
      url: 'https://wxhc.me/',
      year: '在线',
      metric: '命理',
      metricLabel: '八字、紫微、西占、吠陀',
      tags: ['八字', '紫微', '西占'],
      logo: 'logos/wxhc.jpg',
      seed: 7,
    },
    {
      id: 'ora78',
      name: 'ora78',
      tagline: '塔罗沙龙',
      domain: 'ora78.cc',
      url: 'https://ora78.cc/',
      year: '在线',
      metric: '塔罗',
      metricLabel: '塔罗沙龙',
      tags: ['塔罗', '沙龙'],
      logo: 'logos/ora78.png',
      seed: 21,
    },
    {
      id: 'lingtai',
      name: '灵台明镜',
      tagline: '读经记诵',
      domain: 'emituofo.fun',
      url: 'https://emituofo.fun/',
      year: '在线',
      metric: '读经',
      metricLabel: '佛经记诵工具（已上架appstore）',
      tags: ['读经', '木鱼'],
      logo: 'logos/lingtai.jpg',
      seed: 13,
    },
    {
      id: 'luckyquant',
      name: 'LuckyQuant',
      tagline: 'AI 量化',
      domain: 'luckyquant.top',
      url: 'https://luckyquant.top/',
      year: '在线',
      metric: '量化',
      metricLabel: '策略、信号、回测',
      tags: ['策略', '回测'],
      logo: 'logos/luckyquant.svg',
      seed: 42,
    },
    {
      id: 'catcher',
      name: 'Comment Catcher',
      tagline: '社交线索',
      domain: 'comment-catcher.pages.dev',
      url: 'https://comment-catcher.pages.dev/',
      year: '在线',
      metric: '线索',
      metricLabel: '从评论里捞高意向',
      tags: ['TikTok', 'Instagram'],
      logo: 'logos/comment-catcher.jpg',
      seed: 28,
    },
  ] satisfies Product[],
  stores: [
    { id: 'minshow', name: 'MINSHOW', domain: 'minshowonline.com', url: 'https://minshowonline.com', metricLabel: '胡桃木工艺' },
    { id: 'kaiju', name: 'KAIJU', domain: 'kaijuonline.com', url: 'https://kaijuonline.com', metricLabel: '木质首饰与收纳' },
    { id: 'mana', name: 'MANA TRADE', domain: 'manatradeonline.com', url: 'https://manatradeonline.com/', metricLabel: '贸易独立站' },
    { id: 'furr', name: 'Furr', domain: 'furr', url: 'https://chenrenhan91-art.github.io/furr/', metricLabel: '宠物家具' },
    { id: 'superq', name: 'SUPER QUANTITY', domain: 'SuperQuantity', url: 'https://chenrenhan91-art.github.io/SuperQuantity/', metricLabel: '独立站' },
  ] satisfies Store[],
  music: {
    credit: '独立AI音乐创作',
    tracks: [
      { title: 'Graceful Chords', file: 'Graceful Chords.mp3' },
      { title: 'La Vie Va Comme Elle Va', file: 'Untitled.mp3' },
      { title: '晚安', file: '晚安.mp3' },
      { title: 'Come Undone With You', file: 'Come Undone With You.mp3' },
      { title: 'Cassette Fusion', file: 'Cassette Fusion.mp3' },
    ],
  },
  github: {
    username: 'chenrenhan91-art',
    url: 'https://github.com/chenrenhan91-art',
    /** true：从公开 API 拉取真实贡献；失败时回退并标明演示数据 */
    live: true,
    seed: 20261107,
  },
  codex: {
    name: 'yuzai',
    handle: 'chenrenhan91',
    url: 'https://chatgpt.com/u/chenrenhan91',
    capturedOn: '2026-11-07',
    stats: [
      { value: '93亿', label: '累计 Token' },
      { value: '2.2亿', label: '使用峰值' },
      { value: '5小时9分', label: '最长任务' },
      { value: '31天', label: '最长连续' },
      { value: '31天', label: '当前连续' },
    ] satisfies Stat[],
    insights: [
      { value: '1%', label: '快速模式占比' },
      { value: '极高 · 35%', label: '最常用推理强度' },
      { value: '107', label: '已探索技能' },
      { value: '1,486', label: '使用的技能' },
      { value: '7 个', label: '热门插件' },
    ] satisfies Stat[],
  },
  wechatQr: 'contact/wechat-qr.png',
  tools: [
    { name: 'Cursor', logo: 'brands/cursor.svg' },
    { name: 'Grok Bot', note: '社媒自动化运营', logo: 'brands/grok.svg' },
    { name: 'Notion', logo: 'brands/notion.svg' },
    { name: 'Gemini', logo: 'brands/googlegemini.svg' },
    { name: 'DeepSeek Harness', logo: 'brands/deepseek.svg' },
  ],
  events: [
    { src: 'events/guancha.jpg', alt: '2026观猹大会 OPC 板块展位', caption: '2026 观猹大会 · OPC 板块展商记录' },
    { src: 'events/shuqiwan.jpg', alt: '数栖湾活动上主持分享', caption: '数栖湾 · OPC 跨境变现活动，组织 + 主持' },
    { src: 'events/ai-community.jpg', alt: 'AI 社群线下实操合影', caption: 'AI 社群线下实操活动' },
    { src: 'events/duoduoland.jpg', alt: '多多岛杭州路演', caption: '多多岛 DuoDuoland · 线下活动路演' },
    { src: 'events/adventurex.jpg', alt: 'AdventureX 展会记录', caption: 'AdventureX 大会展商记录' },
  ],
};

export const musicSrc = (file: string) => `${import.meta.env.BASE_URL}music/${encodeURIComponent(file)}`;

export const asset = (file: string) =>
  `${import.meta.env.BASE_URL}${file.split('/').map((part) => encodeURIComponent(part)).join('/')}`;
