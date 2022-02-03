const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const angleInput = document.getElementById("angle")
angleInput.addEventListener("input", (e) => {
    circle.update(() => circle.drawPointOnCircle(e.target.value))
})

class Circle {
    centerX = canvas.width / 2
    centerY = canvas.height / 2
    radius = canvas.height / 4

    setDefaults() {
        ctx.lineWidth = 1
    }

    drawCircle() {
        ctx.strokeStyle = 'black';
        // Circle
        ctx.beginPath();
        ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        // Center
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 1, 0, 2 * Math.PI);
        ctx.stroke();
    }

    drawPointOnCircle(angle) {
        ctx.beginPath();
        ctx.lineWidth = 2
        const x = canvas.width / 2 + Math.cos(angle / 100) * this.radius
        const y = canvas.height / 2 - Math.sin(angle / 100) * this.radius
        ctx.arc(x, y, 1, 0, 2 * Math.PI);
        ctx.stroke();
    }

    update(...callbacks) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        callbacks.forEach(c => {
            this.setDefaults()
            c()
        })
        this.setDefaults()
        circle.drawCircle()
        ctx.stroke()
    }
}

const circle = new Circle()
circle.update(() => circle.drawPointOnCircle(0))

