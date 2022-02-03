const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;

class Drawing {
    angle = 0
    radius = 1
    scale = canvas.height / 4
    centerX = canvas.width / 2
    centerY = canvas.height / 2
    colors = {
        default: "#000000",
        sin: "#1a6ccb",
        sec: '#15c219',
        tan: "#da0a0a",
        circle: "#ff8000",
    }
    thickness = {
        default: 4,
        cartesianPlane: 1,
        circle: 3,
    }
    transparency = 0.5

    get sin() {
        return Math.sin(this.angle)
    }

    get $sin() {
        return this.sin * this.scale
    }

    get cos() {
        return Math.cos(this.angle)
    }

    get $cos() {
        return this.cos * this.scale
    }

    get sec() {
        return 1 / Math.cos(this.angle)
    }

    get $sec() {
        return this.sec * this.scale
    }

    get csc() {
        return 1 / Math.sin(this.angle)
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
        ctx.beginPath();
        ctx.lineWidth = this.thickness.cartesianPlane
        // x-axis
        ctx.moveTo(-this.centerX, 0);
        ctx.lineTo(canvas.width, 0);
        // y-axis
        ctx.moveTo(0, -this.centerY);
        ctx.lineTo(0, canvas.height);
        ctx.stroke();
        ctx.lineWidth = this.thickness.default
    }

    drawCircle() {
        ctx.beginPath();
        ctx.lineWidth = this.thickness.circle
        ctx.strokeStyle = this.colors.circle;
        ctx.arc(0, 0, this.$radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = this.thickness.default
    }

    drawSine() {
        ctx.beginPath();
        ctx.strokeStyle = this.colors.sin;
        ctx.moveTo(this.$cos, 0);
        ctx.lineTo(this.$cos, -this.$sin);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;
    }

    drawCosine() {
        ctx.beginPath();
        ctx.globalAlpha = this.transparency;
        ctx.strokeStyle = this.colors.sin;
        ctx.moveTo(0, -this.$sin);
        ctx.lineTo(this.$cos, -this.$sin);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;
        ctx.globalAlpha = 1;
    }

    drawSecant() {
        ctx.beginPath();
        ctx.strokeStyle = this.colors.sec;
        ctx.moveTo(0, 0);
        ctx.lineTo(this.$sec, 0);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;
    }

    drawCosecant() {
        ctx.beginPath();
        ctx.globalAlpha = this.transparency;
        ctx.strokeStyle = this.colors.sec;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.$csc);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;
        ctx.globalAlpha = 1;
    }

    drawTangent() {
        ctx.beginPath();
        ctx.strokeStyle = this.colors.tan;
        ctx.moveTo(this.$cos, -this.$sin);
        ctx.lineTo(this.$sec, 0);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;

        const degrees = 30
        // TODO use save and restore for colors etc and delete default values
        ctx.save()
        // ctx.rotate(degrees * Math.PI / 180);
        // ctx.translate(0,0)
        // ctx.fillRect((this.$cos + this.$sec) / 2, -this.$sin / 2, canvas.width, canvas.height)
        ctx.textBaseline = "middle";
        ctx.textAlign = "center"
        const text = "tangent"
        ctx.measureText(text)
        ctx.fillText(text, (this.$cos + this.$sec) / 2, -this.$sin / 2);
        ctx.restore()
    }

    drawCotangent() {
        ctx.beginPath();
        ctx.globalAlpha = this.transparency;
        ctx.strokeStyle = this.colors.tan;
        ctx.moveTo(this.$cos, -this.$sin);
        ctx.lineTo(0, -this.$csc);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;
        ctx.globalAlpha = 1;
    }

    drawRadius() {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.$cos, -this.$sin);
        ctx.stroke();
    }

    update(angle) {
        this.angle = angle || 0
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
        ctx.stroke()
    }
}

new Drawing()
