function getContentRender(content, refreshLayer, callback) {
  var global = window;

  var docStyle = document.documentElement.style;

  var engine;
  if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
    engine = 'presto';
  } else if ('MozAppearance' in docStyle) {
    engine = 'gecko';
  } else if ('WebkitAppearance' in docStyle) {
    engine = 'webkit';
  } else if (typeof navigator.cpuClass === 'string') {
    engine = 'trident';
  }

  var vendorPrefix = {
    trident: 'ms',
    gecko: 'Moz',
    webkit: 'Webkit',
    presto: 'O'
  }[engine];

  var helperElem = document.createElement("div");
  var undef;

  var perspectiveProperty = vendorPrefix + "Perspective";
  var transformProperty = vendorPrefix + "Transform";

  if (helperElem.style[perspectiveProperty] !== undef) {

    return function(left, top, zoom) {
      if (top < 0) {
        if (refreshLayer) {
          if (top <= -180) top = -180;
          refreshLayer.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ') rotate('+ (-top) +'deg)';
        }
      } else {
        content.style[transformProperty] = 'translate3d(' + (-left) + 'px,' + (-top) + 'px,0) scale(' + zoom + ')';
      }
      if (typeof callback === 'function') {
        callback({
          left:left,
          top:top,
          zoom:zoom
        });
      }
    };

  } else if (helperElem.style[transformProperty] !== undef) {

    return function(left, top, zoom) {
      if (top < 0) {
        if (refreshLayer) {
          if (top <= -180) top = -180;
          content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ') rotate('+ (-top) +'deg)';
        } 
      } else {
        content.style[transformProperty] = 'translate(' + (-left) + 'px,' + (-top) + 'px) scale(' + zoom + ')';
      }
    };

  } else {

    return function(left, top, zoom) {
      content.style.marginLeft = left ? (-left/zoom) + 'px' : '';
      content.style.marginTop = top ? (-top/zoom) + 'px' : '';
      content.style.zoom = zoom || '';
    };

  }
}

module.exports = getContentRender;
