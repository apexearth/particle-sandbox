export default {
    share: platform => {
        ga('send', 'event', 'Share', platform)
    },
    event: (category, action, label) => {
        ga('send', 'event', category, action, label)
    }
}