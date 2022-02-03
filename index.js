const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const angleInput = document.getElementById("angle")
angleInput.addEventListener("input", (e) => circle.update(e.target.value))

class Drawing {
    angle = 0
    radius = 1
    scale = canvas.height / 4
    centerX = canvas.width / 2
    centerY = canvas.height / 2
    lineWidth = 4
    strokeStyle = 'black'

    get sin() {
        return Math.sin(this.angle)
    }

    get cos() {
        return Math.cos(this.angle)
    }

    get sec() {
        return 1 / Math.cos(this.angle)
    }

    get $sin() {
        return this.sin * this.scale
    }

    get $cos() {
        return this.cos * this.scale
    }

    get $sec() {
        return this.sec * this.scale
    }

    get $radius() {
        return this.radius * this.scale
    }

    drawCircle() {
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.$radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawRadius() {
        ctx.beginPath();
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.centerX + this.$cos, this.centerY - this.$sin);
        ctx.stroke();
    }

    drawCosine() {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(26,108,203,0.5)';
        ctx.moveTo(this.centerX, this.centerY - this.$sin);
        ctx.lineTo(this.centerX + this.$cos, this.centerY - this.$sin);
        ctx.stroke();
        ctx.strokeStyle = this.strokeStyle;
    }

    drawSine() {
        ctx.beginPath();
        ctx.strokeStyle = '#1a6ccb';
        ctx.moveTo(this.centerX + this.$cos, this.centerY);
        ctx.lineTo(this.centerX + this.$cos, this.centerY - this.$sin);
        ctx.stroke();
        ctx.strokeStyle = this.strokeStyle;
    }

    drawSecant() {
        ctx.beginPath();
        ctx.strokeStyle = '#15c219';
        ctx.moveTo(this.centerX, this.centerY);
        ctx.lineTo(this.centerX + this.$sec, this.centerY);
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
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.styles()
        // this.drawPointOnCircle()
        this.drawCartesianPlane()
        this.drawCosine()
        this.drawSine()
        this.drawSecant()
        this.drawRadius()
        circle.drawCircle()
        ctx.stroke()
    }
}

const circle = new Drawing()
circle.update(0)

