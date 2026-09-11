/**
 * Kinetic Grid — Vanilla JS port (dark-emerald theme)
 * Warps a grid toward the pointer and ripples on click, behind the quiz screen.
 * Exposes initKineticGrid(canvasEl) -> { destroy() }.
 */
(function (global) {
  "use strict";

  // ─── Constants ────────────────────────────────────────────────────────────
  var CELL_SIZE = 55;
  var INFLUENCE_RADIUS = 260;
  var MAX_WARP = 24;
  var DOT_SPACING = 28;
  var LERP_SPEED = 0.08;

  var LINE_BASE = { r: 255, g: 255, b: 255, a: 0.13 };
  var NODE_BASE_RADIUS = 1.8;
  var NODE_ACTIVE_RADIUS = 3.2;

  // Dark-emerald theme tuned to the site palette (mint-teal + kasavu gold)
  var THEME = {
    bg: "#0a1a16",
    lineActive: { r: 143, g: 232, b: 207, a: 0.9 },
    nodeActive: { r: 143, g: 232, b: 207, a: 1.0 },
    glow: "143,232,207",
    ripple: "230,202,101"
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function lerpN(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpColor(base, active, t) {
    var r = Math.round(lerpN(base.r, active.r, t));
    var g = Math.round(lerpN(base.g, active.g, t));
    var b = Math.round(lerpN(base.b, active.b, t));
    var a = lerpN(base.a, active.a, t);
    return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  // ─── Component ────────────────────────────────────────────────────────────
  function initKineticGrid(canvas) {
    if (!canvas || !canvas.getContext) return { destroy: function () {} };
    var ctx = canvas.getContext("2d");
    if (!ctx) return { destroy: function () {} };

    var mouse = { x: -9999, y: -9999 };
    var targetMouse = { x: -9999, y: -9999 };
    var ripples = [];
    var rafId = 0;
    var size = { w: 0, h: 0 };

    function getWarpedPoint(gx, gy, col, row, m, rps, cols, rows) {
      // Edge pin - locks boundary rows/cols in place
      var edgeMargin = 1.5;
      var colPin = Math.min(col / edgeMargin, (cols - 1 - col) / edgeMargin, 1);
      var rowPin = Math.min(row / edgeMargin, (rows - 1 - row) / edgeMargin, 1);
      var pinFactor = colPin * colPin * rowPin * rowPin;

      var dx = gx - m.x;
      var dy = gy - m.y;
      var dist = Math.sqrt(dx * dx + dy * dy);

      var proximity = Math.max(0, 1 - dist / INFLUENCE_RADIUS) * pinFactor;

      // Ripple displacement
      var rx = 0;
      var ry = 0;
      for (var i = 0; i < rps.length; i++) {
        var r = rps[i];
        var rdx = gx - r.x;
        var rdy = gy - r.y;
        var rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        var waveWidth = 55;
        var diff = rdist - r.radius;
        if (Math.abs(diff) < waveWidth) {
          var strength =
            (1 - Math.abs(diff) / waveWidth) * r.opacity * 18 * pinFactor;
          var angle = Math.atan2(rdy, rdx);
          var sign = diff < 0 ? -1 : 1;
          rx += Math.cos(angle) * strength * sign * -1;
          ry += Math.sin(angle) * strength * sign * -1;
        }
      }

      // Cursor warp with bell falloff
      if (dist < INFLUENCE_RADIUS && dist > 0 && pinFactor > 0) {
        var t = dist / INFLUENCE_RADIUS;
        var eased =
          t < 0.01 ? 0 : (1 - t) * (1 - t) * Math.min(1, dist / 60);
        var warpAmt = eased * MAX_WARP * pinFactor;
        var angle = Math.atan2(dy, dx);
        return {
          pt: {
            x: gx - Math.cos(angle) * warpAmt + rx,
            y: gy - Math.sin(angle) * warpAmt + ry
          },
          proximity: proximity
        };
      }

      return { pt: { x: gx + rx, y: gy + ry }, proximity: proximity };
    }

    function draw(now) {
      if (!canvas) return;
      if (!ctx) return;

      var W = size.w;
      var H = size.h;
      var m = mouse;
      var rps = ripples;
      var theme = THEME;

      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, W, H);

      // Static background dot texture
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      for (var x = DOT_SPACING / 2; x < W; x += DOT_SPACING) {
        for (var y = DOT_SPACING / 2; y < H; y += DOT_SPACING) {
          ctx.beginPath();
          ctx.arc(x, y, 0.7, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Update ripples
      for (var i = rps.length - 1; i >= 0; i--) {
        var r = rps[i];
        var age = (now - r.born) / 1000;
        r.radius = Math.max(0, age * 400);
        r.opacity = Math.max(0, 1 - age * 1.2);
        if (r.opacity <= 0) rps.splice(i, 1);
      }

      // Build warped grid
      var cols = Math.max(2, Math.ceil(W / CELL_SIZE)) + 1;
      var rows = Math.max(2, Math.ceil(H / CELL_SIZE)) + 1;
      var cellW = W / (cols - 1);
      var cellH = H / (rows - 1);

      var pts = [];
      var prox = [];

      for (var row = 0; row < rows; row++) {
        pts[row] = [];
        prox[row] = [];
        for (var col = 0; col < cols; col++) {
          var res = getWarpedPoint(
            col * cellW,
            row * cellH,
            col,
            row,
            m,
            rps,
            cols,
            rows
          );
          pts[row][col] = res.pt;
          prox[row][col] = res.proximity;
        }
      }

      // Grid lines
      function drawSeg(p1, p2, pr1, pr2) {
        var avg = (pr1 + pr2) / 2;
        var t = smoothstep(Math.max(0, Math.min(1, avg)));
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = lerpColor(LINE_BASE, theme.lineActive, t);
        ctx.lineWidth = lerpN(0.8, 1.5, t);
        ctx.stroke();
      }

      ctx.lineCap = "butt";

      for (row = 0; row < rows; row++)
        for (col = 0; col < cols - 1; col++)
          drawSeg(
            pts[row][col],
            pts[row][col + 1],
            prox[row][col],
            prox[row][col + 1]
          );

      for (col = 0; col < cols; col++)
        for (row = 0; row < rows - 1; row++)
          drawSeg(
            pts[row][col],
            pts[row + 1][col],
            prox[row][col],
            prox[row + 1][col]
          );

      // Intersection nodes
      for (row = 0; row < rows; row++) {
        for (col = 0; col < cols; col++) {
          var p = pts[row][col];
          var pr = prox[row][col];
          var t = smoothstep(Math.max(0, Math.min(1, pr)));
          var r = lerpN(NODE_BASE_RADIUS, NODE_ACTIVE_RADIUS, t);

          // Outer glow ring
          if (t > 0.3) {
            var glowR = r + lerpN(0, 6, (t - 0.3) / 0.7);
            var grd = ctx.createRadialGradient(
              p.x,
              p.y,
              r * 0.5,
              p.x,
              p.y,
              glowR
            );
            grd.addColorStop(0, "rgba(" + theme.glow + "," + (t * 0.3).toFixed(3) + ")");
            grd.addColorStop(1, "rgba(" + theme.glow + ",0)");
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fillStyle = grd;
            ctx.fill();
          }

          // Node fill
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fillStyle = lerpColor(
            { r: 255, g: 255, b: 255, a: 0.2 },
            theme.nodeActive,
            t
          );
          ctx.fill();
        }
      }

      // Ripple rings
      for (i = 0; i < rps.length; i++) {
        var rp = rps[i];
        var safeRadius = Math.max(0, rp.radius);
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, safeRadius, 0, Math.PI * 2);
        ctx.strokeStyle =
          "rgba(" + theme.ripple + "," + (rp.opacity * 0.28).toFixed(3) + ")";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    function animate(now) {
      mouse.x = lerpN(mouse.x, targetMouse.x, LERP_SPEED);
      mouse.y = lerpN(mouse.y, targetMouse.y, LERP_SPEED);

      draw(now);
      rafId = requestAnimationFrame(animate);
    }

    function setSize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      size.w = w;
      size.h = h;
      if (mouse.x === -9999) {
        mouse.x = -9999;
        mouse.y = -9999;
        targetMouse.x = -9999;
        targetMouse.y = -9999;
      }
    }

    function onMouseMove(e) {
      targetMouse.x = e.clientX;
      targetMouse.y = e.clientY;
    }

    function onClick(e) {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        opacity: 1,
        born: performance.now()
      });
    }

    function onResize() {
      setSize();
    }

    setSize();
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", onClick);
    rafId = requestAnimationFrame(animate);

    return {
      destroy: function () {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("click", onClick);
        if (rafId) cancelAnimationFrame(rafId);
      }
    };
  }

  global.initKineticGrid = initKineticGrid;
})(window);