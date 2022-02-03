const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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

    get $radius() {
        return this.radius * this.scale
    }

    constructor() {
        this.update()
        const angleInput = document.getElementById("angle")
        angleInput.addEventListener("input", (e) => this.update(e.target.value))
    }

    drawCartesianPlane() {
        ctx.beginPath();
        ctx.lineWidth = this.thickness.cartesianPlane
        // x-axis
        ctx.moveTo(0, this.centerY);
        ctx.lineTo(canvas.width, this.centerY);
        // y-axis
        ctx.moveTo(this.centerX, 0);
        ctx.lineTo(this.centerX, canvas.height);
        ctx.stroke();
        ctx.lineWidth = this.thickness.default
    }

    drawCircle() {
        ctx.beginPath();
        ctx.lineWidth = this.thickness.circle
        ctx.strokeStyle = this.colors.circle;
        ctx.arc(this.centerX, this.centerY, this.$radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.lineWidth = this.thickness.default
    }

    drawSine() {
        ctx.beginPath();
        ctx.strokeStyle = this.colors.sin;
        ctx.moveTo(this.centerX + this.$cos, this.centerY);
        ctx.lineTo(this.centerX + this.$cos, this.centerY - this.$sin);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;
    }
    drawCosine() {
        ctx.beginPath();
        ctx.globalAlpha = this.transparency;
        ctx.strokeStyle = this.colors.sin;
        ctx.moveTo(this.centerX, this.centerY - this.$sin);
        ctx.lineTo(this.centerX + this.$cos, this.centerY - this.$sin);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;
        ctx.globalAlpha = 1;
    }

    drawSecant() {
        ctx.beginPath();
        ctx.globalAlpha = this.transparency;
        ctx.strokeStyle = this.colors.sec;
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.centerX + this.$sec, this.centerY);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;
    }
    drawCosecant() {
        ctx.beginPath();
        ctx.strokeStyle = this.colors.sec;
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.centerX, this.centerY - this.$csc);
        ctx.stroke();
        ctx.strokeStyle = this.colors.default;
        ctx.globalAlpha = 1;
    }

    drawRadius() {
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.centerX + this.$cos, this.centerY - this.$sin);
        ctx.stroke();
    }

    update(angle) {
        this.angle = angle || 0
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawCartesianPlane()
        this.drawCircle()
        this.drawCosine()
        this.drawSine()
        this.drawSecant()
        this.drawCosecant()
        this.drawRadius()
        ctx.stroke()
    }
}

new Drawing()
