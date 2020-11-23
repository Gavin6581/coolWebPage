'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var canvas = undefined,
    ctx = undefined;
var particles = [];
var count = 0;
var countMult = 15;
var mouseIn = false;

var center = undefined;

// 0123456789:
var chars = '8kq,8t3,jhj,jny,4mx,o0e,bfz,mmq,8fe,oge,sw';
var charAllocs = [];
var clock = {
    value: 0,
    text: [],
    allocs: [],
    size: 20,
    updates: 0
};
var clockOffset = undefined;

function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    ctx = canvas.drawingContext;

    canvas.canvas.onmouseenter = function() {
        return mouseIn = true;
    };
    canvas.canvas.onmouseleave = function() {
        return mouseIn = false;
    };

    colorMode(HSB);

    chars = chars.split(',').map(function(n) {
        return ('00000' + parseInt(n, 36).toString(2)).slice(-15).split('').map(function(n) {
            return +n;
        });
    });

    charAllocs = chars.map(function(n) {
        return n.reduce(function(p, m) {
            return p + m;
        }, 0);
    });

    count = max(charAllocs) * 60; // charAllocs.reduce((p, n) => p + n, 0);

    center = createVector(width / 2, height / 2);

    for (var i = 0; i < count; i++) {
        var particle = addParticle();
        particle.pos = center.copy();
    }
}

function addParticle() {
    var particle = new Particle();
    particle.randomize();
    particles.push(particle);
    return particle;
}

function draw() {
    // background(0);
    fill(0, 0.4);
    rect(0, 0, width, height);

    // let frameID = floor(random(10000)).toString(36);

    // stroke(255);
    // noFill();

    noStroke();
    fill(255);

    center = createVector(width / 2, height / 2);

    updateClock();

    clockOffset = createVector(width / 2, height / 2).sub(clock.size * 13.5, clock.size * 2.5);

    clock.allocs.forEach(function(a, aI, aArr) {
        fill(aI / aArr.length * 360, 100, 100);
        var char = clock.chars[aI];
        var forces = char.map(function(n, i) {
            if (n === 0) {
                return;
            }
            return createVector(i % 3, floor(i / 3)).mult(clock.size).add(clockOffset).add(clock.size / 2, clock.size / 2)
                // .add(aI * clock.size * 4, 0);
                .add(aI * clock.size * 4 + floor(aI / 2) * clock.size * 2, 0);
        }).filter(function(n) {
            return n;
        });

        a.forEach(function(n, i, arr) {
            n.show();

            // forces.forEach(f => {
            // 	n.applyForce(p5.Vector.sub(f, n.pos).limit(0.01));
            // });

            var t = i / arr.length;
            var fI = floor(t * forces.length);
            var f = forces[fI];
            // if(c
            n.applyForce(p5.Vector.sub(f, n.pos).limit(0.45));
            // n.frameID = frameID;
        });
    });

    // fill(255);

    var mouse = createVector(mouseX, mouseY);

    var z = frameCount / 100;
    particles.forEach(function(n, j) {
        // if(n.frameID !== frameID) {
        // 	n.show();
        // }

        if (mouseIn) {
            var mouseDiff = p5.Vector.sub(mouse, n.pos);
            if (mouseIsPressed) {
                n.applyForce(mouseDiff.rotate(PI).limit(0.5));
            } else if (mouseDiff.mag() < 100) {
                n.applyForce(mouseDiff.rotate(PI).limit(0.45));
            }
        }

        var noiseInfluence = noise(n.pos.x / 100, n.pos.y / 100, z);
        var force = map(noiseInfluence, 0.3, 0.7, 0, TAU);
        var f = p5.Vector.fromAngle(force).setMag(0.188);
        n.applyForce(f);

        // n.applyForce(p5.Vector.sub(center, n.pos).limit(0.025));

        n.update();
        n.edges();
    });

    // text(clock.text, 10, 20);
    // drawAllChars();

    // drawTime();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function updateClock() {
    var now = new Date();
    now.setMilliseconds(0);

    var nowTime = now.getTime();

    if (nowTime <= clock.value) {
        return;
    }

    clock.updates++;
    clock.value = nowTime;

    clock.text = [now.getHours(), now.getMinutes(), now.getSeconds()].map(function(n) {
        return ('0' + n).slice(-2);
    });
    clock.chars = clock.text.reduce(function(p, n) {
        return p.concat([chars[n[0]], chars[n[1]]]);
    }, []);

    var allocCounts = clock.text.reduce(function(p, n) {
        return p.concat([charAllocs[n[0]], charAllocs[n[1]]]);
    }, []);
    var allocTotal = allocCounts.reduce(function(p, n) {
        return p + n;
    }, 0);
    var allocable = particles.slice(0);

    // Sequential
    // clock.allocs = allocCounts.map(n => allocable.splice(0, n));

    // Sequential - Even
    // let perCount = round(count / (allocTotal / countMult));
    var perCount = count / 6;
    clock.allocs = allocCounts.map(function(n) {
        return allocable.splice(0, perCount);
    });

    // Random
    // clock.allocs = allocCounts.map(n => {
    // 		let arr = [];
    // 		for(let i = 0; i < n; i++) {
    // 			let rand = floor(random(allocable.length));
    // 			let ele = allocable.splice(rand, 1)[0];
    // 			arr.push(ele);
    // 		}
    // 		return arr;
    // 	});

    // Shake 'em up
    clock.allocs = clock.allocs.map(function(n) {
        return shuffle(n);
    });
    // clock.allocs.forEach(n => shuffle(n));
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = floor(random(i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function drawTime() {
    // Debugging purposes
    push();

    fill(120, 100, 100, 0.2);
    noStroke();
    rect(clockOffset.x, clockOffset.y, clock.size * 27, clock.size * 5);

    translate(clockOffset.x, clockOffset.y);
    clock.text.forEach(function(n) {
        drawChar(n[0]);
        translate(clock.size * 4, 0);
        drawChar(n[1]);
        translate(clock.size * 6, 0);
    });

    pop();
}

function drawAllChars() {
    // Debugging purposes
    push();

    noStroke();
    fill(255);
    chars.forEach(function(c, i) {
        drawChar(c);
        translate(clock.size * 4, 0);
    });

    pop();
}

function drawChar(c) {
    if (!Array.isArray(c)) {
        c = chars[c];
    }
    var size = clock.size;
    c.forEach(function(n, j) {
        fill(n * 255, 0.3);
        rect(j % 3 * size, floor(j / 3) * size, size, size);
    });
}

var Particle = function() {
    function Particle() {
        _classCallCheck(this, Particle);

        this.reset();
    }

    Particle.prototype.applyForce = function applyForce() {
        var _acc;

        (_acc = this.acc).add.apply(_acc, arguments);
    };

    Particle.prototype.reset = function reset() {
        this.pos = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.vel = createVector(0, 0);
    };

    Particle.prototype.randomize = function randomize() {
        // this.pos.set(random(width), random(height));
        // this.pos.set(random(width), random(height));
    };

    Particle.prototype.update = function update() {
        this.vel.add(this.acc);
        this.acc.mult(0);
        this.pos.add(this.vel);
        this.vel.mult(0.90);
    };

    Particle.prototype.edges = function edges() {
        if (this.pos.x < 0) this.pos.x += width;
        else if (this.pos.x > width) this.pos.x -= width;
        if (this.pos.y < 0) this.pos.y += height;
        else if (this.pos.y > height) this.pos.y -= height;
    };

    Particle.prototype.show = function show() {
        var i = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

        ellipse(this.pos.x, this.pos.y, 6);
    };

    Particle.prototype.showVel = function showVel() {
        var pVel = this.pos.copy().add(this.vel);
        line(this.pos.x, this.pos.y, pVel.x, pVel.y);
    };

    return Particle;
}();