const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;

class Drawing {
    radius = 1
    scale = canvas.height / 4
    centerX = canvas.width / 2
    centerY = canvas.height / 2
    colors = {
        sin: "#1a6ccb",
        sec: '#15c219',
        tan: "#da0a0a",
        circle: "#ff8000",
        radius: "#000",
        cartesianPlane: "#000"
    }
    thickness = {
        segments: 4,
        cartesianPlane: 1,
        circle: 3,
    }
    transparency = 0.5
    theta = 0
    get coTheta() {
        return Math.PI / 2 - this.theta
    }

    get sin() {
        return Math.sin(this.theta)
    }

    get $sin() {
        return this.sin * this.scale
    }

    get cos() {
        return Math.cos(this.theta)
    }

    get $cos() {
        return this.cos * this.scale
    }

    get sec() {
        return 1 / Math.cos(this.theta)
    }

    get $sec() {
        return this.sec * this.scale
    }

    get csc() {
        return 1 / Math.sin(this.theta)
    }

    get $csc() {
        return this.csc * this.scale
    }

    get tan() {
        return this.sin / this.cos
    }

    get $tan() {
        return this.tan * this.scale
    }

    get cot() {
        return this.cos / this.sin
    }

    get $cot() {
        return this.cot * this.scale
    }

    get $radius() {
        return this.radius * this.scale
    }

    constructor() {
        ctx.translate(this.centerX, this.centerY)
        this.update()
        const angleInput = document.getElementById("angle")
        angleInput.addEventListener("input", (e) => this.update(e.target.value))
    }

    drawCartesianPlane() {
        // x-axis
        this.drawSegment([-this.centerX, 0],[canvas.width, 0], this.colors.cartesianPlane)
        // y-axis
        this.drawSegment([0, -this.centerY],[0, canvas.height], this.colors.cartesianPlane)
    }

    drawCircle() {
        ctx.save()
        ctx.beginPath();
        ctx.lineWidth = this.thickness.circle
        ctx.strokeStyle = this.colors.circle;
        ctx.arc(0, 0, this.$radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore()
    }

    drawSegment(moveTo, lineTo, strokeStyle, lineWidth = 1, globalAlpha = 1) {
        ctx.save()
        ctx.beginPath();
        ctx.moveTo(...moveTo);
        ctx.lineTo(...lineTo);
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth
        ctx.globalAlpha = globalAlpha;
        ctx.stroke();
        ctx.restore()
    }
    drawSine() {
        this.drawSegment([this.$cos, 0],[this.$cos, -this.$sin],this.colors.sin, this.thickness.segments)
    }

    drawCosine() {
        this.drawSegment([0, -this.$sin],[this.$cos, -this.$sin],this.colors.sin, this.thickness.segments, this.transparency)
    }

    drawSecant() {
        this.drawSegment([0, 0],[this.$sec, 0],this.colors.sec, this.thickness.segments)
    }

    drawCosecant() {
        this.drawSegment([0, 0],[0, -this.$csc],this.colors.sec, this.thickness.segments, this.transparency)
    }

    drawTangent() {
        this.drawSegment([this.$cos, -this.$sin],[this.$sec, 0],this.colors.tan, this.thickness.segments)

        ctx.save()
        // Move the canvas origin (its top left corner) to the place where the text should be displayed
        ctx.translate((this.$cos + this.$sec) / 2, -this.$sin / 2)
        // .rotate() rotates the canvas around its origin
        ctx.rotate(this.coTheta);
        // Place the middle of the text above the origin
        ctx.textBaseline = "middle";
        ctx.textAlign = "center"
        ctx.font = "15px Arial";
        ctx.fillStyle = this.colors.tan;
        const text = "tangent"
        ctx.fillText(text, 0, -20);
        // To debug the translated and rotated canvas
        // ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.restore()
    }

    drawCotangent() {
        this.drawSegment([this.$cos, -this.$sin],[0, -this.$csc],this.colors.tan, this.thickness.segments, this.transparency)
    }

    drawRadius() {
        this.drawSegment([0, 0],[this.$cos, -this.$sin],this.colors.radius, this.thickness.segments)
    }

    update(angle) {
        this.theta = angle || 0
        ctx.clearRect(-this.centerX, -this.centerY, canvas.width, canvas.height);
        this.drawCartesianPlane()
        this.drawCircle()
        this.drawCosine()
        this.drawSine()
        this.drawSecant()
        this.drawCosecant()
        this.drawTangent()
        this.drawCotangent()
        this.drawRadius()
    }
}

new Drawing()
