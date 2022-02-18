/*
TODO
 - Fix: If the angle is 0, radius and sizeDrag are selected at the same time
 - Consider device width in scale of circle and add mobile touch events
*/
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing

const angleInput = document.querySelector("form#angleForm input")
document.forms.angleForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const newAngle = Number(eval(angleInput.value))
    const isValidNumber = typeof newAngle === "number" && !isNaN(newAngle)
    if (isValidNumber) {
        drawing.update(newAngle)
    } else {
        // Error message
    }
})

class Drawing {
    scale
    centerX
    centerY
    radius = 1
    angleRadius = 0.15
    pointRadius = 2
    dragArea = 10
    isDragging = false
    colors = {
        sin: "#1a6ccb",
        sec: '#15c219',
        tan: "#da0a0a",
        circle: "#ff8000",
        radius: "#000",
        cartesianPlane: "#000",
    }
    thickness = {
        segments: 3,
        cartesianPlane: 1,
        circle: 3,
    }
    coSegmentTransparency = 0.5
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
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
        this.centerX = canvas.width / 2
        this.centerY = canvas.height / 2
        this.scale = canvas.height / 3.5

        this.onRadiusDrag = this.onRadiusDrag.bind(this)
        this.onCentreDrag = this.onCentreDrag.bind(this)
        this.onSizeDrag = this.onSizeDrag.bind(this)
        this.addDragToPoints = this.addDragToPoints.bind(this)

        // Place (0,0) at center of canvas
        ctx.translate(this.centerX, this.centerY)
        this.update(angle)
        this.addDragToPoints()
    }

    // Maybe put in requestAnimationFrame
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
        this.drawRadius(this.$cos, -this.$sin)
        this.drawRadius(this.$radius, 0)
        this.drawAnglePoints()
        angleInput.value = this.theta
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
        ctx.beginPath();
        ctx.lineWidth = this.thickness.circle
        ctx.strokeStyle = this.colors.radius;
        ctx.arc(0, 0, this.angleRadius * this.scale, -this.theta % (2 * Math.PI), 0,);
        ctx.stroke();
        // Rotation: When the radius is at 0 degrees, we want 90 degree rotation. 0 -> 90, 90 -> 45, 180 -> 0, 270 -> -45, 360 -> -90. So we start at 90 degree rotation and subtract half the angle of the radius.
        this.drawSegmentText([Math.cos(this.theta / 2) * this.scale * this.angleRadius, -Math.sin(this.theta / 2) * this.scale * this.angleRadius], Math.PI / 2 - this.theta / 2, [0, -15], twoDecimals(this.theta), "black")
        this.drawSegmentText([Math.cos(this.theta / 2) * this.scale * this.angleRadius, -Math.sin(this.theta / 2) * this.scale * this.angleRadius], Math.PI / 2 - this.theta / 2, [0, 15], "θ", "black")
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
        this.drawSegment([0, -this.$sin], [this.$cos, -this.$sin], this.colors.sin, this.thickness.segments, this.coSegmentTransparency)
        if (this.cos !== 0) this.drawSegmentText([this.$cos / 2, -this.$sin], 0, this.sin >= 0 ? [0, -15] : [0, 15], `cosine (${twoDecimals(this.cos)})`, this.colors.sin)
    }

    drawSecant() {
        this.drawSegment([0, 0], [this.$sec, 0], this.colors.sec, this.thickness.segments)
        if (this.sec !== 0) this.drawSegmentText([this.$sec / 2, 0], 0, this.sin >= 0 ? [0, 15] : [0, -15], `secant (${twoDecimals(this.sec)})`, this.colors.sec)
    }

    drawCosecant() {
        this.drawSegment([0, 0], [0, -this.$csc], this.colors.sec, this.thickness.segments, this.coSegmentTransparency)
        if (this.csc !== 0) this.drawSegmentText([0, -this.$csc / 2], this.cos >= 0 ? -Math.PI / 2 : Math.PI / 2, [0, -15], `cosecant (${twoDecimals(this.csc)})`, this.colors.sec)
    }

    drawTangent() {
        this.drawSegment([this.$cos, -this.$sin], [this.$sec, 0], this.colors.tan, this.thickness.segments)
        if (this.tan !== 0) this.drawSegmentText([(this.$cos + this.$sec) / 2, -this.$sin / 2], this.coTheta, [0, -30], `tangent (${twoDecimals(this.tan)})`, this.colors.tan)
    }

    drawCotangent() {
        this.drawSegment([this.$cos, -this.$sin], [0, -this.$csc], this.colors.tan, this.thickness.segments, this.coSegmentTransparency)
        if (this.cot !== 0) this.drawSegmentText([this.$cos / 2, (-this.$sin - this.$csc) / 2], this.coTheta, [0, -30], `cotangent (${twoDecimals(this.cot)})`, this.colors.tan)
    }

    drawRadius(x, y) {
        this.drawSegment([0, 0], [x, y], this.colors.radius, this.thickness.segments)
    }

    isNear(pointA, pointB) {
        const xRange = [this.centerX + pointA[0] - this.dragArea, this.centerX + pointA[0] + this.dragArea]
        const yRange = [this.centerY - pointA[1] - this.dragArea, this.centerY - pointA[1] + this.dragArea]
        return xRange[0] < pointB[0] && pointB[0] < xRange[1] && yRange[0] < pointB[1] && pointB[1] < yRange[1]
    }

    addDragToPoints() {
        const radiusDrag = [() => [this.$cos, this.$sin], "grab", "grabbing", this.onRadiusDrag]
        const centreDrag = [() => [0, 0], "move", "move", this.onCentreDrag]
        const sizeDrag = [() => [this.$radius, 0], "ns-resize", "ns-resize", this.onSizeDrag]

        const points = [radiusDrag, centreDrag, sizeDrag]

        points.forEach(([getPoint, cursorStyleHover, cursorStyleDragging, callback]) => {
            document.addEventListener("mousemove", e => {
                if (this.isDragging) return
                if (this.isNear(getPoint(), [e.pageX, e.pageY])) {
                    document.body.style.cursor = cursorStyleHover
                } else {
                    const isNearAnyPoint = points.reduce((isNear, point) => this.isNear(point[0](), [e.pageX, e.pageY]) || isNear, false)
                    if (!isNearAnyPoint) {
                        document.body.style.cursor = "default"
                    }
                }
            })

            const listener = (e, draggingEvent, doneDraggingEvent) => {
                if (this.isNear(getPoint(), [e.pageX, e.pageY])) {
                    this.isDragging = true
                    document.body.style.cursor = cursorStyleDragging
                    document.addEventListener(draggingEvent, callback)
                    document.addEventListener(doneDraggingEvent, () => {
                        this.isDragging = false
                        document.body.style.cursor = "default"
                        document.removeEventListener(draggingEvent, callback)
                    })
                }
            }
            document.addEventListener("mousedown", e => listener(e, "mousemove", "mouseup"))
            document.addEventListener("touchstart", e => listener(e, "touchmove", "touchend"))
        })
    }

    onRadiusDrag(e) {
        const adjacent = e.pageX - this.centerX
        const opposite = this.centerY - e.pageY

        const angle = Math.abs(Math.atan(opposite / adjacent))

        // Q1 adjacent+ opposite+
        // Q2 adjacent- opposite+ -> Add 1 * Math.PI / 2
        // Q3 adjacent- opposite- -> Add 2 * Math.PI / 2
        // Q3 adjacent+ opposite- -> Add 3 * Math.PI / 2
        const q1 = adjacent > 0 && opposite > 0
        const q2 = adjacent < 0 && opposite > 0
        const q3 = adjacent < 0 && opposite < 0
        const q4 = adjacent > 0 && opposite < 0
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

    onCentreDrag(e) {
        ctx.translate(e.pageX - this.centerX, e.pageY - this.centerY)
        this.centerX = e.pageX
        this.centerY = e.pageY
        this.update(this.theta)
    }

    onSizeDrag(e) {
        e.movementY < 1 ? this.scale += 3 : this.scale -= 3
        this.update(this.theta)
    }

    addPoint(x, y) {
        ctx.save()
        ctx.beginPath();
        ctx.lineWidth = this.thickness.circle
        ctx.strokeStyle = this.colors.radius;
        ctx.fillStyle = this.colors.radius;
        ctx.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
        ctx.stroke()
        ctx.fill();
        ctx.restore()

        ctx.save()
        ctx.beginPath();
        ctx.lineWidth = this.thickness.circle
        ctx.fillStyle = this.colors.radius;
        ctx.globalAlpha = 0.2
        ctx.arc(x, y, this.pointRadius * 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore()
    }

    drawAnglePoints() {
        // Drag handle
        this.addPoint(this.$cos, -this.$sin)
        // Centre
        this.addPoint(0, 0)
        // Third
        this.addPoint(this.$radius, 0)
    }
}

drawing = new Drawing(0)
window.addEventListener('resize', (event) => drawing = new Drawing(drawing.theta));

const overshoot = Math.PI / 3
const settle = Math.PI / 4

function grow() {
    if (drawing.theta > overshoot) {
        requestAnimationFrame(shrink)
        return
    }
    drawing.update(drawing.theta + 0.025)
    requestAnimationFrame(grow);
}

function shrink() {
    if (drawing.theta < settle) {
        drawing.update(settle)
        angleInput.value = "Math.PI / 4"
        return
    }
    drawing.update(drawing.theta - 0.025)
    requestAnimationFrame(shrink);
}

requestAnimationFrame(grow);

function mapInfinityX(value) {
    // Drawing further than canvas edge, because the text of the segment e.g. tangent is displayed half way
    return Math.abs(value) === Infinity ? Math.sign(value) * canvas.width * 100 : value
}

function mapInfinityY(value) {
    // Drawing further than canvas edge, because the text of the segment e.g. cotangent is displayed half way
    return Math.abs(value) === Infinity ? Math.sign(value) * canvas.height * 100 : value
}

function twoDecimals(number) {
    // .slice needs to consider negative symbol
    return parseFloat(number.toFixed(10)).toString().slice(0, number < 0 ? 5 : 4)
}
