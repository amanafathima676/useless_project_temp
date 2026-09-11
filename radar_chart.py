"""
Radar Chart Module for Act 2 (Indian Education Machine)
Renders a high-performance, glowing 8-axis spider/radar chart in Pygame.
"""

import math
import pygame

# 8 Radar Axes aligned with the 8 stats
RADAR_AXES = [
    {"key": "assignments",   "label": "ASSIGNMENTS",   "angle_deg": 270, "color": (56, 189, 248)},
    {"key": "hackathon",     "label": "HACKATHON",     "angle_deg": 315, "color": (250, 204, 21)},
    {"key": "placement",     "label": "PLACEMENT PREP","angle_deg": 0,   "color": (16, 185, 129)},
    {"key": "club",          "label": "CLUB ACTS",     "angle_deg": 45,  "color": (236, 72, 153)},
    {"key": "sleep",         "label": "SLEEP",         "angle_deg": 90,  "color": (129, 140, 248)},
    {"key": "friends",       "label": "FRIENDS / CHAI","angle_deg": 135, "color": (251, 146, 60)},
    {"key": "mental_health", "label": "SANITY / MENTAL","angle_deg": 180, "color": (248, 113, 113)},
    {"key": "record",        "label": "LAB RECORD",    "angle_deg": 225, "color": (6, 182, 212)}
]


class RadarChart:
    def __init__(self, cx, cy, radius=180):
        self.cx = cx
        self.cy = cy
        self.radius = radius
        self.axes = RADAR_AXES
        self.num_axes = len(RADAR_AXES)
        self.pulse_timer = 0.0

        # Precalculate unit vectors for all 8 axes
        self.unit_vectors = []
        for axis in self.axes:
            rad = math.radians(axis["angle_deg"])
            ux = math.cos(rad)
            uy = math.sin(rad)
            self.unit_vectors.append((ux, uy))

    def update(self, dt):
        self.pulse_timer += dt * 5.0

    def draw(self, surface, stats_dict, font_sm, font_xs):
        """
        Draws the radar grid, axes, data polygon, glow, and labels.
        """
        cx, cy = self.cx, self.cy
        r = self.radius

        # 1. Draw Concentric Grid Rings (20%, 40%, 60%, 80%, 100%)
        levels = [0.2, 0.4, 0.6, 0.8, 1.0]
        for lvl in levels:
            ring_pts = []
            for ux, uy in self.unit_vectors:
                px = cx + ux * (r * lvl)
                py = cy + uy * (r * lvl)
                ring_pts.append((px, py))
            
            # Subtle grid color
            line_color = (40, 50, 70) if lvl < 1.0 else (70, 85, 120)
            line_width = 1 if lvl < 1.0 else 2
            pygame.draw.polygon(surface, line_color, ring_pts, line_width)

        # 2. Draw 8 Axis Spokes
        for i, (ux, uy) in enumerate(self.unit_vectors):
            axis = self.axes[i]
            ex = cx + ux * r
            ey = cy + uy * r
            pygame.draw.line(surface, (50, 65, 90), (cx, cy), (ex, ey), 1)

        # 3. Calculate Data Polygon Vertices
        data_points = []
        mental_health_pt = None
        mental_val = stats_dict.get("mental_health", 50.0)

        for i, axis in enumerate(self.axes):
            val = stats_dict.get(axis["key"], 0.0)
            norm_val = max(0.05, min(1.0, val / 100.0))
            ux, uy = self.unit_vectors[i]
            px = cx + ux * (r * norm_val)
            py = cy + uy * (r * norm_val)
            data_points.append((px, py))
            
            if axis["key"] == "mental_health":
                mental_health_pt = (px, py)

        # 4. Render Translucent Filled Polygon & Neon Outline
        if len(data_points) >= 3:
            # Per-pixel alpha surface for glow
            poly_surface = pygame.Surface(surface.get_size(), pygame.SRCALPHA)
            
            # Dynamic fill color: Shifts from cyan/purple to frantic magenta/red as sanity drops
            if mental_val > 50:
                fill_color = (0, 245, 212, 65)     # Cyan neon glow
                outline_color = (0, 245, 212)
            elif mental_val > 25:
                fill_color = (255, 183, 3, 75)     # Amber panic glow
                outline_color = (255, 183, 3)
            else:
                fill_color = (247, 37, 133, 90)    # Deep critical magenta glow
                outline_color = (247, 37, 133)

            pygame.draw.polygon(poly_surface, fill_color, data_points)
            surface.blit(poly_surface, (0, 0))

            # Crisp outline
            pygame.draw.polygon(surface, outline_color, data_points, 3)

        # 5. Draw Vertices with pulsating Mental Health node
        for i, (px, py) in enumerate(data_points):
            axis = self.axes[i]
            val = stats_dict.get(axis["key"], 0.0)
            
            # Standard node
            pygame.draw.circle(surface, (15, 23, 42), (int(px), int(py)), 6)
            pygame.draw.circle(surface, axis["color"], (int(px), int(py)), 4)

            # Special Mental Health pulsating aura if critical (<30)
            if axis["key"] == "mental_health" and mental_val < 35.0:
                pulse_rad = int(8 + 5 * math.sin(self.pulse_timer))
                glow_surf = pygame.Surface((pulse_rad * 4, pulse_rad * 4), pygame.SRCALPHA)
                pygame.draw.circle(glow_surf, (239, 68, 68, 140), (pulse_rad * 2, pulse_rad * 2), pulse_rad)
                surface.blit(glow_surf, (int(px - pulse_rad * 2), int(py - pulse_rad * 2)))

        # 6. Draw Axis Labels and Values
        for i, axis in enumerate(self.axes):
            ux, uy = self.unit_vectors[i]
            val = stats_dict.get(axis["key"], 0.0)
            
            # Label placement slightly outside radius
            label_dist = r + 26
            lx = cx + ux * label_dist
            ly = cy + uy * label_dist
            
            val_text = f"{int(val)}%"
            
            # Color coding for sanity alert
            if axis["key"] == "mental_health" and val < 30:
                name_color = (239, 68, 68)
                val_text += " [CRITICAL]"
            else:
                name_color = axis["color"]

            name_surface = font_xs.render(axis["label"], True, name_color)
            val_surface = font_xs.render(val_text, True, (255, 255, 255))
            
            # Center alignment logic based on direction
            nw = name_surface.get_width()
            nh = name_surface.get_height()
            vw = val_surface.get_width()

            draw_x = lx - nw / 2
            draw_y = ly - nh / 2
            
            if ux > 0.3:
                draw_x = lx + 5
            elif ux < -0.3:
                draw_x = lx - nw - 5

            if uy > 0.3:
                draw_y = ly + 4
            elif uy < -0.3:
                draw_y = ly - nh - 4

            surface.blit(name_surface, (draw_x, draw_y))
            surface.blit(val_surface, (draw_x + (nw - vw) / 2 if abs(ux) <= 0.3 else draw_x, draw_y + nh + 2))
