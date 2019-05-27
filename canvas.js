var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");

canvas.width = 4 * 9 * 32;
canvas.height = 3 * 9 * 32;

function clearCanvas() {
	context.fillStyle = "#000";
	context.fillRect(0, 0, canvas.width, canvas.height)
}

window.onresize = window.onorientationchange = window.onload = function() {
	var widthToHeight = 4 / 3;
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight * 95;
  var newWidthToHeight = newWidth / newHeight;
  
  if (newWidthToHeight > widthToHeight) {
    newWidth = newHeight * widthToHeight;
  } else {
    newHeight = newWidth / widthToHeight;
  }

  canvas.style.width = newWidth + 'px';
  canvas.style.height = newHeight + 'px';
  
  canvas.style.marginTop = (-newHeight / 2) + 'px';
  canvas.style.marginLeft = (-newWidth / 2) + 'px';
}

clearCanvas();

context.scale(2,2)