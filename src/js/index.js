import ImageScale from "./ImageScale.js";

/**
 * 
 * @param {传入多个图片} elem 
 * @param {父级} parents 
 */
const imageScales = function (elem, parents) {
  let elems = document.querySelectorAll(elem)
  elems.forEach((elem, k) => {
    new ImageScale(elem, parents)
  })
}

const openImage = function (domName) {
  let dom = document.createElement('div')
  dom.style = `
    width:${window.screen.availWidth}px;
    height:${window.screen.availHeight}px;
    position:fixed;
    background:rgba(39, 39, 39, 0.74);
    top:0;
    left:0;
    overflow:hidden;
    // display:flex;
    // flex-flow:column nowrap;
  `
  dom.addEventListener('click', close)
  // dom.addEventListener('touchstart',close)
  function close(e) {
    e.stopPropagation()
    dom.style.display = 'none';
  }
  let title = document.createElement('div')
  title.innerText = '1/2'
  title.style = `
    width:100%;
    position:absolute;
    top:0;
    text-align:center;
    color:#fff;
  `
  dom.appendChild(title)
  // let alertImg = document.createElement('style')
  // alertImg.innerHTML=`
  //   .alertImg:before{
  //     content:'1 / 2';
  //     height:50px;
  //   }
  // `
  // document.querySelector('head').appendChild(alertImg)
  // dom.setAttribute('class','alertImg')
  let imgDom = document.createElement('div')
  let img = document.createElement('img')
  imgDom.style = `
    width:100%;
    position:relative;
    top:50%;
    transform: translateY(-50%);
//     background-position: center center;
// 　　background-repeat: no-repeat;
// 　　-webkit-background-size:cover;
// 　　-moz-background-size:cover;
// 　　background-size:cover;
    // justify-content: center;
    // align-items: center;
  `
  img.style.width='100%'
  imgDom.appendChild(img)
  dom.appendChild(imgDom)
  document.body.appendChild(dom)

  let elems = document.querySelectorAll(domName + " img")
  elems.forEach(v => {
    v.addEventListener('click', function (e) {
      
      dom.style.display = 'block';
      img.src = e.target.src
      new ImageScale(img)
      // e.
    })
  })
}
export default ImageScale
export { imageScales, openImage };