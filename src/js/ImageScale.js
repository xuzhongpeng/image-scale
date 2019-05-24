/**
 * 本js用于web端图片缩放，传参img父级元素elem及能够表示屏幕宽度的元素parentDom
 */
function log(message){
  document.querySelector('#good').innerHTML=document.querySelector('#good').innerHTML+'<br/>'+message
}
export default class ImageScale {
  constructor() {
    this.wrapX; //可视区域宽度
    this.wrapY; //可视区域高度
    this.element; //图片dom
    this.imgBaseWidth; //原始图片宽度
    this.imgBaseHeight; //原始图片高度
    this.mapX; //缩放后图片宽度
    this.mapY; //缩放后图片高度
    this.width;//图片宽度与可视宽度差
    this.height;//图片高度与可视高度差
    this.basePageX //点击时开始的坐标
    this.basePageY //点击时开始的坐标
    this.finger //false单击true多击
    this.beforeX=0 //当图片移动之前translate的x值
    this.beforeY=0 //当图片移动之前translate的y值
  }
  init(params) {
    params = params || {};
    if (!params.elem && !params.elems) {
      throw new Error("elem or elems is necessary property");
    }
    //初始化可是区域宽高
    this.wrapX = params.maskDom
      ? document.querySelector(params.maskDom).offsetWidth
      : window.screen.availWidth || document.body.offsetWidth;
    this.wrapY = params.maskDom
      ? document.querySelector(params.maskDom).offsetHeight
      : window.screen.availHeight || document.body.offsetHeight;
    //初始化事件
    if (params.elem) {
      this.element =
        document.querySelector(params.elem)
         ||document.getElementsByClassName(params.elem)[0]
         ||document.getElementById(params.elem);
         if(!this.element||this.element.length===0){
           throw new Error('your elem get the wrong dom,check your elem params')
         }
         this.imgBaseWidth=this.element.offsetWidth
         this.imgBaseHeight=this.element.offsetHeight
      this._addEventStart();
    }
  }
  /**
   * 添加事件
   * @param {参数} param
   */
  _addEventStart() {
    var self = this;
    this.mapX = this.imgBaseWidth || 0; //图片宽度
    this.mapY = this.imgBaseHeight || 0; //图片高度
    //添加点击后的事件
    self.element.addEventListener(
      "touchstart",
      function(e) {
        self._touchstart(e);
      },
      false
    );
    //添加移动事件
    self.element.addEventListener(
      "touchmove",
      function(e) {
        self._touchmove(e);
      },
      false
    );
    //添加点击完成或者移动完成的事件
    self.element.addEventListener(
      "touchend",
      function(e) {
        self._touchend(e);
      },
      false
    );
  }
  _touchstart (e) {
    var touchTarget = e.targetTouches.length; //获得触控点数
    this._changeData(); //重新初始化图片、可视区域数据，由于放大会产生新的计算
    if (touchTarget === 1) {
      // 获取开始坐标
      this.basePageX = getPage(e, "pageX");
      this.basePageY = getPage(e, "pageY");
      this.finger = false;
    } else {
      this.finger = true;

      this.startFingerDist = this.getTouchDist(e).dist;
      this.startFingerX = this.getTouchDist(e).x;
      this.startFingerY = this.getTouchDist(e).y;
    }
  }
  _touchend (e) {
     this.beforeX=0
     this.beforeY=0
   if (this.wrapX < this.element.offsetWidth) {
     this.beforeX = (this.wrapX - this.element.offsetWidth) / 2;
   }
   if (this.wrapY < this.element.offsetHeight) {
     this.beforeY = (this.wrapY - this.element.offsetHeight) / 2;
   }
   this.refresh(0 + this.beforeX, 0 + this.beforeY, "0.2s", "ease-in-out");
 }

  // 更新图片信息
  _changeData () {
    this.mapX = this.element.offsetWidth; //图片宽度
    this.mapY = this.element.offsetHeight; //图片高度
    // this.outDistY = (this.mapY - this.wrapY)/2; //当图片高度超过屏幕的高度时候。图片是垂直居中的，这时移动有个高度做为缓冲带
    this.width = this.mapX - this.wrapX; //图片的宽度减去可视区域的宽度
    this.height = this.mapY - this.wrapY; //图片的高度减去可视区域的高度
  }
  //移动与放大
  _touchmove (e) {
    var self = this;

    e.preventDefault();
    // e.stopPropagation();

    var touchTarget = e.targetTouches.length; //获得触控点数

    if (touchTarget === 1 && !self.finger) {
      self._move(e);
    }

    if (touchTarget >= 2) {
      self._zoom(e);
    }
  }
  _move (e) {
    var self = this,
      pageX = getPage(e, "pageX"), //获取移动坐标
      pageY = getPage(e, "pageY");
    // 获得移动距离
    self.distX = pageX - self.basePageX +self.beforeX;
    self.distY = pageY - self.basePageY +self.beforeY;
    self.refresh(self.distX, self.distY, "0s", "ease");
    self.finger = false;
  }

  // 执行图片移动
  refresh (x, y, timer, type) {
    this.element.style.webkitTransitionProperty = "-webkit-transform";
    this.element.style.webkitTransitionDuration = timer;
    this.element.style.webkitTransitionTimingFunction = type;
    this.element.style.webkitTransform = getTranslate(x, y);
  }

  // 图片缩放
  _zoom (e) {
    var self = this;
    // e.preventDefault();
    // e.stopPropagation();

    var nowFingerDist = self.getTouchDist(e).dist, //获得当前长度
      ratio = nowFingerDist / self.startFingerDist, //计算缩放比
      imgWidth = Math.round(self.mapX * ratio), //计算图片宽度
      imgHeight = Math.round(self.mapY * ratio); //计算图片高度

    // 计算图片新的坐标
    self.imgNewX = Math.round(
      self.startFingerX * ratio - self.startFingerX - self.beforeX * ratio
    );
    self.imgNewY = Math.round(
      (self.startFingerY * ratio - self.startFingerY) / 2 - self.beforeY * ratio
    );
    if (imgWidth >= self.imgBaseWidth) {
      self.element.style.width = imgWidth + "px";
      self.refresh(-self.imgNewX, -self.imgNewY, "0s", "ease");
      self.finger = true;
    } else {
      if (imgWidth < self.imgBaseWidth) {
        self.element.style.width = self.imgBaseWidth + "px";
      }
    }

    self.finger = true;
  }

  // 获取多点触控
  getTouchDist (e) {
    var x1 = 0,
      y1 = 0,
      x2 = 0,
      y2 = 0,
      x3 = 0,
      y3 = 0,
      result = {};

    x1 = e.touches[0].pageX;
    x2 = e.touches[1].pageX;
    y1 = e.touches[0].pageY - document.body.scrollTop;
    y2 = e.touches[1].pageY - document.body.scrollTop;

    if (!x1 || !x2) return;

    if (x1 <= x2) {
      x3 = (x2 - x1) / 2 + x1;
    } else {
      x3 = (x1 - x2) / 2 + x2;
    }
    if (y1 <= y2) {
      y3 = (y2 - y1) / 2 + y1;
    } else {
      y3 = (y1 - y2) / 2 + y2;
    }

    result = {
      dist: Math.round(Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))),
      x: Math.round(x3),
      y: Math.round(y3)
    };
    return result;
  }
}

/**
 * 兼容判断
 */
var document = window.document,
  support = {
    transform3d: "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix(),
    touch: "ontouchstart" in window
  };

/**
 *
 * @param {移动x距离} x
 * @param {移动y距离} y
 */
function getTranslate(x, y) {
  let distX = x,
    distY = y;
  return support.transform3d
    ? "translate3d(" + distX + "px, " + distY + "px, 0)"
    : "translate(" + distX + "px, " + distY + "px)";
}
/**
 * 获取点击坐标
 * @param {*} event
 * @param {*} page
 */
function getPage(event, page) {
  return support.touch ? event.changedTouches[0][page] : event[page];
}
const imageScale = new ImageScale();
export { imageScale };
