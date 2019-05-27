var player = new Player(new Vector(0, 0), Math.PI / 4, Math.PI / 3);

var scene = [
  new Circle(new Vector(0, 100), 20),
  new Circle(new Vector(50, 70), 30),
  new Circle(new Vector(30, 50), 20),
  new Rectangle(new Vector(100, 300), new Vector(300, 200), new Vector(100, 200))
]

var raymarcher = new Raymarcher(context, scene, player);

window.onkeydown = function (event) {
  var key = event.key;
  if (key == "ArrowUp" || key.toLowerCase() == "w") {
    raymarcher.player.position.x += 3 * Math.cos(raymarcher.player.angle);
    raymarcher.player.position.y += 3 * Math.sin(raymarcher.player.angle);
  }
  if (key == "ArrowDown" || key.toLowerCase() == "s") {
    raymarcher.player.position.x -= 3 * Math.cos(raymarcher.player.angle);
    raymarcher.player.position.y -= 3 * Math.sin(raymarcher.player.angle);
  }

  if (key.toLowerCase() == "a")
    raymarcher.player.angle -= 0.05;
  if (key.toLowerCase() == "d")
    raymarcher.player.angle += 0.05;


  raymarcher.render();
}