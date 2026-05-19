// pages/emotion-first-aid/edit-contact/edit-contact.js
Page({
  data: {
    id: '',
    name: '',
    phone: '',
    relationship: '',
    storageKey: 'emergency_contacts',
  },

  onLoad(options) {
    const { id } = options
    if (!id) {
      wx.showToast({ title: '参数错误', icon: 'none' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }

    this.setData({ id })

    // 加载联系人数据
    const contacts = wx.getStorageSync(this.data.storageKey) || []
    const contact = contacts.find(c => c.id === id)

    if (!contact) {
      wx.showToast({ title: '联系人不存在', icon: 'none' })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
      return
    }

    this.setData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship || '',
    })
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
    const { id, name, phone, relationship } = this.data

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
    const index = contacts.findIndex(c => c.id === id)

    if (index === -1) {
      wx.showToast({ title: '联系人不存在', icon: 'none' })
      return
    }

    // 更新联系人
    contacts[index] = {
      ...contacts[index],
      name: name.trim(),
      phone: phone.trim(),
      relationship: relationship.trim() || '',
      updateTime: Date.now(),
    }

    wx.setStorageSync(this.data.storageKey, contacts)

    wx.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  },

  // 删除
  deleteContact() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个联系人吗？',
      success: (res) => {
        if (res.confirm) {
          const contacts = wx.getStorageSync(this.data.storageKey) || []
          const filtered = contacts.filter(c => c.id !== this.data.id)
          wx.setStorageSync(this.data.storageKey, filtered)
          wx.showToast({ title: '已删除', icon: 'success' })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  },
})
