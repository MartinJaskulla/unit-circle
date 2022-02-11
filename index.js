const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.parentElement.offsetWidth;
canvas.height = canvas.parentElement.offsetHeight;

function mapInfinityX(value) {
    return Math.abs(value) === Infinity ? Math.sign(value) * canvas.width * 100 : value
}

function mapInfinityY(value) {
    return Math.abs(value) === Infinity ? Math.sign(value) * canvas.height * 100 : value
}

function twoDecimals(number) {
    return number.toString().slice(0, number < 0 ? 5 : 4)
}

// TODO Support negative angles (dragging clockwise). Need to know the previous angle. If we went from 0 to 359, then we have negative angle
// - https://www.desmos.com/calculator/n0m5r4rjha
//      - Bigger inner circle with angle value
// - Draw a visual point to the drag handle
// - Add arrowhead
// - Or instead of "θ" show a "k" which stands for completed full rotations
//

class Drawing {
    radius = 1
    dragArea = 10
    isDragging = false
    scale = canvas.height / 4
    angleCircleScale = 10
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

    constructor(angle) {
        // Place (0,0) at center of canvas
        ctx.translate(this.centerX, this.centerY)
        this.update(angle)
        // const angleInput = document.getElementById("angle")
        // angleInput.addEventListener("input", (e) => this.update(e.target.value))
        this.dragRadius()
        this.onDrag = this.onDrag.bind(this)
    }

    update(angle) {
        this.theta = angle
        ctx.clearRect(-this.centerX, -this.centerY, canvas.width, canvas.height);
        this.drawCartesianPlane()
        this.drawCircle()
        this.drawAngle()
        this.drawCosine()
        this.drawSine()
        this.drawSecant()
        this.drawCosecant()
        this.drawTangent()
        this.drawCotangent()
        this.drawRadius()
    }

    drawCartesianPlane() {
        // x-axis
        this.drawSegment([-this.centerX, 0], [canvas.width, 0], this.colors.cartesianPlane)
        // y-axis
        this.drawSegment([0, -this.centerY], [0, canvas.height], this.colors.cartesianPlane)
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

    drawAngle() {
        ctx.save()
        const largerThanFullCircle = Math.abs(this.theta) > Math.abs(2 * Math.PI)

        ctx.lineWidth = this.thickness.circle
        ctx.strokeStyle = this.colors.radius;

        if (largerThanFullCircle) {
            ctx.save()
            ctx.beginPath();
            ctx.globalAlpha = this.transparency / 2
            ctx.arc(0, 0, this.$radius / this.angleCircleScale, -2 * Math.PI, 0);
            ctx.stroke();
            ctx.restore()
        }

        ctx.beginPath();
        ctx.arc(0, 0, this.$radius / this.angleCircleScale, -this.theta % (2 * Math.PI), 0,);
        ctx.stroke();

        // Rotation: When the radius is at 0 degrees, we want 90 degree rotation. 0 -> 90, 90 -> 45, 180 -> 0, 270 -> -45, 360 -> -90. So we start at 90 degree rotation and subtract half the angle of the radius.
        this.drawSegmentText([Math.cos(this.theta / 2) * this.scale / this.angleCircleScale, -Math.sin(this.theta / 2) * this.scale / this.angleCircleScale], Math.PI / 2 - this.theta / 2, [0, -15], "θ", "black")
        ctx.restore()
    }

    drawSegment(moveTo, lineTo, color, width = 1, opacity = 1) {
        ctx.save()
        ctx.beginPath();
        ctx.moveTo(mapInfinityX(moveTo[0]), mapInfinityY(moveTo[1]));
        ctx.lineTo(mapInfinityX(lineTo[0]), mapInfinityY(lineTo[1]));
        ctx.strokeStyle = color;
        ctx.lineWidth = width
        ctx.globalAlpha = opacity;
        ctx.stroke();
        ctx.restore()
    }

    drawSegmentText(translate, rotate, textOffset, text, color) {
        if (translate.some(number => Math.abs(number) === Infinity)) return
        ctx.save()
        // Move the canvas origin (its top left corner) to the place where the text should be displayed
        ctx.translate(...translate)
        // .rotate() rotates the canvas around its origin
        ctx.rotate(rotate);
        // Place the middle of the text above the origin
        ctx.textBaseline = "middle";
        ctx.textAlign = "center"
        ctx.font = "15px Arial";
        ctx.fillStyle = color;
        ctx.fillText(text, ...textOffset);
        // To debug the translated and rotated canvas
        // ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.restore()
    }

    drawSine() {
        this.drawSegment([this.$cos, 0], [this.$cos, -this.$sin], this.colors.sin, this.thickness.segments)
        if (this.sin !== 0) this.drawSegmentText([this.$cos, -this.$sin / 2], this.cos >= 0 ? Math.PI / 2 : -Math.PI / 2, [0, -15], `sine (${twoDecimals(this.sin)})`, this.colors.sin)
    }

    drawCosine() {
        this.drawSegment([0, -this.$sin], [this.$cos, -this.$sin], this.colors.sin, this.thickness.segments, this.transparency)
        if (this.cos !== 0) this.drawSegmentText([this.$cos / 2, -this.$sin], 0, this.sin >= 0 ? [0, -15] : [0, 15], `cosine (${twoDecimals(this.cos)})`, this.colors.sin)
    }

    drawSecant() {
        this.drawSegment([0, 0], [this.$sec, 0], this.colors.sec, this.thickness.segments)
        if (this.sec !== 0) this.drawSegmentText([this.$sec / 2, 0], 0, this.sin >= 0 ? [0, 15] : [0, -15], `secant (${twoDecimals(this.sec)})`, this.colors.sec)
    }

    drawCosecant() {
        this.drawSegment([0, 0], [0, -this.$csc], this.colors.sec, this.thickness.segments, this.transparency)
        if (this.csc !== 0) this.drawSegmentText([0, -this.$csc / 2], this.cos >= 0 ? -Math.PI / 2 : Math.PI / 2, [0, -15], `cosecant (${twoDecimals(this.csc)})`, this.colors.sec)
    }

    drawTangent() {
        this.drawSegment([this.$cos, -this.$sin], [this.$sec, 0], this.colors.tan, this.thickness.segments)
        if (this.tan !== 0) this.drawSegmentText([(this.$cos + this.$sec) / 2, -this.$sin / 2], this.coTheta, [0, -30], `tangent (${twoDecimals(this.tan)})`, this.colors.tan)
    }

    drawCotangent() {
        this.drawSegment([this.$cos, -this.$sin], [0, -this.$csc], this.colors.tan, this.thickness.segments, this.transparency)
        if (this.cot !== 0) this.drawSegmentText([this.$cos / 2, (-this.$sin - this.$csc) / 2], this.coTheta, [0, -30], `cotangent (${twoDecimals(this.cot)})`, this.colors.tan)
    }

    drawRadius() {
        this.drawSegment([0, 0], [this.$cos, -this.$sin], this.colors.radius, this.thickness.segments)
    }

    isNearRadiusCircleIntersection(x, y) {
        const xRange = [this.centerX + this.$cos - this.dragArea, this.centerX + this.$cos + this.dragArea]
        const yRange = [this.centerY - this.$sin - this.dragArea, this.centerY - this.$sin + this.dragArea]
        return xRange[0] < x && x < xRange[1] && yRange[0] < y && y < yRange[1]
    }

    dragRadius() {
        document.addEventListener("mousemove", e => {
            if (this.isDragging) return
            if (this.isNearRadiusCircleIntersection(e.pageX, e.pageY)) {
                document.body.style.cursor = "grab"
            } else {
                document.body.style.cursor = "default"
            }
        })

        document.addEventListener("mousedown", e => {
            if (this.isNearRadiusCircleIntersection(e.pageX, e.pageY)) {
                this.isDragging = true
                document.body.style.cursor = "grabbing"
                document.addEventListener("mousemove", this.onDrag)
                document.addEventListener("mouseup", () => {
                    this.isDragging = false
                    document.body.style.cursor = "default"
                    document.removeEventListener("mousemove", this.onDrag)
                })
            }
        })
    }

    onDrag(e) {
        const adjacent = e.pageX - this.centerX
        const opposite = this.centerY - e.pageY
        // Q1 adjacent+ opposite+
        // Q2 adjacent- opposite+ -> Add 1 * Math.PI / 2
        // Q3 adjacent- opposite- -> Add 2 * Math.PI / 2
        // Q3 adjacent+ opposite- -> Add 3 * Math.PI / 2
        const q1 = adjacent > 0 && opposite > 0
        const q2 = adjacent < 0 && opposite > 0
        const q3 = adjacent < 0 && opposite < 0
        const q4 = adjacent > 0 && opposite < 0
        const angle = Math.abs(Math.atan(opposite / adjacent))
        if (q1) {
            this.update(angle)
        } else if (q2) {
            this.update(Math.PI / 2 + Math.PI / 2 - angle)
        } else if (q3) {
            this.update(2 * Math.PI / 2 + angle)
        } else if (q4) {
            this.update(3 * Math.PI / 2 + Math.PI / 2 - angle)
        }
    }
}

console.log(new Drawing(Math.PI / 3))
