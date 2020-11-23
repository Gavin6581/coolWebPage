var c = document.getElementById('canv');
var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;
var $ = c.getContext("2d");
/*
Thanks Jack Rugile for this gradient cache fix for a perf boost - 
he's awesome - 
y'all should be following him if you're not already...( @jackrugile ;) 
*/
var _c = document.createElement('canvas');
var _w = _c.width = 100;
var _h = _c.height = 100;
var $$ = _c.getContext("2d");
var gc = $$.createRadialGradient(
    _w / 2,
    _h / 2,
    0,
    _w / 2,
    _h / 2, (_w / 2) * 1.5
);
gc.addColorStop(0, 'hsla(218, 95%, 85%, 1)');
gc.addColorStop(1, 'hsla(218, 100%,85%,0.1)');
$$.fillStyle = gc;
$$.beginPath();
$$.arc(_w / 2, _h / 2, _w / 2, 0, Math.PI * 2);
$$.fill();

var num = 8000;
var _x = 0;
var _y = 0;
var _z = 200;
var u = 0;
var dtr = function(d) {
    return d * Math.PI / 180;
};

var rnd = function() {
    return Math.sin(Math.floor(Math.random() * 360) * Math.PI / 180);
};

var dst = function(p1, p2, p3) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};

var cam = {
    prime: {
        x: _x,
        y: _y,
        z: _z
    },
    sub: {
        x: 0,
        y: 0,
        z: 1
    },
    dst: {
        x: 0,
        y: 0,
        z: 200
    },
    ang: {
        phic: 0,
        phis: 0,
        thetac: 0,
        thetas: 0
    },
    zoom: 1,
    disp: {
        x: w / 2,
        y: h / 2,
        z: 0
    },
    upd: function() {
        cam.dst.x = cam.sub.x - cam.prime.x;
        cam.dst.y = cam.sub.y - cam.prime.y;
        cam.dst.z = cam.sub.z - cam.prime.z;
        cam.ang.phic = -cam.dst.z / Math.sqrt(cam.dst.x * cam.dst.x + cam.dst.z * cam.dst.z);
        cam.ang.phis = cam.dst.x / Math.sqrt(cam.dst.x * cam.dst.x + cam.dst.z * cam.dst.z);
        cam.ang.thetac = Math.sqrt(cam.dst.x * cam.dst.x + cam.dst.z * cam.dst.z) / Math.sqrt(cam.dst.x * cam.dst.x + cam.dst.y * cam.dst.y + cam.dst.z * cam.dst.z);
        cam.ang.thetas = -cam.dst.y / Math.sqrt(cam.dst.x * cam.dst.x + cam.dst.y * cam.dst.y + cam.dst.z * cam.dst.z);
    }
};

var trans = {
    parts: {
        sz: function(p, sz) {
            return {
                x: p.x * sz.x,
                y: p.y * sz.y,
                z: p.z * sz.z
            };
        },
        rot: {
            x: function(p, rot) {
                return {
                    x: p.x,
                    y: p.y * Math.cos(dtr(rot.x)) - p.z * Math.sin(dtr(rot.x)),
                    z: p.y * Math.sin(dtr(rot.x)) + p.z * Math.cos(dtr(rot.x))
                };
            },
            y: function(p, rot) {
                return {
                    x: p.x * Math.cos(dtr(rot.y)) + p.z * Math.sin(dtr(rot.y)),
                    y: p.y,
                    z: -p.x * Math.sin(dtr(rot.y)) + p.z * Math.cos(dtr(rot.y))
                };
            },
            z: function(p, rot) {
                return {
                    x: p.x * Math.cos(dtr(rot.z)) - p.y * Math.sin(dtr(rot.z)),
                    y: p.x * Math.sin(dtr(rot.z)) + p.y * Math.cos(dtr(rot.z)),
                    z: p.z
                };
            }
        },
        pos: function(p, pos) {
            return {
                x: p.x + pos.x,
                y: p.y + pos.y,
                z: p.z + pos.z
            };
        }
    },
    vp: {
        phi: function(p) {
            return {
                x: p.x * cam.ang.phic + p.z * cam.ang.phis,
                y: p.y,
                z: p.x * -cam.ang.phis + p.z * cam.ang.phic
            };
        },
        theta: function(p) {
            return {
                x: p.x,
                y: p.y * cam.ang.thetac - p.z * cam.ang.thetas,
                z: p.y * cam.ang.thetas + p.z * cam.ang.thetac
            };
        },
        resvp: function(p) {
            return {
                x: p.x - cam.prime.x,
                y: p.y - cam.prime.y,
                z: p.z - cam.prime.z
            };
        }
    },
    persp: function(p) {
        return {
            x: p.x * cam.dst.z / p.z * cam.zoom,
            y: p.y * cam.dst.z / p.z * cam.zoom,
            z: p.z * cam.zoom,
            p: cam.dst.z / p.z
        };
    },
    disp: function(p, disp) {
        return {
            x: p.x + disp.x,
            y: -p.y + disp.y,
            z: p.z + disp.z,
            p: p.p
        };
    },
    calc: function(obj, sz, rot, pos, disp) {
        var ret = trans.parts.sz(obj, sz);
        ret = trans.parts.rot.x(ret, rot);
        ret = trans.parts.rot.y(ret, rot);
        ret = trans.parts.rot.z(ret, rot);
        ret = trans.parts.pos(ret, pos);
        ret = trans.vp.phi(ret);
        ret = trans.vp.theta(ret);
        ret = trans.vp.resvp(ret);
        ret = trans.persp(ret);
        ret = trans.disp(ret, disp);
        return ret;
    }
};

(function() {

    var Verts = function(par) {
        this.transIn = {};
        this.transOut = {};
        this.transIn.vtx = (par.vtx);
        this.transIn.sz = (par.sz);
        this.transIn.rot = (par.rot);
        this.transIn.pos = (par.pos);
    };

    Verts.prototype.updvtx = function() {
        this.transOut = trans.calc(
            this.transIn.vtx,
            this.transIn.sz,
            this.transIn.rot,
            this.transIn.pos,
            cam.disp
        );
    };

    var Obj = function() {

        this.vel = 0.04;
        this.maxt = 360;
        this.diff = 200;
        this.pos = 100;

        this.tx = _x;
        this.ty = _y;
        this.u = 0;
        this.set();

    };

    Obj.prototype.set = function() {
        this.c = c;
        this.$ = $;
        this.v = [];
        this.dist = [];
        this.reps = [];

        for (var i = 0, len = num; i < len; i++) {
            this.v[i] = new Verts({
                vtx: {
                    x: rnd(),
                    y: rnd(),
                    z: rnd()
                },
                sz: {
                    x: 0,
                    y: 0,
                    z: 0
                },
                rot: {
                    x: 20,
                    y: -20,
                    z: 0
                },
                pos: {
                    x: this.diff * Math.sin(360 * Math.random() * Math.PI / 180),
                    y: this.diff * Math.sin(360 * Math.random() * Math.PI / 180),
                    z: this.diff * Math.sin(360 * Math.random() * Math.PI / 180)
                }
            });
            this.reps[i] = {
                x: 360 * Math.random(),
                y: 360 * Math.random(),
                z: 360 * Math.random()
            };
        }

        this.rots = {
            x: 0,
            y: 0,
            z: 0
        };

        this.size = {
            x: w / 5,
            y: h / 5,
            z: w / 5
        };
    };

    Obj.prototype.obj = function() {
        this.v.push(new Verts({
            vtx: {
                x: rnd(),
                y: rnd(),
                z: rnd()
            },
            sz: {
                x: 0,
                y: 0,
                z: 0
            },
            rot: {
                x: 20,
                y: -20,
                z: 0
            },
            pos: {
                x: this.diff * Math.sin(360 * Math.random() * Math.PI / 180),
                y: this.diff * Math.sin(360 * Math.random() * Math.PI / 180),
                z: this.diff * Math.sin(360 * Math.random() * Math.PI / 180)
            }
        }));
        this.reps.push({
            x: 360 * Math.random(),
            y: 360 * Math.random(),
            z: 360 * Math.random()
        });
    };

    Obj.prototype.upd = function() {
        cam.prime.x += (this.tx - cam.prime.x) * 0.05;
        cam.prime.y += (this.ty - cam.prime.y) * 0.05;
    };

    Obj.prototype.draw = function() {
        this.$.clearRect(0, 0, this.c.width, this.c.height);
        cam.upd();
        this.rots.x += 0.1;
        this.rots.y += 0.1;
        this.rots.z += 0.1;

        for (var i = 0; i < this.v.length; i++) {

            for (var val in this.reps[i]) {
                if (this.reps[i].hasOwnProperty(val)) {
                    this.reps[i][val] += this.vel;
                    if (this.reps[i][val] > this.maxt) this.reps[i][val] = 0;
                }
            }

            this.v[i].transIn.pos = {
                x: this.diff * Math.cos(this.reps[i].x * Math.PI / 180),
                y: this.diff * Math.sin(this.reps[i].y * Math.PI / 180),
                z: this.diff * Math.sin(this.reps[i].z * Math.PI / 180)
            };

            this.v[i].transIn.rot = this.rots;
            this.v[i].transIn.sz = this.size;
            this.v[i].updvtx();

            if (this.v[i].transOut.p < 0) continue;
            this.$.drawImage(_c, this.v[i].transOut.x, this.v[i].transOut.y, this.v[i].transOut.p * 4, this.v[i].transOut.p * 4);

        }

    };

    Obj.prototype.loop = function() {
        window.requestAnimationFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback, element) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();

        var loop = function() {
            this.upd();
            this.draw();
            window.requestAnimationFrame(loop);
        }.bind(this);
        loop();
    };

    Obj.prototype.run = function() {

        this.loop();

        window.addEventListener('mousemove', function(e) {
            this.tx = (e.clientX - this.c.width / 2) * -0.8;
            this.ty = (e.clientY - this.c.height / 2) * 0.8;
        }.bind(this));

        window.addEventListener('touchmove', function(e) {
            e.preventDefault();
            this.tx = (e.touches[0].clientX - this.c.width / 2) * -0.8;
            this.ty = (e.touches[0].clientY - this.c.height / 2) * 0.8;
        }.bind(this));

    };
    var o = new Obj();
    o.run();
})();