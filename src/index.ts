import { Car } from "./car/car";
import { NeuralNetwork } from "./network/network";
import { Road } from "./road";
import { getRandomColor } from "./utils";
import { Visualizer } from "./visualizer/visualizer";

// Settings interface
interface Settings {
	cars: number;
	traffic: number;
	lanes: number;
	maxSpeed: number;
	trafficSpeed: number;
	mutationRate: number;
	hiddenNeurons: number;
	rayCount: number;
	rayLength: number;
}

// Default settings
const defaultSettings: Settings = {
	cars: 100,
	traffic: 100,
	lanes: 5,
	maxSpeed: 3,
	trafficSpeed: 2,
	mutationRate: 0.1,
	hiddenNeurons: 6,
	rayCount: 5,
	rayLength: 150,
};

// Load settings from localStorage or use defaults
function loadSettings(): Settings {
	const saved = localStorage.getItem("carSettings");
	if (saved) {
		return { ...defaultSettings, ...JSON.parse(saved) };
	}
	return { ...defaultSettings };
}

// Save settings to localStorage
function saveSettings(settings: Settings): void {
	localStorage.setItem("carSettings", JSON.stringify(settings));
}

// Get settings from UI inputs
function getSettingsFromUI(): Settings {
	return {
		cars: Number((document.getElementById("setting-cars") as HTMLInputElement).value),
		traffic: Number((document.getElementById("setting-traffic") as HTMLInputElement).value),
		lanes: Number((document.getElementById("setting-lanes") as HTMLInputElement).value),
		maxSpeed: Number((document.getElementById("setting-max-speed") as HTMLInputElement).value),
		trafficSpeed: Number((document.getElementById("setting-traffic-speed") as HTMLInputElement).value),
		mutationRate: Number((document.getElementById("setting-mutation") as HTMLInputElement).value),
		hiddenNeurons: Number((document.getElementById("setting-hidden-neurons") as HTMLInputElement).value),
		rayCount: Number((document.getElementById("setting-ray-count") as HTMLInputElement).value),
		rayLength: Number((document.getElementById("setting-ray-length") as HTMLInputElement).value),
	};
}

// Apply settings to UI inputs
function applySettingsToUI(settings: Settings): void {
	(document.getElementById("setting-cars") as HTMLInputElement).value = String(settings.cars);
	(document.getElementById("setting-traffic") as HTMLInputElement).value = String(settings.traffic);
	(document.getElementById("setting-lanes") as HTMLInputElement).value = String(settings.lanes);
	(document.getElementById("setting-max-speed") as HTMLInputElement).value = String(settings.maxSpeed);
	(document.getElementById("setting-traffic-speed") as HTMLInputElement).value = String(settings.trafficSpeed);
	(document.getElementById("setting-mutation") as HTMLInputElement).value = String(settings.mutationRate);
	(document.getElementById("setting-hidden-neurons") as HTMLInputElement).value = String(settings.hiddenNeurons);
	(document.getElementById("setting-ray-count") as HTMLInputElement).value = String(settings.rayCount);
	(document.getElementById("setting-ray-length") as HTMLInputElement).value = String(settings.rayLength);
}

// Load current settings
let settings = loadSettings();

// DOM Elements
const saveCarButton = document.getElementById("save") as HTMLButtonElement;
const discardCarButton = document.getElementById("discard") as HTMLButtonElement;
const carCanvas = document.getElementById("car-canvas") as HTMLCanvasElement;
const networkCanvas = document.getElementById("network-canvas") as HTMLCanvasElement;
const settingsPanel = document.getElementById("settings-panel") as HTMLDivElement;
const toggleSettingsBtn = document.getElementById("toggle-settings") as HTMLButtonElement;
const applySettingsBtn = document.getElementById("apply-settings") as HTMLButtonElement;
const resetSettingsBtn = document.getElementById("reset-settings") as HTMLButtonElement;

if (!carCanvas || !networkCanvas) {
	throw new Error("Could not get canvas");
}

carCanvas.width = 200;
networkCanvas.width = 400;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

if (!carCtx || !networkCtx) {
	throw new Error("Could not get 2d context");
}

// Settings panel toggle
toggleSettingsBtn.addEventListener("click", () => {
	settingsPanel.classList.toggle("open");
});

// Apply settings button
applySettingsBtn.addEventListener("click", () => {
	settings = getSettingsFromUI();
	saveSettings(settings);
	location.reload();
});

// Reset settings button
resetSettingsBtn.addEventListener("click", () => {
	applySettingsToUI(defaultSettings);
});

// Initialize UI with current settings
applySettingsToUI(settings);

// Save/Discard brain buttons
function save() {
	localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
	localStorage.removeItem("bestBrain");
}

saveCarButton.addEventListener("click", save);
discardCarButton.addEventListener("click", discard);

// Initialize simulation with settings
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, settings.lanes);
const traffic = generateRandomCars(settings.traffic, settings.lanes);

function generateRandomCars(N: number, M: number) {
	const trafficCars = [];
	for (let i = 0; i < N; i++) {
		const laneNumber = Math.floor(Math.random() * M);
		const car = new Car(
			road.getLaneCenter(laneNumber),
			-150 * (i + 1),
			30,
			50,
			"DUMMY",
			settings.trafficSpeed,
			getRandomColor(),
		);
		trafficCars.push(car);
	}
	return trafficCars;
}

function generateCars(N: number) {
	const cars = [];
	for (let i = 1; i <= N; i++) {
		const car = new Car(
			road.getLaneCenter(1),
			100,
			30,
			50,
			"AI",
			settings.maxSpeed,
			"blue",
			settings.rayCount,
			settings.rayLength,
			settings.hiddenNeurons,
		);
		cars.push(car);
	}
	return cars;
}

const cars = generateCars(settings.cars);
let bestCar = cars[0];

if (localStorage.getItem("bestBrain")) {
	for (let i = 0; i < cars.length; i++) {
		cars[i].brain = JSON.parse(localStorage.getItem("bestBrain") as string);
		if (i !== 0) {
			NeuralNetwork.mutate(cars[i].brain!, settings.mutationRate);
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
