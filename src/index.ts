import { Car } from "./car/car";
import { Road } from "./road";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
	throw new Error("Could not get canvas");
}
canvas.width = 200;

const ctx = canvas.getContext("2d");
if (!ctx) {
	throw new Error("Could not get 2d context");
}

const road = new Road(canvas.width / 2, canvas.width * 0.9, 3);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [new Car(road.getLaneCenter(1), -300, 30, 50, "DUMMY", 2)];

function animate() {
	if (!ctx) {
		throw new Error("Could not get 2d context");
	}

	for (let i = 0; i < traffic.length; i++) {
		traffic[i].update(road.borders, []);
	}

	car.update(road.borders, traffic);
	canvas.height = window.innerHeight;

	ctx.save();
	ctx.translate(0, -car.y + canvas.height * 0.7);

	road.draw(ctx);
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].draw(ctx, "red");
	}

	car.draw(ctx);

	ctx.restore();
	requestAnimationFrame(animate);
}

animate();
