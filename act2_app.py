"""
Main Application for Act 2: Indian Education Machine
Project: Oru Average Malayali (Useless Projects Hackathon 3.0)

Features:
- Live Forefinger (Index Tip) Tracking with MediaPipe & HUD overlay
- Self-view Camera Display with Skeleton + Reticle
- 8-Axis Live Radar Chart
- 60-Second Countdown with Tension Audio
- Student Status Result Card & Instant [R] Reset
"""

import os
import sys
import json
import math
import time
import cv2
import pygame
import numpy as np

from hand_tracker import HandTracker
from zone_mapper import ZoneMapper, ZONES
from stat_engine import StatEngine
from radar_chart import RadarChart
from audio_synthesizer import AudioSynthesizer
from result_card import ResultCard

WINDOW_WIDTH = 1280
WINDOW_HEIGHT = 720
FPS = 60
ROUND_DURATION = 60.0

COLOR_BG = (13, 17, 23)
COLOR_PANEL_BG = (22, 27, 34)
COLOR_BORDER = (48, 54, 61)
COLOR_TEXT_PRIMARY = (240, 246, 252)
COLOR_TEXT_MUTED = (139, 148, 158)
COLOR_ACCENT_CYAN = (0, 245, 212)
COLOR_ACCENT_MAGENTA = (247, 37, 133)
COLOR_ACCENT_GOLD = (255, 209, 102)
COLOR_ALERT_RED = (239, 68, 68)


class IndianEducationMachine:
    STATE_INTRO = "INTRO"
    STATE_COUNTDOWN = "COUNTDOWN"
    STATE_PLAYING = "PLAYING"
    STATE_RESULT = "RESULT"

    def __init__(self):
        pygame.init()
        pygame.display.set_caption("Act 2: Indian Education Machine - Oru Average Malayali")
        
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT), pygame.RESIZABLE)
        self.clock = pygame.time.Clock()
        self.is_fullscreen = False

        self._init_fonts()

        self.hand_tracker = HandTracker(model_path="hand_landmarker.task")
        self.zone_mapper = ZoneMapper(dead_zone_radius=0.18)
        self.stat_engine = StatEngine()
        self.audio = AudioSynthesizer()
        self.radar_chart = RadarChart(cx=330, cy=390, radius=185)
        self.result_card = ResultCard(WINDOW_WIDTH, WINDOW_HEIGHT)

        self.state = self.STATE_INTRO
        self.round_time_left = ROUND_DURATION
        self.countdown_timer = 3.0
        self.active_zone_info = None
        self.last_zone_idx = None
        self.career_track_title = self._load_act1_career_track()
        self.last_tick_sec = int(ROUND_DURATION)
        self.webcam_frame = None
        self.norm_hand_pos = (0.0, 0.0)
        self.hand_detected = False

    def _init_fonts(self):
        font_name = "Segoe UI" if os.name == 'nt' else "DejaVu Sans"
        self.fonts = {
            "xl": pygame.font.SysFont(font_name, 30, bold=True),
            "lg": pygame.font.SysFont(font_name, 22, bold=True),
            "md": pygame.font.SysFont(font_name, 17, bold=True),
            "sm": pygame.font.SysFont(font_name, 13, bold=False),
            "xs": pygame.font.SysFont(font_name, 11, bold=True),
            "bold": pygame.font.SysFont(font_name, 15, bold=True),
            "timer": pygame.font.SysFont(font_name, 44, bold=True),
            "huge": pygame.font.SysFont(font_name, 64, bold=True)
        }

    def _load_act1_career_track(self):
        session_file = "session.json"
        if os.path.exists(session_file):
            try:
                with open(session_file, "r") as f:
                    data = json.load(f)
                    return data.get("career_verdict", "B.Tech Mechanical Engineer Track")
            except Exception:
                pass
        return "B.Tech Mechanical Engineer Track (Ammavan Approved)"

    def reset_round(self):
        self.stat_engine.reset()
        self.round_time_left = ROUND_DURATION
        self.countdown_timer = 3.0
        self.state = self.STATE_PLAYING
        self.last_zone_idx = None
        self.result_card.anim_alpha = 0.0
        self.last_tick_sec = int(ROUND_DURATION)
        self.career_track_title = self._load_act1_career_track()
        print("[Act2] Round reset to fresh state.")

    def run(self):
        running = True
        while running:
            dt = self.clock.tick(FPS) / 1000.0

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_ESCAPE or event.key == pygame.K_q:
                        running = False
                    elif event.key == pygame.K_r:
                        self.reset_round()
                    elif event.key == pygame.K_m:
                        self.hand_tracker.toggle_mouse_fallback()
                    elif event.key == pygame.K_F11:
                        self.is_fullscreen = not self.is_fullscreen
                        if self.is_fullscreen:
                            self.screen = pygame.display.set_mode((0, 0), pygame.FULLSCREEN)
                        else:
                            self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT), pygame.RESIZABLE)
                    elif event.key == pygame.K_SPACE or event.key == pygame.K_RETURN:
                        if self.state == self.STATE_INTRO:
                            self.state = self.STATE_COUNTDOWN
                            self.countdown_timer = 3.0
                        elif self.state == self.STATE_RESULT:
                            self.reset_round()
                
                elif event.type == pygame.MOUSEMOTION and self.hand_tracker.use_mouse_fallback:
                    mx, my = event.pos
                    sw, sh = self.screen.get_size()
                    self.hand_tracker.set_mouse_position(sw, sh, mx, my)

                elif event.type == pygame.MOUSEBUTTONDOWN and self.state == self.STATE_RESULT:
                    self.reset_round()

            self._update(dt)
            self._render()
            pygame.display.flip()

        self.hand_tracker.release()
        pygame.quit()

    def _update(self, dt):
        frame_rgb, is_detected, (norm_x, norm_y), forefinger_px = self.hand_tracker.process_frame()
        self.webcam_frame = frame_rgb
        self.norm_hand_pos = (norm_x, norm_y)
        self.hand_detected = is_detected

        self.active_zone_info = self.zone_mapper.map_position(norm_x, norm_y)

        if self.state == self.STATE_COUNTDOWN:
            self.countdown_timer -= dt
            if self.countdown_timer <= 0:
                self.state = self.STATE_PLAYING
                self.audio.play_zone_switch()

        elif self.state == self.STATE_PLAYING:
            self.round_time_left -= dt
            
            sec_left = int(self.round_time_left)
            if sec_left != self.last_tick_sec and sec_left >= 0:
                self.last_tick_sec = sec_left
                if sec_left <= 10:
                    self.audio.play_panic()
                else:
                    self.audio.play_tick()

            active_id = None
            if not self.active_zone_info["is_dead_zone"]:
                active_zone = self.active_zone_info["zone"]
                active_id = active_zone["id"]
                current_zone_idx = self.active_zone_info["zone_index"]
                
                if current_zone_idx != self.last_zone_idx:
                    self.last_zone_idx = current_zone_idx
                    self.audio.play_zone_switch()
            else:
                self.last_zone_idx = None

            self.stat_engine.tick(active_id, dt)
            self.radar_chart.update(dt)

            mental = self.stat_engine.get_stat("mental_health")
            self.audio.update_tension(mental, self.round_time_left, dt)

            if self.round_time_left <= 0:
                self.round_time_left = 0
                self.state = self.STATE_RESULT
                self.audio.play_buzzer()
                self.audio.play_success()

        elif self.state == self.STATE_RESULT:
            self.result_card.update(dt)

    def _render(self):
        sw, sh = self.screen.get_size()
        self.screen.fill(COLOR_BG)

        for x in range(0, sw, 40):
            pygame.draw.line(self.screen, (20, 26, 35), (x, 0), (x, sh), 1)
        for y in range(0, sh, 40):
            pygame.draw.line(self.screen, (20, 26, 35), (0, y), (sw, y), 1)

        self._render_header()

        if self.state in [self.STATE_INTRO, self.STATE_COUNTDOWN, self.STATE_PLAYING]:
            self._render_radar_panel()
            self._render_camera_and_zone_panel()

            if self.state == self.STATE_COUNTDOWN:
                self._render_countdown_overlay()
            elif self.state == self.STATE_INTRO:
                self._render_intro_overlay()

        elif self.state == self.STATE_RESULT:
            self._render_radar_panel()
            self._render_camera_and_zone_panel()
            
            overlay = pygame.Surface((sw, sh), pygame.SRCALPHA)
            overlay.fill((10, 15, 22, 195))
            self.screen.blit(overlay, (0, 0))
            
            results = self.stat_engine.calculate_results()
            stats_dict = self.stat_engine.get_all_stats()
            self.result_card.draw(self.screen, results, stats_dict, self.fonts)

        self._render_footer()

    def _render_header(self):
        sw = self.screen.get_width()
        pygame.draw.rect(self.screen, COLOR_PANEL_BG, (0, 0, sw, 65))
        pygame.draw.line(self.screen, COLOR_BORDER, (0, 65), (sw, 65), 1)

        title_surf = self.fonts["lg"].render("ORU AVERAGE MALAYALI", True, COLOR_ACCENT_CYAN)
        act_surf = self.fonts["sm"].render("ACT 2: INDIAN EDUCATION MACHINE", True, COLOR_TEXT_MUTED)
        track_surf = self.fonts["xs"].render(f"TRACK: {self.career_track_title.upper()}", True, COLOR_ACCENT_GOLD)

        self.screen.blit(title_surf, (20, 8))
        self.screen.blit(act_surf, (20, 36))
        self.screen.blit(track_surf, (280, 36))

        # 60s Countdown Timer
        timer_rect = pygame.Rect(sw // 2 - 80, 8, 160, 48)
        if self.round_time_left > 20:
            timer_color = COLOR_ACCENT_CYAN
            timer_bg = (13, 40, 38)
        elif self.round_time_left > 10:
            timer_color = COLOR_ACCENT_GOLD
            timer_bg = (45, 38, 15)
        else:
            flash = int(time.time() * 6) % 2 == 0
            timer_color = COLOR_ALERT_RED if flash else (255, 255, 255)
            timer_bg = (55, 15, 20)

        pygame.draw.rect(self.screen, timer_bg, timer_rect, border_radius=8)
        pygame.draw.rect(self.screen, timer_color, timer_rect, width=2, border_radius=8)

        time_str = f"00:{int(self.round_time_left):02d}"
        t_surf = self.fonts["timer"].render(time_str, True, timer_color)
        self.screen.blit(t_surf, (timer_rect.centerx - t_surf.get_width() // 2, timer_rect.centery - t_surf.get_height() // 2))

        mode_text = "MOUSE MODE (M)" if self.hand_tracker.use_mouse_fallback else "LIVE WEBCAM FOREFINGER TRACKING"
        mode_col = COLOR_ACCENT_GOLD if self.hand_tracker.use_mouse_fallback else COLOR_ACCENT_CYAN
        m_surf = self.fonts["xs"].render(mode_text, True, mode_col)
        self.screen.blit(m_surf, (sw - m_surf.get_width() - 20, 24))

    def _render_radar_panel(self):
        stats_dict = self.stat_engine.get_all_stats()
        panel_rect = pygame.Rect(20, 78, 620, 595)
        pygame.draw.rect(self.screen, COLOR_PANEL_BG, panel_rect, border_radius=12)
        pygame.draw.rect(self.screen, COLOR_BORDER, panel_rect, width=1, border_radius=12)

        h_surf = self.fonts["md"].render("LIVE 8-AXIS SEMESTER RADAR", True, COLOR_TEXT_PRIMARY)
        self.screen.blit(h_surf, (36, 92))

        mental = stats_dict.get("mental_health", 50)
        m_bar_x = 310
        m_lbl = self.fonts["xs"].render("SANITY INTEGRITY:", True, COLOR_TEXT_MUTED)
        self.screen.blit(m_lbl, (m_bar_x, 95))
        
        pygame.draw.rect(self.screen, (40, 20, 25), (m_bar_x + 115, 95, 140, 14), border_radius=4)
        fill_w = int(140 * (mental / 100.0))
        bar_col = COLOR_ALERT_RED if mental < 35 else (COLOR_ACCENT_GOLD if mental < 65 else COLOR_ACCENT_CYAN)
        if fill_w > 0:
            pygame.draw.rect(self.screen, bar_col, (m_bar_x + 115, 95, fill_w, 14), border_radius=4)
            
        m_val = self.fonts["xs"].render(f"{int(mental)}%", True, bar_col)
        self.screen.blit(m_val, (m_bar_x + 115 + 148, 95))

        self.radar_chart.cx = panel_rect.centerx
        self.radar_chart.cy = panel_rect.centery + 15
        self.radar_chart.draw(self.screen, stats_dict, self.fonts["sm"], self.fonts["xs"])

    def _render_camera_and_zone_panel(self):
        sw = self.screen.get_width()
        panel_rect = pygame.Rect(655, 78, sw - 675, 595)
        pygame.draw.rect(self.screen, COLOR_PANEL_BG, panel_rect, border_radius=12)
        pygame.draw.rect(self.screen, COLOR_BORDER, panel_rect, width=1, border_radius=12)

        # 1. Large High-Clarity Camera View
        cam_w = 340
        cam_h = 255
        cam_x = panel_rect.x + 16
        cam_y = panel_rect.y + 16

        pygame.draw.rect(self.screen, (10, 12, 16), (cam_x, cam_y, cam_w, cam_h), border_radius=8)

        if self.webcam_frame is not None:
            try:
                resized = cv2.resize(self.webcam_frame, (cam_w, cam_h))
                frame_surf = pygame.image.frombuffer(resized.tobytes(), (cam_w, cam_h), "RGB")
                self.screen.blit(frame_surf, (cam_x, cam_y))
            except Exception as e:
                print(f"[Act2] Video blit error: {e}")

        border_col = COLOR_ACCENT_CYAN if self.hand_detected else (80, 90, 110)
        pygame.draw.rect(self.screen, border_col, (cam_x, cam_y, cam_w, cam_h), width=2, border_radius=8)

        feed_lbl = "SELF-VIEW CAMERA (POINT FOREFINGER)" if self.hand_detected else "SEARCHING FOR HAND..."
        feed_col = COLOR_ACCENT_CYAN if self.hand_detected else (240, 120, 120)
        f_surf = self.fonts["xs"].render(feed_lbl, True, feed_col)
        self.screen.blit(f_surf, (cam_x + 10, cam_y + 8))

        # 2. Zone Compass
        compass_cx = cam_x + cam_w + 120
        compass_cy = cam_y + cam_h // 2
        compass_r = 85
        self._render_compass(compass_cx, compass_cy, compass_r)

        # 3. Active Zone Info Card
        card_y = cam_y + cam_h + 16
        card_w = panel_rect.width - 32
        card_h = 100

        pygame.draw.rect(self.screen, (30, 38, 50), (cam_x, card_y, card_w, card_h), border_radius=10)

        if self.active_zone_info and not self.active_zone_info["is_dead_zone"]:
            zone = self.active_zone_info["zone"]
            pygame.draw.rect(self.screen, zone["color"], (cam_x, card_y, card_w, card_h), width=2, border_radius=10)

            name_surf = self.fonts["lg"].render(f"ACTIVE: {zone['name'].upper()} ({zone['direction']})", True, zone["color"])
            slang_surf = self.fonts["md"].render(f"\"{zone['slang']}\"", True, (255, 255, 255))
            trade_surf = self.fonts["sm"].render(f"Tradeoffs: {zone['flavor']}", True, COLOR_ACCENT_GOLD)

            self.screen.blit(name_surf, (cam_x + 16, card_y + 10))
            self.screen.blit(slang_surf, (cam_x + 16, card_y + 38))
            self.screen.blit(trade_surf, (cam_x + 16, card_y + 68))
        else:
            pygame.draw.rect(self.screen, (70, 80, 95), (cam_x, card_y, card_w, card_h), width=1, border_radius=10)
            idle_surf = self.fonts["md"].render("CENTER DEAD-ZONE (RESTING)", True, COLOR_TEXT_MUTED)
            sub_surf = self.fonts["sm"].render("Point your forefinger outward in any direction to balance life!", True, (200, 210, 220))
            decay_surf = self.fonts["xs"].render("Warning: Mental Stability is passively decaying...", True, COLOR_ALERT_RED)

            self.screen.blit(idle_surf, (cam_x + 16, card_y + 12))
            self.screen.blit(sub_surf, (cam_x + 16, card_y + 40))
            self.screen.blit(decay_surf, (cam_x + 16, card_y + 68))

        # 4. Stat Meter Bars
        bars_y = card_y + card_h + 14
        self._render_stat_bars(cam_x, bars_y, card_w)

    def _render_compass(self, cx, cy, r):
        pygame.draw.circle(self.screen, (20, 28, 40), (cx, cy), r)
        pygame.draw.circle(self.screen, COLOR_BORDER, (cx, cy), r, 1)

        dz_px = int(r * 0.35)
        pygame.draw.circle(self.screen, (35, 45, 60), (cx, cy), dz_px)
        pygame.draw.circle(self.screen, (60, 75, 100), (cx, cy), dz_px, 1)

        active_idx = self.active_zone_info["zone_index"] if self.active_zone_info and not self.active_zone_info["is_dead_zone"] else None

        for i, zone in enumerate(ZONES):
            rad = math.radians(zone["angle_center"])
            dx = math.cos(rad) * (r * 0.72)
            dy = math.sin(rad) * (r * 0.72)
            
            px = int(cx + dx)
            py = int(cy + dy)

            is_active = (i == active_idx)
            dot_rad = 12 if is_active else 6
            dot_col = zone["color"] if is_active else (80, 95, 120)

            if is_active:
                glow_s = pygame.Surface((36, 36), pygame.SRCALPHA)
                pygame.draw.circle(glow_s, (*zone["color"], 120), (18, 18), 16)
                self.screen.blit(glow_s, (px - 18, py - 18))

            pygame.draw.circle(self.screen, dot_col, (px, py), dot_rad)

        nx, ny = self.norm_hand_pos
        ptr_x = int(cx + nx * (r * 0.85))
        ptr_y = int(cy + ny * (r * 0.85))

        pygame.draw.line(self.screen, (100, 120, 160), (cx, cy), (ptr_x, ptr_y), 2)
        pygame.draw.circle(self.screen, COLOR_ACCENT_CYAN, (ptr_x, ptr_y), 7)
        pygame.draw.circle(self.screen, (255, 255, 255), (ptr_x, ptr_y), 3)

    def _render_stat_bars(self, x, y, w):
        stats = self.stat_engine.get_all_stats()
        meta = self.stat_engine.STAT_META
        display_keys = ["assignments", "hackathon", "placement", "club", "sleep", "friends", "record"]
        bar_h = 9
        gap = 21

        for i, k in enumerate(display_keys):
            row_y = y + i * gap
            val = stats.get(k, 0.0)
            m = meta[k]

            lbl = self.fonts["xs"].render(m["name"][:16], True, COLOR_TEXT_MUTED)
            self.screen.blit(lbl, (x, row_y))

            bx = x + 130
            bw = w - 190
            pygame.draw.rect(self.screen, (35, 42, 54), (bx, row_y + 2, bw, bar_h), border_radius=3)

            fw = int(bw * (val / 100.0))
            if fw > 0:
                pygame.draw.rect(self.screen, m["color"], (bx, row_y + 2, fw, bar_h), border_radius=3)

            val_str = f"{int(val)}%"
            val_surf = self.fonts["xs"].render(val_str, True, (255, 255, 255))
            self.screen.blit(val_surf, (bx + bw + 10, row_y))

    def _render_countdown_overlay(self):
        sw, sh = self.screen.get_size()
        overlay = pygame.Surface((sw, sh), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 160))
        self.screen.blit(overlay, (0, 0))

        num = int(math.ceil(self.countdown_timer))
        num_str = str(num) if num > 0 else "GO!"
        txt = self.fonts["huge"].render(num_str, True, COLOR_ACCENT_CYAN)
        sub = self.fonts["lg"].render("POINT YOUR FOREFINGER TO BALANCE LIFE...", True, (255, 255, 255))

        self.screen.blit(txt, (sw // 2 - txt.get_width() // 2, sh // 2 - 80))
        self.screen.blit(sub, (sw // 2 - sub.get_width() // 2, sh // 2 + 30))

    def _render_intro_overlay(self):
        sw, sh = self.screen.get_size()
        overlay = pygame.Surface((sw, sh), pygame.SRCALPHA)
        overlay.fill((10, 15, 22, 210))
        self.screen.blit(overlay, (0, 0))

        box_w, box_h = 740, 420
        bx = (sw - box_w) // 2
        by = (sh - box_h) // 2

        pygame.draw.rect(self.screen, COLOR_PANEL_BG, (bx, by, box_w, box_h), border_radius=16)
        pygame.draw.rect(self.screen, COLOR_ACCENT_CYAN, (bx, by, box_w, box_h), width=2, border_radius=16)

        t1 = self.fonts["xl"].render("ACT 2: INDIAN EDUCATION MACHINE", True, COLOR_ACCENT_CYAN)
        t2 = self.fonts["md"].render("How to Play:", True, COLOR_ACCENT_GOLD)
        
        lines = [
            "1. Raise your hand in front of the laptop camera and POINT with your forefinger.",
            "2. Point North for Assignments, East for Placement Prep, South for Sleep, etc.",
            "3. Tradeoff Law: Prioritizing one aspect rapidly deteriorates another!",
            "4. Your Mental Stability decays continuously — survive the 60-second semester."
        ]

        self.screen.blit(t1, (bx + box_w // 2 - t1.get_width() // 2, by + 30))
        self.screen.blit(t2, (bx + 40, by + 90))

        for i, line in enumerate(lines):
            l_surf = self.fonts["sm"].render(line, True, COLOR_TEXT_PRIMARY)
            self.screen.blit(l_surf, (bx + 40, by + 130 + i * 32))

        btn_rect = pygame.Rect(bx + box_w // 2 - 180, by + box_h - 90, 360, 50)
        pygame.draw.rect(self.screen, COLOR_ACCENT_CYAN, btn_rect, border_radius=10)
        prompt_txt = self.fonts["lg"].render("PRESS [SPACE] TO START", True, (13, 17, 23))
        self.screen.blit(prompt_txt, (btn_rect.centerx - prompt_txt.get_width() // 2, btn_rect.centery - prompt_txt.get_height() // 2))

    def _render_footer(self):
        sw, sh = self.screen.get_size()
        pygame.draw.rect(self.screen, (10, 13, 18), (0, sh - 35, sw, 35))
        pygame.draw.line(self.screen, COLOR_BORDER, (0, sh - 35), (sw, sh - 35), 1)

        f_text = "[R] Reset Round | [M] Toggle Mouse Control | [F11] Fullscreen | [ESC / Q] Quit"
        foot_surf = self.fonts["xs"].render(f_text, True, COLOR_TEXT_MUTED)
        self.screen.blit(foot_surf, (20, sh - 25))

        event_text = "Useless Projects Hackathon 3.0"
        ev_surf = self.fonts["xs"].render(event_text, True, (90, 105, 125))
        self.screen.blit(ev_surf, (sw - ev_surf.get_width() - 20, sh - 25))


if __name__ == "__main__":
    app = IndianEducationMachine()
    app.run()
