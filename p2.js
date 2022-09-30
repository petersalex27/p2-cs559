const PI = Math.PI;

window.onload = function() {
    let canvas = document.getElementById("myCanvas");
    let context = canvas.getContext("2d");
    let width = 500;
    let height = 500;

    const circle = (cx, cy, d) => context.ellipse(cx, cy, d, d, 0, 0, 2 * PI);
    const halfCircle = (cx, cy, d, pi2zero = false) =>
        context.ellipse(cx, cy, d, d, 0, pi2zero ? PI : 0, pi2zero ? 0 : PI);
    const eqScale = (unitSz) => context.scale(unitSz, unitSz);

    const waveBg = "#47388c";

    function drawBg(period = 10, n = 1, color = [0x47, 0x38, 0x8c]) {
        if (n === 0) return;

        context.fillStyle = '#'.concat(color[0].toString(16).padStart(2, '0'),
                                       color[1].toString(16).padStart(2, '0'),
                                       color[2].toString(16).padStart(2, '0'));
        context.save();

        context.beginPath();
        context.moveTo(-width / period, 100);
        for (let i = 0; i < period; ++i) {
            context.quadraticCurveTo(width / period / 2, 50, width / period, 100);
            context.translate(width * 2 / period, 0);
            context.quadraticCurveTo(width / period / 2, 50, width / period, 100);
            context.translate(width * 2 / period, 0);
        }

        context.restore();

        context.lineTo(500, 500);
        context.lineTo(0, 500);
        context.closePath();
        context.fill();

        context.save();
        context.translate(0, 50);
        color = [color[0] + 0x10, color[1] + 0x10, color[2] + 0x10]
        drawBg(period, n - 1, color);
        context.restore();
    }

    drawBg(10, 4);

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
            let headRadius = 35;
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

            let dx = headRadius * 3 / 4;
            const tentacleStartX = -headRadius + dx / 2, tentacleStartY = headRadius;
            // draw tentacle
            context.save();                             // [a, b, c]
            context.fillStyle = this.colors.headMid;
            context.translate(tentacleStartX, tentacleStartY);
            context.rotate(Math.atan(headRadius / (headRadius * 3)));

            function drawTentacle(n) {
                context.save();                         // [a, b, c, d]

                context.beginPath();
                context.translate(dx * n, 0);
                //const m = n + 1;
                for (let i = 0; i <= 9; ++i) {
                    // rotate segment
                    context.translate(-dx / 2, 30);
                    context.rotate(PI / 9);
                    context.translate(dx / 2, -30);
                    context.translate(-dx / 2, 30);
                    context.save();                     // [a, b, c, d, e]

                    // draw segment
                    let cx = -dx / 2, cy = 30, d = dx / 2, dD = dx / (2 + 0.1 * i);
                    eqScale(dD / d);
                    context.moveTo(0, 0);
                    halfCircle(0, 0, d, true);
                    context.lineTo(0, 30);
                    halfCircle(cx, cy, d, false);
                    context.lineTo(cx, 0);
                    context.closePath();
                    context.fill();

                    context.restore();
                    // context.ellipse(0, 0, 5, 5, 0, 0, 2 * PI);
                    // context.stroke();
                }

                context.restore();
            }

            for (let n = 0; n < 4; ++n) drawTentacle(n);
            context.restore();

        }
    }

    octo.drawBody();
}