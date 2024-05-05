type Point = { x: number; y: number; offset?: number };
type Ray = { x: number; y: number }[];

type Borders = Point[][];
type Rays = [Point, Point][];
type Readings = (Point | null)[];
type Polygon = Point[];
type ControlType = "KEYS" | "DUMMY" | "AI";
