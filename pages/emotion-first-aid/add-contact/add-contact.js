// pages/emotion-first-aid/add-contact/add-contact.js
Page({
  data: {
    name: '',
    phone: '',
    relationship: '',
    storageKey: 'emergency_contacts',
    maxContacts: 3,
  },

  onLoad() {
    // 检查是否已达上限
    const contacts = wx.getStorageSync(this.data.storageKey) || []
    if (contacts.length >= this.data.maxContacts) {
      wx.showToast({ title: `最多添加${this.data.maxContacts}个联系人`, icon: 'none' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }
  },

  // 姓名输入
  onNameInput(e) {
    this.setData({ name: e.detail.value })
  },

  // 电话输入
  onPhoneInput(e) {
    this.setData({ phone: e.detail.value })
  },

  // 关系输入
  onRelationInput(e) {
    this.setData({ relationship: e.detail.value })
  },

  // 保存
  saveContact() {
    const { name, phone, relationship } = this.data

    if (!name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' })
      return
    }

    if (!phone.trim()) {
      wx.showToast({ title: '请输入电话号码', icon: 'none' })
      return
    }

    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(phone.trim())) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
      return
    }

    // 获取现有联系人
    const contacts = wx.getStorageSync(this.data.storageKey) || []

    // 添加新联系人
    const newContact = {
      id: 'contact_' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      relationship: relationship.trim() || '',
      createTime: Date.now(),
    }

    contacts.push(newContact)
    wx.setStorageSync(this.data.storageKey, contacts)

    wx.showToast({ title: '添加成功', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },
})
