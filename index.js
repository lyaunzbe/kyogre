import {
  polyfill
}
from 'es6-promise'
polyfill()

import THREE from 'three'
import domready from 'domready'
import viewer from './src/viewer'
import assign from 'object-assign'
import loadVideo from './src/load-video'

domready(() => {

  assign(document.body.style, {
    background: '#000',
    overflow: 'hidden',
    margin: 0
  })
  loadVideo('./assets/pool.mp4').then(function(fire){
  loadVideo('./assets/waves.mp4').then(function(video){

    const app = viewer({
      alpha: false,
      preserveDrawingBuffer: false,
      antialias: true
    }, video, fire);

    document.body.appendChild(app.canvas);
    app.start();
  })
})

})
