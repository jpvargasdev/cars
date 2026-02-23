# Cars - Self-Driving Car AI Simulation

A neural network-based self-driving car simulation. Cars learn to navigate a straight road with traffic using AI.

## Features

- **Neural Network AI**: Cars are controlled by a neural network that learns to avoid obstacles
- **Traffic Simulation**: Randomly generated traffic cars to navigate around
- **Network Visualizer**: Real-time visualization of the neural network's decision making
- **Brain Persistence**: Save and load the best performing neural network

## How It Works

1. Multiple AI-controlled cars spawn on a multi-lane road
2. Each car has sensors to detect road borders and other vehicles
3. A neural network processes sensor data and controls steering
4. The best performing car (furthest distance) is highlighted
5. You can save the best "brain" and use it as a starting point for the next generation
6. Mutation is applied to create variation and improve over generations

## Usage

```bash
npm install
npm start
```

### Controls

- **Save**: Save the current best car's neural network to localStorage
- **Discard**: Clear the saved neural network and start fresh

## Configuration

In `src/index.ts`:
- `CARS`: Number of AI cars to simulate (default: 100)
- `FAKE_CARS`: Number of traffic cars (default: 100)
- `LANES`: Number of road lanes (default: 5)
