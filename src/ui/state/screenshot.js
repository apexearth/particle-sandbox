import analytics from '../analytics'

const settings = require('../../settings')
export default state => {
    let screenshot = {
        capture() {
            screenshot.canvas  = createCanvasCopy()
            screenshot.dataURL = screenshot.canvas.toDataURL('image/png')
            screenshot.show()
            analytics.event('screenshot', 'capture')
        },
        canvas               : null,
        visible              : false,
        show() {
            state.ps.paused                  = true
            screenshot.visible               = true
            screenshot.enableShareToFacebook = true
            state.emit('screenshot')
        },
        hide() {
            state.ps.paused    = false
            screenshot.visible = false
            state.emit('screenshot')
        },
        download() {
            let dateString = new Date().toJSON().replace(/-/g, '').replace('T', '').replace(/[:.Z]/g, '')
            let filename   = 'particlesandbox.com-' + dateString + '.png'
            if (window.navigator.msSaveOrOpenBlob === undefined) {
                // Non-IE
                let link      = document.createElement("a")
                link.download = filename
                link.href     = screenshot.dataURL
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            } else {
                window.navigator.msSaveOrOpenBlob(dataURItoBlob(screenshot.dataURL), filename)
            }
            analytics.event('screenshot', 'download')
        },
        enableShareToFacebook: true,
        shareToFacebook() {
            screenshot.enableShareToFacebook = false
            state.emit('screenshot')
            window.FB.ensureLoggedIn(accessToken =>
                window.FB.postImageToFacebook(accessToken, dataURItoBlob(screenshot.dataURL),
                    err => {
                        analytics.event('screenshot', 'facebook', err || 'success')
                    }
                )
            )
        },
    }

    function createCanvasCopy() {
        let source    = state.ps.renderer.view
        let canvas    = document.createElement('canvas')
        let context   = canvas.getContext('2d')
        canvas.width  = source.width
        canvas.height = source.height

        // Invert colors if necessary.
        if (settings.invertColors) {
            context.fillStyle = 'white'
            context.fillRect(0, 0, source.width, source.height)
            context.globalCompositeOperation = 'difference'
        }
        context.drawImage(source, 0, 0)
        return canvas
    }

    return screenshot
}

function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(',')[1])
    let ab         = new ArrayBuffer(byteString.length)
    let ia         = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], {type: 'image/png'})
}
