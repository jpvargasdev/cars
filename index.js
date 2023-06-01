
const canvas = document.getElementById("carCanvas");
canvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;


const ctx = canvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(canvas.width/2, canvas.width*0.9);

const N = 1;
const cars = generateCars(N);
let bestCar=cars[0];

if (localStorage.getItem("bestBrain")) {
  for (let i=0; i<cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));

    if (i!==0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1);
    }
  }
}
//const car = new Car(road.getLineCenter(1), 100, 30, 50, "AI", 3, "blue");

const traffic = [
  new Car(road.getLineCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(0), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(1), -500, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(2), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(0), -700, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(1), -900, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(1), -1100, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(2), -1200, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(0), -1300, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(1), -1400, 30, 50, "DUMMY", 2),
  new Car(road.getLineCenter(2), -1500, 30, 50, "DUMMY", 2),


];

//car.draw(ctx);

animate();


function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(N) {
  const cars = [];
  for (let i=1; i <= N; i++) {
    cars.push(
      new Car(road.getLineCenter(1), 100, 30, 50, "AI")
    );
  }
  return cars;
}

function animate(time) {
  for (let i=0; i<traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  for (let i=0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  bestCar = cars.find(c => c.y === Math.min(...cars.map(c => c.y)));

  //car.update(road.borders, traffic);

  canvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -bestCar.y + canvas.height * 0.7);

  road.draw(ctx);
  for(let i=0; i<traffic.length; i++) {
    traffic[i].draw(ctx, "red");
  }

  ctx.globalAlpha = 0.2;
  for (let i=0; i < cars.length; i++) {
    cars[i].draw(ctx, "black")
  }
  ctx.globalAlpha = 1;
  bestCar.draw(ctx, "blue",true);

  ctx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}
