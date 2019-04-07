export default {
    share: platform => {
        window.ga('send', 'event', 'Share', platform)
    },
    event: (category, action, label) => {
        window.ga('send', 'event', category, action, label)
    }
}
