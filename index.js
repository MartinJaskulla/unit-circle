const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const angleInput = document.getElementById("angle")
angleInput.addEventListener("input", (e) => circle.update(e.target.value))

class Circle {
    angle = 0
    sin = 0
    cos = 1
    centerX = canvas.width / 2
    centerY = canvas.height / 2
    radius = canvas.height / 4
    lineWidth = 4
    strokeStyle = 'black'

    drawCircle() {
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
        ctx.lineWidth = this.lineWidth + 1
        ctx.arc(this.cos, this.sin, 1, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = this.lineWidth
    }

    drawRadius() {
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.cos, this.sin);
        ctx.stroke();
    }

    drawCosine() {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(26,108,203,0.5)';
        ctx.moveTo(this.centerX, this.sin);
        ctx.lineTo(this.cos, this.sin);
        ctx.stroke();
        ctx.strokeStyle = this.strokeStyle;
    }

    drawSine() {
        ctx.beginPath();
        ctx.strokeStyle = '#1a6ccb';
        ctx.moveTo(this.cos, this.centerY);
        ctx.lineTo(this.cos, this.sin);
        ctx.stroke();
        ctx.strokeStyle = this.strokeStyle;
    }

    styles() {
        ctx.strokeStyle = this.strokeStyle
        ctx.lineWidth = this.lineWidth
    }

    drawCartesianPlane() {
        ctx.beginPath();
        ctx.lineWidth = 1
        // x-axis
        ctx.moveTo(0, this.centerY);
        ctx.lineTo(canvas.width, this.centerY);
        // y-axis
        ctx.moveTo(this.centerX, 0);
        ctx.lineTo(this.centerX, canvas.height);
        ctx.stroke();
        ctx.lineWidth = this.lineWidth
    }
    update(angle) {
        this.angle = angle
        this.sin = this.centerY - Math.sin(this.angle) * this.radius
        this.cos = this.centerX + Math.cos(this.angle) * this.radius
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.styles()
        // this.drawPointOnCircle()
        this.drawCartesianPlane()
        this.drawRadius()
        this.drawCosine()
        this.drawSine()
        circle.drawCircle()
        ctx.stroke()
    }
}
const circle = new Circle()
circle.update(0)

