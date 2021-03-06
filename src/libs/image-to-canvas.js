;(function ($) {
  'use strict';
  function loadImage (file, callback, options) {
    var img = document.createElement('img');
    var url;
    img.onerror = function (event) {
      return loadImage.onerror(img, event, file, callback, options);
    };
    img.onload = function (event) {
      return loadImage.onload(img, event, file, callback, options);
    };
    if (loadImage.isInstanceOf('Blob', file) ||
      loadImage.isInstanceOf('File', file)) {
      url = img._objectURL = loadImage.createObjectURL(file);
    } else if (typeof file === 'string') {
      url = file;
      if (options && options.crossOrigin) {
        img.crossOrigin = options.crossOrigin;
      }
    } else {
      return false;
    }
    if (url) {
      img.src = url;
      return img;
    }
    return loadImage.readFile(file, function (e) {
      var target = e.target;
      if (target && target.result) {
        img.src = target.result;
      } else if (callback) {
        callback(e);
      }
    })
  }
  var urlAPI = (window.createObjectURL && window) ||
    (window.URL && URL.revokeObjectURL && URL) ||
    (window.webkitURL && webkitURL);

  function revokeHelper (img, options) {
    if (img._objectURL && !(options && options.noRevoke)) {
      loadImage.revokeObjectURL(img._objectURL);
      delete img._objectURL;
    }
  }

  loadImage.isInstanceOf = function (type, obj) {
    return Object.prototype.toString.call(obj) === '[object ' + type + ']';
  };

  loadImage.transform = function (img, options, callback, file, data) {
    callback(loadImage.scale(img, options, data), data);
  };

  loadImage.onerror = function (img, event, file, callback, options) {
    revokeHelper(img, options);
    if (callback) {
      callback.call(img, event);
    }
  };

  loadImage.onload = function (img, event, file, callback, options) {
    revokeHelper(img, options);
    if (callback) {
      loadImage.transform(img, options, callback, file, {});
    }
  };

  loadImage.transformCoordinates = function () {
    return false;
  };

  loadImage.getTransformedOptions = function (img, options) {
    var aspectRatio = options.aspectRatio;
    var newOptions, i, width, height;
    if (!aspectRatio) {
      return options;
    }
    newOptions = {};
    for (i in options) {
      if (options.hasOwnProperty(i)) {
        newOptions[i] = options[i];
      }
    }
    newOptions.crop = true;
    width = img.naturalWidth || img.width;
    height = img.naturalHeight || img.height;
    if (width / height > aspectRatio) {
      newOptions.maxWidth = height * aspectRatio;
      newOptions.maxHeight = height;
    } else {
      newOptions.maxWidth = width;
      newOptions.maxHeight = width / aspectRatio;
    }
    return newOptions;
  };

  loadImage.renderImageToCanvas = function (
    canvas,
    img,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    destX,
    destY,
    destWidth,
    destHeight
  ) {
    canvas.getContext('2d').drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      destWidth,
      destHeight
    );
    return canvas;
  };

  loadImage.hasCanvasOption = function (options) {
    return options.canvas || options.crop || !!options.aspectRatio;
  };

  loadImage.scale = function (img, options, data) {
    options = options || {};
    var canvas = document.createElement('canvas');
    var useCanvas = img.getContext || (loadImage.hasCanvasOption(options) && canvas.getContext);
    var width = img.naturalWidth || img.width;
    var height = img.naturalHeight || img.height;
    var destWidth = width, destHeight = height, maxWidth, maxHeight, minWidth, minHeight;
    var sourceWidth, sourceHeight, sourceX, sourceY, pixelRatio, downsamplingRatio, tmp;
    function scaleUp () {
      var scale = Math.max(
        (minWidth || destWidth) / destWidth,
        (minHeight || destHeight) / destHeight
      );
      if (scale > 1) {
        destWidth *= scale;
        destHeight *= scale;
      }
    }
    function scaleDown () {
      var scale = Math.min(
        (maxWidth || destWidth) / destWidth,
        (maxHeight || destHeight) / destHeight
      );
      if (scale < 1) {
        destWidth *= scale;
        destHeight *= scale;
      }
    }
    if (useCanvas) {
      options = loadImage.getTransformedOptions(img, options, data);
      sourceX = options.left || 0;
      sourceY = options.top || 0;
      if (options.sourceWidth) {
        sourceWidth = options.sourceWidth;
        if (options.right !== undefined && options.left === undefined) {
          sourceX = width - sourceWidth - options.right;
        }
      } else {
        sourceWidth = width - sourceX - (options.right || 0);
      }
      if (options.sourceHeight) {
        sourceHeight = options.sourceHeight;
        if (options.bottom !== undefined && options.top === undefined) {
          sourceY = height - sourceHeight - options.bottom;
        }
      } else {
        sourceHeight = height - sourceY - (options.bottom || 0);
      }
      destWidth = sourceWidth;
      destHeight = sourceHeight;
    }
    maxWidth = options.maxWidth;
    maxHeight = options.maxHeight;
    minWidth = options.minWidth;
    minHeight = options.minHeight;
    if (useCanvas && maxWidth && maxHeight && options.crop) {
      destWidth = maxWidth;
      destHeight = maxHeight;
      tmp = sourceWidth / sourceHeight - maxWidth / maxHeight;
      if (tmp < 0) {
        sourceHeight = maxHeight * sourceWidth / maxWidth;
        if (options.top === undefined && options.bottom === undefined) {
          sourceY = (height - sourceHeight) / 2;
        }
      } else if (tmp > 0) {
        sourceWidth = maxWidth * sourceHeight / maxHeight;
        if (options.left === undefined && options.right === undefined) {
          sourceX = (width - sourceWidth) / 2;
        }
      }
    } else {
      if (options.contain || options.cover) {
        minWidth = maxWidth = maxWidth || minWidth;
        minHeight = maxHeight = maxHeight || minHeight;
      }
      if (options.cover) {
        scaleDown();
        scaleUp();
      } else {
        scaleUp();
        scaleDown();
      }
    }
    if (useCanvas) {
      pixelRatio = options.pixelRatio;
      if (pixelRatio > 1) {
        canvas.style.width = destWidth + 'px';
        canvas.style.height = destHeight + 'px';
        destWidth *= pixelRatio;
        destHeight *= pixelRatio;
        canvas.getContext('2d').scale(pixelRatio, pixelRatio);
      }
      downsamplingRatio = options.downsamplingRatio;
      if (downsamplingRatio > 0 && downsamplingRatio < 1 &&
        destWidth < sourceWidth && destHeight < sourceHeight) {
        while (sourceWidth * downsamplingRatio > destWidth) {
          canvas.width = sourceWidth * downsamplingRatio;
          canvas.height = sourceHeight * downsamplingRatio;
          loadImage.renderImageToCanvas(
            canvas,
            img,
            sourceX,
            sourceY,
            sourceWidth,
            sourceHeight,
            0,
            0,
            canvas.width,
            canvas.height
          );
          sourceWidth = canvas.width;
          sourceHeight = canvas.height;
          img = document.createElement('canvas');
          img.width = sourceWidth;
          img.height = sourceHeight;
          loadImage.renderImageToCanvas(
            img,
            canvas,
            0,
            0,
            sourceWidth,
            sourceHeight,
            0,
            0,
            sourceWidth,
            sourceHeight
          )
        }
      }
      canvas.width = destWidth;
      canvas.height = destHeight;
      loadImage.transformCoordinates(
        canvas,
        options
      );
      return loadImage.renderImageToCanvas(
        canvas,
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        0,
        0,
        destWidth,
        destHeight
      )
    }
    img.width = destWidth;
    img.height = destHeight;
    return img;
  };

  loadImage.createObjectURL = function (file) {
    return urlAPI ? urlAPI.createObjectURL(file) : false;
  };

  loadImage.revokeObjectURL = function (url) {
    return urlAPI ? urlAPI.revokeObjectURL(url) : false;
  };

  loadImage.readFile = function (file, callback, method) {
    if (window.FileReader) {
      var fileReader = new FileReader();
      fileReader.onload = fileReader.onerror = callback;
      method = method || 'readAsDataURL';
      if (fileReader[method]) {
        fileReader[method](file);
        return fileReader;
      }
    }
    return false;
  };

  if (typeof define === 'function' && define.amd) {
    define(function () {
      return loadImage;
    })
  } else if (typeof module === 'object' && module.exports) {
    module.exports = loadImage;
  } else {
    $.loadImage = loadImage;
  }
}(window));
