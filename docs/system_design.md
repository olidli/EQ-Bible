# "情绪急救箱"系统架构设计

**文档版本**: v1.0  
**设计人**: 高见远（软件架构师）  
**日期**: 2026-04-22  
**项目**: EQ情商宝典微信小程序

---

## 一、文件结构（含新建文件列表）

### 1.1 新建文件（核心功能）

```
pages/emotion-first-aid/           【新分包】情绪急救箱页面
├── emotion-first-aid.wxml        # 主页面结构
├── emotion-first-aid.wxss        # 主页面样式
├── emotion-first-aid.js          # 主页面逻辑
└── emotion-first-aid.json        # 页面配置

pages/emotion-first-aid/components/  【组件目录】
├── breathing-guide/
│   ├── breathing-guide.wxml      # 4-7-8呼吸法引导组件
│   ├── breathing-guide.wxss
│   ├── breathing-guide.js
│   └── breathing-guide.json
├── grounding-technique/
│   ├── grounding-technique.wxml  # 5-4-3-2-1接地术组件
│   ├── grounding-technique.wxss
│   ├── grounding-technique.js
│   └── grounding-technique.json
├── cognitive-reappraisal/
│   ├── cognitive-reappraisal.wxml  # 认知重评组件
│   ├── cognitive-reappraisal.wxss
│   ├── cognitive-reappraisal.js
│   └── cognitive-reappraisal.json
└── emergency-contacts/
    ├── emergency-contacts.wxml   # 应急联系人管理组件
    ├── emergency-contacts.wxss
    ├── emergency-contacts.js
    └── emergency-contacts.json
```

### 1.2 修改文件（集成到现有系统）

```
app.json                          # 添加分包配置 + 首页入口
pages/index/index.wxml            # 添加"情绪急救箱"入口卡片
pages/index/index.wxss            # 入口卡片样式
pages/index/index.js              # 添加跳转逻辑
utils/constants.js                # 添加情绪急救箱相关常量
```

---

## 二、数据结构设计

### 2.1 应急联系人数据结构

**存储键**: `emergency_contacts`  
**存储方式**: `wx.setStorageSync / wx.getStorageSync`

```javascript
// 数据结构
[
  {
    id: 'contact_1234567890',      // 唯一标识（时间戳）
    name: '妈妈',                   // 联系人名称
    phone: '13800138000',          // 电话号码
    relationship: '母亲',          // 关系（可选）
    createTime: 1234567890         // 创建时间戳
  }
]
// 限制：最多3个联系人
```

### 2.2 情绪记录数据结构（可选，用于未来扩展）

```javascript
// 可存储在 wx.setStorageSync('emotion_logs', [...]) 
{
  emotion: '焦虑',                 // 选中的情绪
  intensity: 7,                   // 强度评分 1-10
  timestamp: 1234567890,          // 记录时间
  usedTool: 'breathing',           // 使用的工具: breathing/grounding/cognitive
  helped: true                     // 是否有帮助（可选反馈）
}
```

### 2.3 核心情绪列表（constants.js）

```javascript
// 6-8个核心情绪（简化版，避免选择过载）
const FIRST_AID_EMOTIONS = [
  { label: '焦虑', emoji: '😰', value: 'anxiety' },
  { label: '愤怒', emoji: '😠', value: 'anger' },
  { label: '悲伤', emoji: '😢', value: 'sadness' },
  { label: '恐惧', emoji: '😨', value: 'fear' },
  { label: '压力', emoji: '😰', value: 'stress' },
  { label: '无助', emoji: '😔', value: 'helplessness' },
  { label: '孤独', emoji: '�孤立', value: 'loneliness' },
  { label: '其他', emoji: '😟', value: 'other' }
]
```

---

## 三、页面流程/交互逻辑

### 3.1 主流程图

```
[首页] 
  ↓ 点击"情绪急救箱"入口卡片
[情绪急救箱首页]
  ├─→ [步骤1: 情绪识别]
  │     ├─ 选择当前情绪（6-8个按钮）
  │     └─ 滑动选择强度（1-10）
  │
  ├─→ [步骤2: 选择工具] ←───┐
  │     ├─ 🫁 4-7-8呼吸法    │
  │     ├─ 🎯 5-4-3-2-1接地术 │
  │     └─ 💭 认知重评        │
  │                          │
  ├─→ [步骤3: 使用工具]       │
  │     ├─ 呼吸法：动画引导（1分钟） │
  │     ├─ 接地术：步骤引导（2分钟） │
  │     └─ 认知重评：问答引导（2分钟）│
  │                          │
  ├─→ [完成后] ───────────────┘
  │     ├─ 返回重新选择工具
  │     ├─ 查看应急联系人
  │     └─ 分享给朋友
  │
  └─→ [应急联系人管理]
        ├─ 添加联系人（最多3个）
        ├─ 编辑/删除联系人
        └─ 一键拨打
```

### 3.2 分享功能流程

```
[情绪急救箱页面]
  ↓ 点击右上角"..."或页面分享按钮
  ↓ wx.showShareMenu 启用分享
  ↓ 
[分享卡片]
  ├─ 标题: "情绪急救箱 | EQ情商宝典"
  ├─ 封面: /images/share_first_aid.png (需设计)
  ├─ 简介: "快速缓解负面情绪，4-7-8呼吸法、接地术、认知重评"
  └─ 路径: pages/emotion-first-aid/emotion-first-aid
```

---

## 四、核心文件实现要点

### 4.1 emotion-first-aid.js（主页面逻辑）

```javascript
// pages/emotion-first-aid/emotion-first-aid.js
const { FIRST_AID_EMOTIONS } = require('../../utils/constants')

Page({
  data: {
    // === 情绪识别 ===
    emotions: FIRST_AID_EMOTIONS,
    selectedEmotion: '',
    intensity: 5,
    
    // === 工具状态 ===
    activeTool: '',  // '' | 'breathing' | 'grounding' | 'cognitive'
    toolTimer: null,  // 计时器引用
    
    // === 应急联系人 ===
    emergencyContacts: []
  },

  onLoad() {
    // 1. 加载应急联系人
    this.loadContacts()
    // 2. 启用分享功能
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })
  },

  onUnload() {
    // 清理计时器
    this.clearToolTimer()
  },

  // ========== 情绪识别 ==========
  selectEmotion(e) {
    const emotion = e.currentTarget.dataset.emotion
    this.setData({ selectedEmotion: emotion })
  },

  setIntensity(e) {
    this.setData({ intensity: e.detail.value })
  },

  // ========== 工具使用 ==========
  openTool(e) {
    const tool = e.currentTarget.dataset.tool
    this.setData({ activeTool: tool })
    // 初始化对应工具的计时器（在组件内部处理）
  },

  closeTool() {
    this.setData({ activeTool: '' })
    this.clearToolTimer()
  },

  clearToolTimer() {
    if (this.data.toolTimer) {
      clearInterval(this.data.toolTimer)
      this.setData({ toolTimer: null })
    }
  },

  // ========== 应急联系人管理 ==========
  loadContacts() {
    const contacts = wx.getStorageSync('emergency_contacts') || []
    this.setData({ emergencyContacts: contacts })
  },

  addContact() {
    const contacts = this.data.emergencyContacts
    if (contacts.length >= 3) {
      wx.showToast({ title: '最多添加3个联系人', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/emotion-first-aid/add-contact/add-contact' })
  },

  editContact(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/emotion-first-aid/edit-contact/edit-contact?id=${id}` })
  },

  deleteContact(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个联系人吗？',
      success: (res) => {
        if (res.confirm) {
          let contacts = this.data.emergencyContacts.filter(c => c.id !== id)
          wx.setStorageSync('emergency_contacts', contacts)
          this.setData({ emergencyContacts: contacts })
          wx.showToast({ title: '已删除', icon: 'success' })
        }
      }
    })
  },

  callContact(e) {
    const phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {}  // 用户取消拨打
    })
  },

  // ========== 分享功能 ==========
  onShareAppMessage() {
    return {
      title: '情绪急救箱 | EQ情商宝典',
      path: '/pages/emotion-first-aid/emotion-first-aid',
      imageUrl: '/images/share_first_aid.png'  // 需设计分享封面
    }
  },

  onShareTimeline() {
    return {
      title: '快速缓解负面情绪，4-7-8呼吸法、接地术、认知重评',
      imageUrl: '/images/share_first_aid.png'
    }
  }
})
```

### 4.2 breathing-guide 组件（4-7-8呼吸法）

**核心实现要点**：
- 使用纯 CSS 动画实现圆形缩放（`.breathing-circle`）
- 4秒吸气（放大）→ 7秒屏气（保持）→ 8秒呼气（缩小）
- 使用 `setInterval` 控制阶段切换和倒计时
- 总时长：约1分钟（可自定义循环次数）

```javascript
// components/breathing-guide/breathing-guide.js
Component({
  properties: {},
  data: {
    phase: 'ready',      // 'ready' | 'inhale' | 'hold' | 'exhale' | 'finished'
    countdown: 0,        // 当前阶段剩余秒数
    totalSeconds: 0,     // 总已用时间
    isRunning: false
  },

  methods: {
    startBreathing() {
      this.setData({
        phase: 'inhale',
        countdown: 4,
        totalSeconds: 0,
        isRunning: true
      })
      this.timer = setInterval(() => this.tick(), 1000)
    },

    tick() {
      let { phase, countdown, totalSeconds } = this.data
      countdown--
      totalSeconds++

      if (countdown === 0) {
        // 切换到下一阶段
        if (phase === 'inhale') {
          phase = 'hold'
          countdown = 7
        } else if (phase === 'hold') {
          phase = 'exhale'
          countdown = 8
        } else if (phase === 'exhale') {
          // 完成一个循环，可以继续或结束
          phase = 'finished'
          this.stopBreathing()
          return
        }
      }

      this.setData({ phase, countdown, totalSeconds })
      // 触发父页面更新（如需要记录日志）
      this.triggerEvent('phaseChange', { phase, countdown })
    },

    stopBreathing() {
      clearInterval(this.timer)
      this.setData({ isRunning: false })
      this.triggerEvent('finished')
    }
  }
})
```

**CSS 动画（核心）**：
```css
/* components/breathing-guide/breathing-guide.wxss */
.breathing-circle {
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  animation: breathe 19s infinite;  /* 4+7+8=19秒一个循环 */
  animation-timing-function: ease-in-out;
}

@keyframes breathe {
  0%   { transform: scale(1); }      /* 开始 */
  21%  { transform: scale(1.5); }    /* 4秒吸气，放大到1.5倍 */
  57%  { transform: scale(1.5); }    /* 7秒屏气，保持 */
  100% { transform: scale(1); }      /* 8秒呼气，缩小回原尺寸 */
}
```

### 4.3 grounding-technique 组件（5-4-3-2-1接地术）

**核心实现要点**：
- 分步引导：5样看到 → 4样触摸 → 3样听到 → 2样闻到 → 1样尝到
- 每步显示引导语，用户输入/确认后进入下一步
- 使用 `wx.vibrateShort` 提供触觉反馈（可选）
- 总时长：约2分钟

```javascript
// components/grounding-technique/grounding-technique.js
Component({
  data: {
    currentStep: 0,  // 0-4，对应5-4-3-2-1
    steps: [
      { number: 5, sense: '看到', prompt: '说出你能看到的5样东西', placeholder: '例如：桌子、树木、杯子...' },
      { number: 4, sense: '触摸到', prompt: '说出你能触摸到的4样东西', placeholder: '例如：衣服的质感、桌面的温度...' },
      { number: 3, sense: '听到', prompt: '说出你能听到的3样声音', placeholder: '例如：鸟叫声、车流声、空调声...' },
      { number: 2, sense: '闻到', prompt: '说出你能闻到的2样气味', placeholder: '例如：咖啡香、花香...' },
      { number: 1, sense: '尝到', prompt: '说出你能尝到的1样味道', placeholder: '例如：薄荷糖的清凉...' }
    ],
    userInputs: ['', '', '', '', ''],  // 用户每步的输入
    isFinished: false
  },

  methods: {
    onInputChange(e) {
      const idx = this.data.currentStep
      let inputs = this.data.userInputs
      inputs[idx] = e.detail.value
      this.setData({ userInputs: inputs })
    },

    nextStep() {
      const currentInput = this.data.userInputs[this.data.currentStep]
      if (!currentInput.trim()) {
        wx.showToast({ title: '请先完成当前步骤', icon: 'none' })
        return
      }

      if (this.data.currentStep < 4) {
        this.setData({ currentStep: this.data.currentStep + 1 })
        wx.vibrateShort({ type: 'light' })  // 触觉反馈
      } else {
        this.setData({ isFinished: true })
        this.triggerEvent('finished')
      }
    }
  }
})
```

### 4.4 cognitive-reappraisal 组件（认知重评）

**核心实现要点**：
- 引导用户识别负面想法
- 提供重评问题列表（如"有其他解释吗？""最坏的结果是什么？"）
- 帮助用户找到更平衡的想法
- 总时长：约2分钟

```javascript
// components/cognitive-reappraisal/cognitive-reappraisal.js
Component({
  data: {
    stage: 'identify',  // 'identify' | 'reevaluate' | 'balance' | 'finished'
    negativeThought: '',
    reappraisalAnswers: {
      evidence: '',      // 支持这个想法的证据
      alternative: '',   // 其他可能的解释
      worstCase: '',     // 最坏的结果
      balancedThought: '' // 更平衡的想法
    },
    questions: [
      { key: 'evidence', question: '支持这个想法的证据是什么？' },
      { key: 'alternative', question: '有其他可能的解释吗？' },
      { key: 'worstCase', question: '最坏的结果是什么？发生的概率有多大？' },
      { key: 'balancedThought', question: '现在，更平衡的想法是什么？' }
    ],
    currentQuestionIdx: 0
  },

  methods: {
    identifyThought(e) {
      this.setData({ negativeThought: e.detail.value })
    },

    startReevaluation() {
      if (!this.data.negativeThought.trim()) {
        wx.showToast({ title: '请先描述你的负面想法', icon: 'none' })
        return
      }
      this.setData({ stage: 'reevaluate' })
    },

    answerQuestion(e) {
      const key = this.data.questions[this.data.currentQuestionIdx].key
      let answers = this.data.reappraisalAnswers
      answers[key] = e.detail.value
      this.setData({ 
        reappraisalAnswers: answers,
        currentQuestionIdx: this.data.currentQuestionIdx + 1
      })

      if (this.data.currentQuestionIdx >= this.data.questions.length) {
        this.setData({ stage: 'finished' })
        this.triggerEvent('finished')
      }
    }
  }
})
```

### 4.5 emergency-contacts 组件（应急联系人管理）

**核心实现要点**：
- 显示已保存的联系人列表（最多3个）
- 添加/编辑/删除联系人
- 一键拨打功能（调用 `wx.makePhoneCall`）
- 数据持久化到 `wx.setStorageSync`

---

## 五、依赖说明

### 5.1 小程序原生能力（无额外依赖）

| API | 用途 | 文档 |
|-----|------|------|
| `wx.setStorageSync` / `wx.getStorageSync` | 本地存储应急联系人 | [数据缓存](https://developers.weixin.qq.com/miniprogram/dev/api/storage/wx.setStorageSync.html) |
| `wx.makePhoneCall` | 一键拨打联系人电话 | [拨打电话](https://developers.weixin.qq.com/miniprogram/dev/api/device/phone/wx.makePhoneCall.html) |
| `wx.showShareMenu` | 启用分享功能 | [转发](https://developers.weixin.qq.com/miniprogram/dev/api/share/wx.showShareMenu.html) |
| `wx.showModal` | 确认删除联系人 | [模态对话框](https://developers.weixin.qq.com/miniprogram/dev/api/ui/interaction/wx.showModal.html) |
| `wx.vibrateShort` | 触觉反馈（接地术） | [振动](https://developers.weixin.qq.com/miniprogram/dev/api/device/vibrate/wx.vibrateShort.html) |

### 5.2 第三方库

**无**。所有功能使用小程序原生能力 + 纯CSS动画实现，确保轻量化和性能。

---

## 六、app.json 配置修改

```json
{
  "subpackages": [
    // ... 现有分包 ...
    {
      "root": "pages/emotion-first-aid",
      "name": "pkg-emotion-first-aid",
      "pages": ["emotion-first-aid"]
    }
  ],
  
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["pkg-emotion-first-aid"]
    }
  }
}
```

---

## 七、首页入口卡片设计（index.wxml）

```xml
<!-- 在 pages/index/index.wxml 的"快捷工具"和"每日推荐"之间插入 -->
<view class="section emergency-entry" bindtap="goEmotionFirstAid">
  <view class="emergency-header">
    <text class="emergency-icon">🆘</text>
    <view class="emergency-info">
      <text class="emergency-title">情绪急救箱</text>
      <text class="emergency-desc">快速缓解负面情绪</text>
    </view>
    <text class="emergency-arrow">›</text>
  </view>
  <view class="emergency-tools">
    <text class="tool-tag">🫁 呼吸法</text>
    <text class="tool-tag">🎯 接地术</text>
    <text class="tool-tag">💭 认知重评</text>
  </view>
</view>
```

**样式要点**（index.wxss）：
- 使用渐变背景（#ff6b6b → #feca57，紧急感但不过于刺眼）
- 圆角卡片 + 阴影
- 悬停效果（`.emergency-entry:active { transform: scale(0.98); }`）

---

## 八、实施优先级

| 优先级 | 功能模块 | 说明 |
|--------|----------|------|
| P0 | 项目基础设施 | 创建分包结构、app.json配置、首页入口卡片 |
| P1 | 情绪识别 + 呼吸法 | 核心功能，快速验证效果 |
| P2 | 接地术 + 认知重评 | 完整工具链 |
| P3 | 应急联系人管理 | 辅助功能 |
| P4 | 分享功能优化 | 传播推广 |

---

## 九、测试要点

1. **功能测试**：
   - 情绪选择 + 强度评分
   - 3个工具的正常流程和异常中断
   - 应急联系人增删改查
   - 一键拨打（模拟器和真机）

2. **性能测试**：
   - CSS动画是否流畅（尤其是呼吸法）
   - 计时器是否准确

3. **分享测试**：
   - 分享给朋友（卡片显示正常）
   - 分享到朋友圈（图片+文字）

---

## 十、未来扩展方向

1. **情绪日志记录**：保存每次使用记录，形成情绪趋势图
2. **个性化推荐**：根据情绪类型推荐最适合的工具
3. **云端同步**：将应急联系人同步到云端（需登录）
4. **更多工具**：渐进式肌肉放松、正念冥想等
5. **社交功能**：分享使用心得、邀请好友互相设置应急联系人

---

**设计完成**。请开发工程师参考此文档进行实现。
