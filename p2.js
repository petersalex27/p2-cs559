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
            let drawPupilAndColor = (color) => (scale) => {
                function drawPath(doFlip) {
                    context.save();
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
                    context.restore();
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
            context.translate(width / 2, height / 2);    // center
            context.moveTo(0, 0);
            context.quadraticCurveTo(60, -20, 100, 50);
            context.quadraticCurveTo(120, 100, 0, 60);
            context.closePath();
            context.fill();

            // set up head drawing
            let headRadius = 35;
            context.save();                             // [center]
            context.translate(0, 35);

            // draw back eyelid
            context.save();                             // [center, head]
            context.rotate(-2 * PI / 3);
            context.translate(headRadius, 0);
            context.ellipse(0, 0, 10, 10, 0, 0, 2 * PI);   // lid
            context.fillStyle = this.colors.eyelid;
            context.fill();

            // draw head
            context.beginPath();
            context.restore();                          // [center]
            context.ellipse(0, 0, headRadius, headRadius, 0, 0, 2 * PI);
            context.fillStyle = this.colors.headMid;
            context.fill();

            // draw front eyelid
            context.beginPath();
            context.save();
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
            context.restore();
            context.save();
            context.fillStyle = this.colors.headMid;
            context.translate(-headRadius, 0);
            // trapezoid part
            context.moveTo(0, 0);
            context.lineTo(-headRadius, headRadius);
            context.save();
            context.translate(-headRadius, headRadius);
            context.moveTo(0,0);
            // draw base
            context.rotate(Math.atan(headRadius / (headRadius * 3)));
            context.translate(headRadius * 3 / 4 / 2, 0);
            for (let i = 0; i < 4; ++i) {
                context.ellipse(0, 0, headRadius * 3 / 4 / 2, headRadius * 3 / 4 / 3, 0, PI, 0);
                context.translate(headRadius * 3 / 4, 0);
            }
            context.restore();
            context.save();
            context.rotate(Math.atan(headRadius / (headRadius * 3)));
            // draw right side
            context.lineTo(2 * headRadius - headRadius / 3, -headRadius);
            context.restore();
            // connect
            context.lineTo(0, 0);
            context.fill();

            let idk = headRadius * 3 / 4
            // draw tentacle
            context.save();
            context.translate(-headRadius + idk / 2, headRadius);
            context.beginPath();
            context.fillStyle = "#f67ca1";
            context.rotate(Math.atan(headRadius / (headRadius * 3)));
            context.save();
            // base
            for (let i = 0; i < 4; ++i) {
                if (i > 0) context.translate(idk, 0);
                context.moveTo(0, 0);
                context.ellipse(0, 0, idk / 2, idk / 2, 0, PI, 0);
                context.lineTo(0, 30);
                context.ellipse(-idk / 2, 30, idk / 2.2, idk / 2.2, 0, 0, PI);
                context.lineTo(-idk / 2, 0);
                context.closePath();
                context.fill();
            }
            context.restore();
            // next
            for (let n = 1; n <= 10; ++n) {
                context.translate(-idk / 2, 30);
                context.rotate(PI / 9);
                context.translate(idk / 2, -30);
                context.translate(-idk / 2, 30);
                context.save();
                for (let i = 0; i < 4; ++i) {
                    let cx = -idk / 2, cy = 30, d = idk / 2, dD = idk / (2 + 0.1 * n);
                    if (i > 0) context.translate(idk, 0);
                    context.save();
                    eqScale(dD / d);
                    context.moveTo(0, 0);
                    halfCircle(0, 0, d, true);
                    context.lineTo(0, 30);
                    halfCircle(cx, cy, d, false);
                    context.lineTo(cx, 0);
                    context.closePath();
                    context.stroke();
                    context.fill();
                    context.restore();
                }
                context.restore();
            }
        }
    }

    octo.drawBody();
}