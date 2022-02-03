const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function drawCircle({centerX, centerY, radius}) {
    context.strokeStyle = 'black';
    // Circle
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();
    // Center
    context.beginPath();
    context.arc( canvas.width / 2,  canvas.height / 2, 1, 0, 2 * Math.PI);
    context.stroke();
}

function drawPointOnCircle() {

}

drawCircle({
    centerX: canvas.width / 2,
    centerY: canvas.height / 2,
    radius: canvas.height / 4
})

