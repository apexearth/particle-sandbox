import React from 'react'

import {
    ShareButtons,
    ShareCounts,
    generateShareIcon
} from 'react-share'

const {
          FacebookShareButton,
          GooglePlusShareButton,
          LinkedinShareButton,
          TwitterShareButton,
      } = ShareButtons

const FacebookIcon   = generateShareIcon('facebook')
const GooglePlusIcon = generateShareIcon('google')
const TwitterIcon    = generateShareIcon('twitter')
const LinkedinIcon   = generateShareIcon('linkedin')

module.exports = () => (
    <div id="share-buttons">
        <a href="https://www.facebook.com/particlesandbox" target="_blank">
            <FacebookIcon size={24} round={false}/>
        </a>
        <GooglePlusShareButton url="http://particlesandbox.com">
            <GooglePlusIcon size={24} round={false}/>
        </GooglePlusShareButton>
        <TwitterShareButton url="http://particlesandbox.com">
            <TwitterIcon size={24} round={false}/>
        </TwitterShareButton>
        <LinkedinShareButton url="http://particlesandbox.com">
            <LinkedinIcon size={24} round={false}/>
        </LinkedinShareButton>
    </div>
)
