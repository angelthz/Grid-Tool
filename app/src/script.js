//canvas
const canvasContainer = document.getElementById("canvas-container");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//DOM elements
const gridForm = document.getElementById("grid-form");
const homeApp = document.getElementById("app-home");
const appContainer = document.getElementById("app-container");


//DOM inputfiles
const newInputFile = document.getElementById("image-input");
const mainInputFile = document.getElementById("main-input");

//DOM inputs
const inputH = document.getElementById("counter-horizontal");
const inputV = document.getElementById("counter-vertical");
const inputW = document.getElementById("counter-width");
const inputBrightness = document.getElementById("brightness-control");
const inputContrast = document.getElementById("contrast-control");
const inputSaturation = document.getElementById("saturation-control");
const paletteContainer = document.querySelector(".palette-container");
const inputColor = document.querySelector(".picker");

//download
const downloadBtn = document.getElementById("download-btn");

const imageBuffer = {
  name: "",
  src : null,
  w : 0,
  h : 0,
  filters: {
    brightness : "",
    contrast : "",
    saturation : ""
  }
}


function drawGrid(imgW,imgH,x,y,lc="rgba(255,0,0)",lw=1){
  context.strokeStyle = lc;
  context.lineWidth = lw;

  //draw horizontal lines
  let actualX = imgW/x;
  // console.log("actual x: ",actualX)
  while(actualX<imgW){
    context.beginPath();
    context.moveTo(actualX, 0);
    context.lineTo(actualX,imgH);
    context.stroke()
    actualX += (imgW/x);
  }

  //draw vertical lines
  let actualY = imgH/y;
  // console.log("actual y: ",actualY)
  while(actualY<imgH){
    context.beginPath();
    context.moveTo(0, actualY);
    context.lineTo(imgW,actualY);
    // context.closePath();
    context.stroke()
    actualY += (imgH/y);
  }
}

const drawImage = () => {
  context.reset()
  canvas.width = imageBuffer.w;
  canvas.height = imageBuffer.h;
  context.filter = getFilters();
  context.drawImage(imageBuffer.src, 0, 0);
  context.filter = "none";
}


const redrawGrid = () => {
  let h = Number.parseInt(inputH.value) +1;
  let v = Number.parseInt(inputV.value) + 1;
  let lc = inputColor.value;
  let lw = Number.parseInt(inputW.value);
  drawGrid(imageBuffer.w, imageBuffer.h, h,v,lc,lw);
}



const clearInputs = () => {
  inputH.value = 0;
  inputV.value = 0;
  inputW.value = 1;
  inputBrightness.value = 100;
  inputContrast.value = 100;
  inputSaturation.value = 100;
}
const clearCanvas = () => {
  imageBuffer.name = ""
  imageBuffer.src = null;
  imageBuffer.h = 0;
  imageBuffer.w = 0;
  for(let filter in imageBuffer.filters)
    imageBuffer.filters[filter] = "";
}

const readImage = (img, name)=> {
  return new Promise((resolve, reject)=>{
    img.addEventListener("load",e => {
      if(img.width && img.height){
        imageBuffer.name = name;
        imageBuffer.src = img;
        imageBuffer.w = img.width;
        imageBuffer.h = img.height;
        resolve(true);
      }
      else{
        reject(false);
      }
    })
  });
}

const loadImage = (e) => {
  clearInputs();
  clearCanvas();
  let fileReader = new FileReader();
  let fileName = e.target.files[0].name;
  fileReader.readAsDataURL(e.target.files[0]);

  fileReader.addEventListener("error", e => {
    console.log("error reading image")
  });
  
  fileReader.addEventListener("loadend", async  e => {
    console.log("image successfully readed")
    let img = new Image();
    img.src = fileReader.result;
    await readImage(img, fileName);
    console.log(imageBuffer)
    drawImage();
    });
}

mainInputFile.addEventListener("change", e => {
  if (!e.target.files[0].type.includes("image")) return;
  homeApp.classList.add("hidden");
  appContainer.classList.remove("hidden");
  loadImage(e);
  // window.location.hash = "app";
});

newInputFile.addEventListener("change", e => {
  if (!e.target.files[0].type.includes("image")) return;
  loadImage(e);
});


// file.addEventListener("change", e => {
//   if (!e.target.files[0].type.includes("image")) return;
//   console.log("valid image")
//   // console.log(e.target.files[0])
//   //
//   clearInputs();
//   clearCanvas();
//   let fileReader = new FileReader();
//   fileReader.readAsDataURL(e.target.files[0]);

//   fileReader.addEventListener("error", e => {
//     console.log("error reading image")
//   });

//   fileReader.addEventListener("loadend", async  e => {
//     console.log("image successfully readed")
//     let img = new Image();
//     img.src = fileReader.result;
//     await readImage(img);
//     drawImage();

//   });
  
// })

/* file.addEventListener("change", e => {
  if (!e.target.files[0].type.includes("image")) return;
  console.log("valid image")
  // console.log(e.target.files[0])
  //
  clearInputs();
  clearCanvas();
  let fileReader = new FileReader();
  fileReader.readAsDataURL(e.target.files[0]);

  fileReader.addEventListener("error", e => {
    console.log("error reading image")
  });

  fileReader.addEventListener("loadend", async  e => {
    console.log("image successfully readed")
    let img = new Image();
    img.src = fileReader.result;
    await readImage(img);
    drawImage();

  });
  
})
 */

const downloadCanvas = ()=>{
  let link = document.createElement("a");
  link.download = `easy_grid_${imageBuffer.name}`;
  link.href = canvas.toDataURL();
  link.click();
}

const init = () => {
  Coloris.setInstance('.picker', {
    theme: 'polaroid',
    closeButton: true,
    el: '.picker'
  });
  
  var { 
    OverlayScrollbars, 
    ScrollbarsHidingPlugin, 
    SizeObserverPlugin, 
    ClickScrollPlugin  
  } = OverlayScrollbarsGlobal;
  // Simple initialization with an element
  const osInstance = OverlayScrollbars(document.querySelector('.general-options'), {
    overflow:{
      x : 'hidden'
    }
  });


  document.addEventListener("click", e => {
    if (e.target.closest(".option-tab")) {
      try {
        let id = e.target.dataset.tabId;
        console.log(e.target)
        document.querySelectorAll(".option-body").forEach((tabBody, idx) => {
          document.querySelector(`div[data-tab-id='${tabBody.dataset.bodyId}']`).classList.remove("active");
          if (tabBody.dataset.bodyId !== id) {
            tabBody.classList.add("hidden");
          }
          e.target.classList.add("active")
        })

        document.querySelector(`div[data-body-id='${id}']`).classList.remove("hidden");
      }
      catch (err) {
        console.error(err);
      }
    }
  })
}
document.addEventListener("DOMContentLoaded", init);



const numberRegex = /[0-9]/;
const validKeys = ["Backspace", "ArrowLeft", "ArrowRight"];

document.addEventListener("click", e => {
  if (e.target.matches(".counter-minus")) {
    let input = e.target.nextElementSibling;
    input.value = Number(input.value) > Number(input.min) ? `${Number(input.value) - 1}` : input.min;
    console.log(input.value)
    updateCanvas();
  }
  if (e.target.matches(".counter-plus")) {
    let input = e.target.previousElementSibling;
    input.value = Number(input.value) < Number(input.max) ? `${Number(input.value) + 1}` : input.max;
    console.log(input.value)
    updateCanvas();
  }
  if(e.target.matches("#download-btn")){
    downloadCanvas();
  }
  if(e.target.matches(".picker")){
    console.log("Heloooo")
      paletteContainer.querySelectorAll("input").forEach(input=>input.checked = false);
  }
  if(e.target.matches(".flipx-btn")){
    console.log("flip x")
    imageBuffer.isFlipX = imageBuffer.isFlipX ? false : true;
    drawImage(imageBuffer);
    // redrawGrid()
  }
  if(e.target.matches(".flipy-btn")){
    console.log("flip x")
    imageBuffer.isFlipY = imageBuffer.isFlipY ? false : true;
    drawImage(imageBuffer);
    // redrawGrid();
  }
  if(e.target.matches(".rotate-r-btn")){
    rotateRight();
  }
  if(e.target.matches(".rotate-l-btn")){
    rotateLeft();
  }

  if(e.target.matches(".adjust-btn")){
    e.target.parentElement.classList.toggle("open-option");
    Array.from(e.target.children).forEach(svg=>svg.classList.toggle("hidden"));
    e.target.nextElementSibling.classList.toggle("hidden");
  }
});

const updateCanvas = ()=>{
  //2. draw image
  drawImage();
  //3. draw grid
  redrawGrid();
};


const getFilters = ()=>{
  // console.log(imageBuffer.filters);
  let imageFilters = '';
  for(let filter in imageBuffer.filters){
    if(imageBuffer.filters[filter]){
      imageFilters += `${imageBuffer.filters[filter]} `;
    }
  }
  console.log(imageFilters);
  // context.filter = imageFilters;
  return imageFilters;
}

document.addEventListener("input",e=> {
  if(e.target.matches("#brightness-control")){
    let val = Number.parseInt(e.target.value)/100 ;
    console.log(val)

    imageBuffer.filters.brightness = `brightness(${val})`;
    updateCanvas();

  }

  if(e.target.matches("#contrast-control")){
    let val = Number.parseInt(e.target.value) / 100;
    imageBuffer.filters.contrast = `contrast(${val})`;
    updateCanvas();

  }

  if(e.target.matches("#saturation-control")){
    console.log("saturation:")
    let val = Number.parseInt(e.target.value) / 100;
    imageBuffer.filters.saturation = `saturate(${val})`;
    updateCanvas();
    
  }
  if(e.target.matches("#shadows-control")){
    let val = Number.parseInt(e.target.value) - 100;

  }
})

document.addEventListener("keydown", e => {
  if (!e.target.matches(".counter-input")) return;
  if (numberRegex.test(e.key) || validKeys.some(k => e.key === k)) {
    console.log(e.target.value)
  }
  else
    e.preventDefault()
})

document.addEventListener('coloris:pick', event => {
  redrawGrid();
});



paletteContainer.addEventListener("input",e=>{
  document.querySelector(".clr-field").style= `color: ${e.target.value};`;
  inputColor.value = e.target.value;
  // redrawGrid();
  redrawGrid();
})


// window.addEventListener("hashchange", e=> {
//   if(window.location.hash === "#home" || window.location.hash === ""){
//     appContainer.classList.add("hidden");
//     homeApp.classList.remove("hidden");
//   }
//   if(window.location.hash === "#app"){
//     appContainer.classList.remove("hidden");
//     homeApp.classList.add("hidden");
//   }
// })