class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	static fromAngle(theta) {
		return new Vector(Math.cos(theta), Math.sin(theta))
	}

	static dot(va, vb) {
		return va.x * vb.x + va.y * vb.y;
	}

	times(scalar) {
		return new Vector(this.x * scalar, this.y * scalar)
	}

	dividedBy(scalar) {
		return new Vector(this.x / scalar, this.y / scalar)
	}

	plus(otherVector) {
		return new Vector(this.x + otherVector.x, this.y + otherVector.y)
	}

	minus(otherVector) {
		return new Vector(this.x - otherVector.x, this.y - otherVector.y)
	}

	lengthSquared() {
		return Vector.dot(this, this);
	}

	length() {
		return Math.sqrt(this.lengthSquared());
	}
}

class Solid {
	distance(point) {}

	draw(ctx) {}
}

/*
  b-c
  | |
  a-d
*/
class Rectangle extends Solid {
	constructor(a, b, c) {
		super()

		this.a = a;
		this.b = b;
		this.c = c;
		this.d = a.plus(c.minus(b));

		this.center = b.minus(c).dividedBy(2).plus(c);
	}

	distance(point) {
		var a = this.a;
		var b = this.b;
		var c = this.c;
		var d = this.d;

		var sides = [
			[a, b],
			[b, c], 
			[c, d], 
			[d, a]
		];
		// distance to rectangle = Min(distance_to_side1, distance_to_side2, etc)
		return Math.min(...sides.map(line => {
			var v = line[0];
			var w = line[1];
			
			var l2 = v.minus(w).lengthSquared()

			if (l2 == 0)
				return point.minus(w).lengthSquared()

			var t = Math.max(0, Math.min(1, Vector.dot(point.minus(v), w.minus(v)) / l2))

			return point.minus(w.minus(v).times(t).plus(v)).length();
		}));
	}

	draw(ctx) {
		var a = this.a;
		var b = this.b;
		var c = this.c;
		var d = this.d;

		ctx.beginPath();
		ctx.moveTo(a.x, a.y);
		ctx.lineTo(b.x, b.y);
		ctx.lineTo(c.x, c.y);
		ctx.lineTo(d.x, d.y);
		ctx.lineTo(a.x, a.y);
		ctx.stroke();
	}
}

class Circle extends Solid {
	constructor(center, radius) {
		super();

		this.center = center;
		this.radius = radius;
	}

	distance(point) {
		return point.minus(this.center).length() - this.radius
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.center.x,this.center.y,this.radius,0,2*Math.PI);
		ctx.stroke();
	}
}


class Player {
	constructor(position, angle, fov) {
		this.position = position;
		this.angle = angle;
		this.fov = fov;
	}
}


class Raymarcher {
	constructor(ctx, scene, player) {
		this.ctx = ctx;
		this.scene = scene;

		// we scale up canvas by two
		this.width = ctx.canvas.width / 2;
		this.height = ctx.canvas.height / 2;

		this.player = player;
	}

	march(initialPosition, position, angle) {
		var distance = Math.min(...this.scene.map(object => object.distance(position)));

		// check distance is not negligible, and make sure we are within bounds.
		if (position.x < this.width && position.y < this.height && position.x >= 0 && position.y >= 0) {
			if (distance > 0.5) {
				var newPos = position.plus(Vector.fromAngle(angle).times(distance));
				this.march(initialPosition, newPos, angle);
			} else {
				position = position.plus(Vector.fromAngle(angle).times(distance))
				this.ctx.lineTo(position.x, position.y);
			}
		}
	}

	render() {
		var player = this.player, position = player.position;

		clearCanvas();
		this.ctx.strokeStyle = '#333';
		this.scene.map(object => object.draw(this.ctx));

		this.ctx.fillStyle = '#aaa';
		this.ctx.beginPath();
		this.ctx.moveTo(position.x, position.y);

		var max = player.angle + player.fov/2;

		for (var i = player.angle - player.fov/2; i < max; i += 0.001) {    
    	this.march(position, position, i)
		}

		this.ctx.fill();
	}
}