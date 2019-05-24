import {imageScale} from "../src/js/ImageScale.js";
try{
imageScale.init({
  elem: ".myDom img"
});
}catch(e){
  document.querySelector('#good').innerHTML=e
}