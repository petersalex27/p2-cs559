const PI = Math.PI;

window.onload = function() {
    window.requestAnimationFrame(draw);
};

let yVals = [];
let xVals = [];

const getFrames = () => Math.ceil(Math.random() * 60 + 60);

let totFrames = [getFrames(), getFrames(), getFrames(), getFrames(), getFrames(), getFrames(), getFrames(), getFrames()];
let framesLeft = structuredClone(totFrames);

let goals = [newGoal(), newGoal(), newGoal(), newGoal(), newGoal(), newGoal(), newGoal(), newGoal()];
let currs = [newGoal(), newGoal(), newGoal(), newGoal(), newGoal(), newGoal(), newGoal(), newGoal()];

function newGoal() {
    return [PI / (12 * Math.random() % 12),
        PI / (12 * Math.random() % 12),
        PI / (12 * Math.random() % 12),
        PI / (12 * Math.random() % 12),
        PI / (12 * Math.random() % 12),
        PI / (12 * Math.random() % 12),
        PI / (12 * Math.random() % 12),
        PI / (12 * Math.random() % 12),];
}

function draw() {
    let canvas = document.getElementById("myCanvas");
    let context = canvas.getContext("2d");
    let width = 500;
    let height = 500;

    const circle = (cx, cy, d) => context.ellipse(cx, cy, d, d, 0, 0, 2 * PI);
    const halfCircle = (cx, cy, d, pi2zero = false) =>
        context.ellipse(cx, cy, d, d, 0, pi2zero ? PI : 0, pi2zero ? 0 : PI);
    const eqScale = (unitSz) => context.scale(unitSz, unitSz);

    function drawBg(n = 1, degree = 10, maxH = 50, color = [0x47, 0x38, 0x8c], horizonColor = "#c6d5f1") {
        // draw horizon
        context.beginPath();
        context.rect(0, 90, width, height);
        context.fillStyle = horizonColor;
        context.fill();

        context.save();
        context.translate(0, 150);

        for (let N = 0; N < n; ++N) {
            context.fillStyle = 'rgba('.concat(color[0].toString(10), ',', color[1].toString(10), ',',
                color[2].toString(10), ',', '1.0', ')');
            if (xVals.length == 0 || yVals.length == 0) {
                for (let i = 0; i < degree; ++i) {
                    yVals.push(Math.random() * maxH);  // gets y values
                    xVals.push(Math.random());
                }
                // get x values
                let sum = 0;
                for (let i = 0; i < xVals.length; ++i) sum += xVals[i];
                for (let i = 0; i < xVals.length; ++i) xVals[i] = (xVals[i] / sum) * width;
            }

            context.beginPath();
            context.moveTo(0, 0);
            for (let i = 0; i < degree; ++i) {
                context.lineTo(xVals[i], -yVals[i]);
                context.translate(xVals[i], 0);
            }
            context.lineTo(0, height);
            context.translate(-width, 0);
            context.lineTo(0, height);
            context.closePath();
            context.fill();

            context.translate(0, 100 / n);
            let change = 0x60 / n;
            let changeb = -0x40 / n;
            color = [color[0] + change, color[1] + change, color[2] + changeb, 1.0];
        }
        context.restore();
    }

    function drawBgWaves(period = 10, n = 1, color = [0x17, 0x38, 0x7c, 0.2]) {
        let spacing = [];
        for (let i = 0, z = height / 2 - 50; i < n; ++i) {
            spacing.unshift(z / 1.5);
            z /= 1.5;
        }

        context.save();
        let origin = period;
        period = period + n - 1;
        for (let i = 0; i < n; i++) {
            context.fillStyle = 'rgba('.concat(color[0].toString(10), ',',
                color[1].toString(10), ',',
                color[2].toString(10), ',',
                color.length > 3 ? color[3].toString() : '1.0', ')');
            context.save();

            context.beginPath();
            context.moveTo(-width / period, 100);
            for (let j = 0; j < period; ++j) {
                context.quadraticCurveTo(width / period / 2, 50 + (period - origin) * 8, width / period, 100);
                context.translate(width * 2 / period, 0);
            }

            context.restore();

            context.lineTo(500, 500);
            context.lineTo(0, 500);
            context.closePath();
            context.fill();

            context.save();
            for (let t = 0; t < 10; ++t) {
                context.save();
                context.beginPath();
                context.moveTo(-width / period, 100);
                for (let j = 0; j < period; ++j) {
                    context.quadraticCurveTo(width / period / 2, 50 + (period - origin) * 8, width / period, 100);
                    context.translate(width * 2 / period, 0);
                }

                context.strokeStyle = "rgba(255, 255, 255, 0.5)";
                context.stroke();
                context.restore();
                context.translate(0, spacing[0] / 10);
            }
            context.restore();

            context.translate(0, spacing.shift());
            let change = 0x50 / n;
            color = [color[0] + change, color[1] + change, color[2] + change, color.length > 3 ? color[3] : '1.0'];
            period--;
        }
        context.restore();
    }

    drawBg(12, 10, 50);
    drawBgWaves(10, 7);

    const octo = {
        // color arrays go index [len / 2] = midtone, index < [len / 2] = highlights, index > [len / 2] = shadows
        colors : {
            headMid : "#f5b95f",
            headLow : "#e79639",
            eyelid : "#cc8547",
            eyewhite : "#f1f1f5",
            pupil : "#35353d",
        },

        drawBody : function () {
            const drawPupilAndColor = (color) => (scale) => {
                function drawPath(doFlip) {
                    context.save();         // [a]
                    context.beginPath();
                    context.translate(-5, 0);
                    context.scale(scale, scale);

                    if (doFlip) {
                        context.translate(0, 20);
                        context.scale(1, -1);
                    }
                    context.beginPath();
                    context.moveTo(0, 10);
                    context.quadraticCurveTo(0, 0, 10, 0);
                    context.lineTo(50, 0);
                    //context.scale(0, -1); // reflect over y
                    context.quadraticCurveTo(60, 0, 60, 10);
                    context.fill();
                    context.restore();      // []
                }

                let restoreColor = context.fillStyle;
                context.fillStyle = color;
                drawPath(true);
                drawPath(false);
                context.fillStyle = restoreColor;

            }

            let headRadius = 35;
            let dx = headRadius * 3 / 4;

            context.save();

            context.translate(width / 2, height / 2);
            context.fillStyle = this.colors.headLow;
            drawTentacle(0, 12, [PI / 9], 20);
            drawTentacle(1, 12, [PI / 3, PI / 9, PI / 12, -PI / 12, PI / 3, PI / 3], 20);
            drawTentacle(3, 12, [PI / 8, PI / 7, -PI / 6], 20);
            drawTentacle(2, 12, [-PI / 2, -PI / 3, PI / 12, -PI / 12, PI / 3, PI / 3], 20);

            context.restore();

            // draw back part of head
            context.beginPath();
            context.fillStyle = this.colors.headLow;
            context.translate(width / 2, height / 2);
            context.moveTo(0, 0);
            context.quadraticCurveTo(60, -20, 100, 50);
            context.quadraticCurveTo(120, 100, 0, 60);
            context.closePath();
            context.fill();

            // set up head drawing
            context.save();                             // [a]
            context.translate(0, 35);

            // draw back eyelid
            context.save();                             // [a, b]
            context.rotate(-2 * PI / 3);
            context.translate(headRadius, 0);
            context.ellipse(0, 0, 10, 10, 0, 0, 2 * PI);   // lid
            context.fillStyle = this.colors.eyelid;
            context.fill();

            // draw head
            context.beginPath();
            context.restore();                          // [a]
            context.ellipse(0, 0, headRadius, headRadius, 0, 0, 2 * PI);
            context.fillStyle = this.colors.headMid;
            context.fill();

            // draw front eyelid
            context.beginPath();
            context.save();                             // [a, b]
            context.rotate(-PI / 4);
            context.translate(headRadius, 0);
            circle(0, 0, 10);   // lid
            context.fillStyle = this.colors.eyelid;
            context.fill();

            // draw front white part of eye
            context.beginPath();
            context.translate(0, 2);
            context.fillStyle = this.colors.eyewhite;
            circle(0, 0, 8);   // white part
            context.fill();

            // draw pupil
            let drawPupil = drawPupilAndColor(this.colors.pupil);
            drawPupil(0.2);

            // draw tentacle base
            context.beginPath();
            context.restore();                         // [a]
            context.save();                            // [a, b]
            context.fillStyle = this.colors.headMid;
            context.translate(-headRadius, 0);
            // trapezoid part
            context.moveTo(0, 0);
            context.lineTo(-headRadius, headRadius);
            context.save();                             // [a, b, c]
            context.translate(-headRadius, headRadius);
            context.moveTo(0,0);
            // draw base
            context.rotate(Math.atan(headRadius / (headRadius * 3)));
            context.translate(headRadius * 3 / 4 / 2, 0);
            for (let i = 0; i < 4; ++i) {
                context.ellipse(0, 0, headRadius * 3 / 4 / 2, headRadius * 3 / 4 / 3, 0, PI, 0);
                context.translate(headRadius * 3 / 4, 0);
            }
            context.restore();                          // [a, b]
            context.save();                             // [a, b, c]
            context.rotate(Math.atan(headRadius / (headRadius * 3)));
            // draw right side
            context.lineTo(2 * headRadius - headRadius / 3, -headRadius);
            context.restore();                          // [a, b]
            // connect
            context.lineTo(0, 0);
            context.fill();

            const tentacleStartX = -headRadius + dx * 1.5, tentacleStartY = -headRadius + 40;
            // draw tentacle
            context.save();                             // [a, b, c]
            context.fillStyle = this.colors.headMid;
            context.translate(tentacleStartX, tentacleStartY);
            context.rotate(Math.atan(headRadius / (headRadius * 3)));

            function drawTentacle(n, segments = 10, rad = [PI / 9], len = 30) {
                context.save();                         // [a, b, c, d]

                if (0 == framesLeft[n]) {
                    const f = getFrames();
                    framesLeft[n] = f.valueOf();
                    totFrames[n] = f.valueOf();
                }
                framesLeft[n] = framesLeft[n] - 1;

                n = n % 4;
                let radIdx = 0;
                context.beginPath();
                context.translate(dx * n, 0);
                for (let i = 0; i < segments; ++i) {
                    let shrink = 1 / segments;
                    // rotate segment
                    context.translate(-dx / 2, len);
                    context.rotate(
                        currs[n][radIdx] +
                        ((goals[n][radIdx] - currs[n][radIdx]) / totFrames[n]) * (totFrames[n] - framesLeft[n])
                    );
                    context.translate(dx / 2, -len);
                    context.translate(-dx / 2, len);
                    context.save();                     // [a, b, c, d, e]

                    // draw segment
                    let cx = -dx / 2, cy = len, d = dx / 2, dD = dx / (2 + shrink * i);
                    eqScale(dD / d);
                    context.moveTo(0, 0);
                    halfCircle(0, 0, d, true);
                    context.lineTo(0, len);
                    halfCircle(cx, cy, d, false);
                    context.lineTo(cx, 0);
                    context.closePath();
                    context.stroke();
                    context.fill();

                    context.restore();
                    radIdx += (goals[n].length / segments);
                    // context.ellipse(0, 0, 5, 5, 0, 0, 2 * PI);
                }

                context.restore();
            }


            drawTentacle(0, 12);
            drawTentacle(1, 12, [PI / 3, PI / 9, PI / 12, -PI / 12, PI / 3, PI / 3]);
            drawTentacle(3, 12, [PI / 8, PI / 7, -PI / 6]);
            drawTentacle(2, 12, [-PI / 2, -PI / 3, PI / 12, -PI / 12, PI / 3, PI / 3]);
            context.restore();
            context.restore();
            context.restore();
        }
    }

    octo.drawBody();
    //context.save();
    context.translate(-width / 2, -45);
    context.moveTo(0, 0);
    drawBgWaves(10, 1, [0x87, 0x78, 0xcc, 0.5]);
    context.translate(0, -height / 2 + 45);

    window.requestAnimationFrame(draw);
}