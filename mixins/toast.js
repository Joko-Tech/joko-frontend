export const toastMixin = {
  data: function() {
    return {
      toastState: {
        show: false,
        message: '',
        type: 'success'
      }
    }
  },
  methods: {
    showToast: function ({ message, type, autoHideDuration }) {
      this.toastState.show = true
      this.toastState.message = message
      this.toastState.type = type

      if(autoHideDuration){
        setTimeout(() => {
          this.hideToast()
        }, autoHideDuration)
      }
    },
    hideToast: function () {
      this.toastState.show = false
      this.toastState.message = ''
      this.toastState.type = ''
    }
  }
}
