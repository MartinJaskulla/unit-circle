const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const angleInput = document.getElementById("angle")
angleInput.addEventListener("input", (e) => circle.update(e.target.value))

class CartesianPlane {
    centerX = canvas.width / 2
    centerY = canvas.height / 2
    constructor() {
        this.draw()
    }
    draw() {
        ctx.beginPath();
        // x-axis
        ctx.moveTo(0, this.centerY);
        ctx.lineTo(canvas.width, this.centerY);
        // y-axis
        ctx.moveTo(this.centerX, 0);
        ctx.lineTo(this.centerX, canvas.height);
        ctx.stroke();
    }
}

class Circle {
    angle = 0
    sin = 0
    cos = 1
    centerX = canvas.width / 2
    centerY = canvas.height / 2
    radius = canvas.height / 4

    drawCircle() {
        ctx.strokeStyle = 'black';
        // Circle
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        // Center
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, 1, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawPointOnCircle() {
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.arc(this.cos, this.sin, 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = 1
    }

    drawRadius() {
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.cos, this.sin);
        ctx.stroke();
    }

    drawAdjacentSide() {
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.cos, this.centerY);
        ctx.stroke();
    }

    drawHypotenuse() {
        ctx.beginPath();
        ctx.moveTo(this.cos, this.centerY);
        ctx.lineTo(this.cos, this.sin);
        ctx.stroke();
    }

    update(angle) {
        this.angle = angle
        this.sin = this.centerY - Math.sin(this.angle) * this.radius
        this.cos = this.centerX + Math.cos(this.angle) * this.radius
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        new CartesianPlane()
        this.drawPointOnCircle()
        this.drawRadius()
        this.drawAdjacentSide()
        this.drawHypotenuse()
        circle.drawCircle()
        ctx.stroke()
    }
}
const circle = new Circle()
circle.update(0)

