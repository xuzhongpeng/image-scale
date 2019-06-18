import ImageScale,{imageScales,openImage} from "../src/js/index.js";
try {
  // new ImageScale(".myDom img");
  // imageScales('.myDom img')
  openImage('.myDom')
} catch (e) {
  // document.querySelector('#good').innerHTML = e
  console.log(e)
}