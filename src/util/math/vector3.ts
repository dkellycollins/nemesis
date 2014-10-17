class vector3 {
    public static zero(): vector3 {
        return new vector3(0, 0, 0);
    }

    constructor(
        public x: number,
        public y: number,
        public z: number)
    {}

    public add(b:vector3): vector3 {
        return new vector3(
            this.x + b.x,
            this.y + b.y,
            this.z + b.z);
    }
}
export = vector3;
