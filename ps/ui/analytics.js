export default {
    share: platform => {
        ga('send', 'event', 'Share', platform)
        console.log('shared ' + platform)
    }
}