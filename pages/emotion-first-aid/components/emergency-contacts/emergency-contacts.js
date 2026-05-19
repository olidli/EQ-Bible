// components/emergency-contacts/emergency-contacts.js
Component({
  properties: {},

  data: {
    // 联系人列表
    contacts: [],
    // 最大联系人数量
    maxContacts: 3,
    // 存储键
    storageKey: 'emergency_contacts',
  },

  lifetimes: {
    attached() {
      this.loadContacts()
    },
  },

  methods: {
    // 加载联系人
    loadContacts() {
      const contacts = wx.getStorageSync(this.data.storageKey) || []
      this.setData({ contacts })
    },

    // 添加联系人
    addContact() {
      if (this.data.contacts.length >= this.data.maxContacts) {
        wx.showToast({ title: `最多添加${this.data.maxContacts}个联系人`, icon: 'none' })
        return
      }
      wx.navigateTo({ url: '/pages/emotion-first-aid/add-contact/add-contact' })
    },

    // 编辑联系人
    editContact(e) {
      const id = e.currentTarget.dataset.id
      wx.navigateTo({ url: `/pages/emotion-first-aid/edit-contact/edit-contact?id=${id}` })
    },

    // 删除联系人
    deleteContact(e) {
      const id = e.currentTarget.dataset.id
      wx.showModal({
        title: '确认删除',
        content: '确定要删除这个联系人吗？',
        success: (res) => {
          if (res.confirm) {
            const contacts = this.data.contacts.filter(c => c.id !== id)
            wx.setStorageSync(this.data.storageKey, contacts)
            this.setData({ contacts })
            wx.showToast({ title: '已删除', icon: 'success' })
            this.triggerEvent('contactChanged')
          }
        }
      })
    },

    // 拨打电话
    callContact(e) {
      const phone = e.currentTarget.dataset.phone
      wx.makePhoneCall({
        phoneNumber: phone,
        fail: () => {
          // 用户取消拨打
        }
      })
    },
  },
})
