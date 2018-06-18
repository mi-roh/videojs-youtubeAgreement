# Requesting Agreement for YouTube-Videos<br />for [videojs-youtube](https://github.com/videojs/videojs-youtube)

This [videojs](https://github.com/videojs/video.js) Plugin adds an Agreement Option for Youtube-Videos within the 
videojs-player to make it GDPR (de: DS-GVO / fr: RGPD) compatible.

## Requirements & Constriction

- This will only work in CommonJS enviornments like [RequireJs](http://requirejs.org/) or 
  [Browserify](http://browserify.org/).
- The Callback-Function passed by the initialization of the video (3. parameter of videojs) will only be fired by the 
  first time, not after enabeling/disabeling youtube. 
- jQuery is required, cause I'm only using this script in jQuery context. 

## Quick Start

Instead of including the ``videojs-youtube`` script the ``videojs-youtubeAgreement`` script will be added. If the user 
agrees, the ``videojs-youtube`` script will be load automaticly. 

## Example

Original File

```javascript
/* globals require */

var videojs = require( 'videojs.js' );
require( 'videojs-youtube.js' );

var options = {};

var player = videojs('my-player', options );

```

Updated File 

```javascript
/* globals require */

var videojs = require( 'videojs.js' );
require( 'videojs-youtubeAgreement.js' );

var options = {};

var player = videojs('my-player', options );

```

## How does it work?

On initialization of an videojs video, the Script will check if there is a youtube-Source. If so, it will display a 
message asking for permission to load content from youtube. If the permission is granted by the user, the script loads 
the videojs-youtube-script, sets a cookie for 7 days and reloads the videos with youtube-content on the Page. No 
confirmation by the user is required for the next 7 days. 

## Options

All options can be set global for all videos or individual for each video. 

All Texts that are shown to the user can be modified ether by adding a translation-file or with an option-parameter. 
– See ``lang/en.js`` for details. 



**global**

```javascript
videojs.options.youtubeAgreement = {
    // set Option
};
```

**individual**

Regular like every other Plugin.

Via JavaScript:

```javascript
var options: {
    plugins: {
        youtubeAgreement: {
            // set Options
        }
    }
    // ...
};

videojs( 'my-player', options );
```

Inline in HTML:

```html
<video id="vid1" class="video-js" 
data-setup='{ plugins: { youtubeAgreement: { /* set Options */ } } /* ... */ }'
>
</video>
```

### Privicy Pilicy: ``privacyPolicyUrl``

Type: ``boolen`` | ``string``

Defines the URL of the privacy plice page.

### Translations: ``textInfo``, ``textButton``, ``textPrivacy``, ``textPrivacyLink``, ``textDisagree``, ``textReload`` & ``privacyPolicyUrl``

Type: ``string``

## Q&A
- **why not just use youtube-nocookie.com?**  
videojs-youtube is based on the youtube-api – the api is only available with cookies.

## License
The MIT License (MIT)

Copyright (c) Micha Rohde <hi@mi-roh.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
