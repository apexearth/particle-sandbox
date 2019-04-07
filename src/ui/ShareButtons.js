import React from 'react'
import analytics from './analytics'

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
          RedditShareButton,
      } = ShareButtons

const FacebookIcon   = generateShareIcon('facebook')
const GooglePlusIcon = generateShareIcon('google')
const TwitterIcon    = generateShareIcon('twitter')
const LinkedinIcon   = generateShareIcon('linkedin')
const RedditIcon     = generateShareIcon('reddit')

const title       = "Particle Sandbox - Gravity Simulator"
const description = "Interactive gravity simulation on a grand scale."


export default () => (
    <div id="share-buttons">
        <a href="https://www.facebook.com/particlesandbox"
           target="_blank" rel="noopener noreferrer"
           onClick={() => analytics.share('Facebook')}>
            <FacebookIcon size={24} round={false}/>
        </a>

        <GooglePlusShareButton url="http://particlesandbox.com"
                               beforeOnClick={() => analytics.share('GooglePlus')}>
            <GooglePlusIcon size={24} round={false}/>
        </GooglePlusShareButton>

        <TwitterShareButton url="http://particlesandbox.com"
                            hashtags={['particlesandbox', 'gravity', 'simulator']}
                            beforeOnClick={() => analytics.share('Twitter')}>
            <TwitterIcon size={24} round={false}/>
        </TwitterShareButton>

        <LinkedinShareButton url="http://particlesandbox.com"
                             title={title}
                             description={description}
                             beforeOnClick={() => analytics.share('Linkedin')}>
            <LinkedinIcon size={24} round={false}/>
        </LinkedinShareButton>

        <RedditShareButton url="http://particlesandbox.com"
                           title={title}
                           beforeOnClick={() => analytics.share('Reddit')}>
            <RedditIcon size={24} round={false}/>
        </RedditShareButton>

        <a href="https://play.google.com/store/apps/details?id=com.particlesandbox"
           target="_blank" rel="noopener noreferrer">
            <img src="img/buttons/android.png" alt={"android"} width="24" height="24"/>
        </a>
    </div>
)
