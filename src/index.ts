import { Car } from "./car/car";
import { NeuralNetwork } from "./network/network";
import { Road } from "./road";
import { getRandomColor } from "./utils";
import { Visualizer } from "./visualizer/visualizer";

const saveCarButton = document.getElementById("save") as HTMLButtonElement;
const discardCarButton = document.getElementById(
	"discard",
) as HTMLButtonElement;
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
const CARS = 100;
const FAKE_CARS = 100;
const LANES = 5;

function save() {
	localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
	localStorage.removeItem("bestBrain");
}

saveCarButton.addEventListener("click", save);
discardCarButton.addEventListener("click", discard);

if (!carCtx && !networkCtx) {
	throw new Error("Could not get 2d context");
}

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, LANES);
const traffic = generateRandomCars(FAKE_CARS, LANES);

// const traffic = [
// 	new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
// 	new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
// 	new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
// 	new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
// 	new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
// 	new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
// 	new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2)

// ];

function generateRandomCars(N: number, M: number) {
	const traffic = [];
	for (let i = 0; i < N; i++) {
		const laneNumber = Math.floor(Math.random() * M);
		const car = new Car(
			// @ts-ignore
			road.getLaneCenter(laneNumber),
			-150 * (i + 1), // You might need to adjust the y-coordinate based on your requirements
			30, // Width
			50, // Height
			"DUMMY", // Type
			2, // Speed
			getRandomColor(),
		);
		traffic.push(car);
	}

	return traffic;
}

function generateCars(N: number) {
	const cars = [];
	for (let i = 1; i <= N; i++) {
		cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
	}
	return cars;
}

const cars = generateCars(CARS);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
	for (let i = 0; i < cars.length; i++) {
		cars[i].brain = JSON.parse(localStorage.getItem("bestBrain") as string);
		if (i !== 0) {
			NeuralNetwork.mutate(cars[i].brain!, 0.1);
		}
	}
}

function animate(time: number) {
	if (!carCtx) {
		throw new Error("Could not get 2d context");
	}

	if (!networkCtx) {
		throw new Error("Could not get 2d context");
	}

	for (let i = 0; i < traffic.length; i++) {
		traffic[i].update(road.borders, []);
	}

	for (let i = 0; i < cars.length; i++) {
		cars[i].update(road.borders, traffic);
	}

	bestCar =
		cars.find((car) => car.y === Math.min(...cars.map((car) => car.y))) ||
		cars[0];

	carCanvas.height = window.innerHeight;
	networkCanvas.height = window.innerHeight;

	carCtx.save();
	if (bestCar) {
		carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);
	}

	road.draw(carCtx);
	for (let i = 0; i < traffic.length; i++) {
		traffic[i].draw(carCtx);
	}

	carCtx.globalAlpha = 0.2;
	for (let i = 0; i < cars.length; i++) {
		cars[i].draw(carCtx);
	}
	carCtx.globalAlpha = 1;
	if (bestCar) {
		bestCar.draw(carCtx, true);
	}

	carCtx.restore();

	networkCtx.lineDashOffset = -time / 50;
	if (bestCar) {
		Visualizer.drawNetwork(networkCtx, bestCar.brain!);
	}
	requestAnimationFrame(animate);
}

animate(10);
