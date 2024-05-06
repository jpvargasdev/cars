import { Car } from "./car/car";
import { Road } from "./road";
import { Visualizer } from "./visualizer/visualizer";

const carCanvas = document.getElementById("car-canvas") as HTMLCanvasElement;
const networkCanvas = document.getElementById(
	"network-canvas",
) as HTMLCanvasElement;
if (!carCanvas && !networkCanvas) {
	throw new Error("Could not get canvas");
}
carCanvas.width = 200;
networkCanvas.width = 400;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

if (!carCtx && !networkCtx) {
	throw new Error("Could not get 2d context");
}

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");
const traffic = [new Car(road.getLaneCenter(1), -300, 30, 50, "DUMMY", 2)];

function animate() {
	if (!carCtx) {
		throw new Error("Could not get 2d context");
	}

	if (!networkCtx) {
		throw new Error("Could not get 2d context");
	}

	for (let i = 0; i < traffic.length; i++) {
		traffic[i].update(road.borders, []);
	}

	car.update(road.borders, traffic);

	carCanvas.height = window.innerHeight;
	networkCanvas.height = window.innerHeight;

	carCtx.save();
	carCtx.translate(0, -car.y + carCanvas.height * 0.7);

	road.draw(carCtx);
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].draw(carCtx, "red");
	}

	car.draw(carCtx);

	carCtx.restore();

	Visualizer.drawNetwork(networkCtx, car.brain!);
	requestAnimationFrame(animate);
}

animate();
