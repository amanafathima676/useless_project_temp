"""
Result Card Module for Act 2 (Indian Education Machine)
Renders the satirical "STUDENT STATUS" final evaluation scorecard.
"""

import pygame
import math

class ResultCard:
    def __init__(self, screen_w=1280, screen_h=720):
        self.screen_w = screen_w
        self.screen_h = screen_h
        self.card_w = 880
        self.card_h = 580
        self.x = (screen_w - self.card_w) // 2
        self.y = (screen_h - self.card_h) // 2
        self.anim_alpha = 0.0

    def update(self, dt):
        if self.anim_alpha < 1.0:
            self.anim_alpha = min(1.0, self.anim_alpha + dt * 2.5)

    def draw(self, surface, results, stats_dict, fonts):
        """
        Draws the Student Status card with smooth fade-in and high-polish styling.
        """
        f_title = fonts["xl"]
        f_heading = fonts["lg"]
        f_body = fonts["md"]
        f_sm = fonts["sm"]
        f_bold = fonts["bold"]

        # Card container with dark translucent background & glowing border
        card_surf = pygame.Surface((self.card_w, self.card_h), pygame.SRCALPHA)
        alpha = int(255 * self.anim_alpha)
        
        # Dark slate background with border
        pygame.draw.rect(card_surf, (15, 23, 42, min(245, alpha)), (0, 0, self.card_w, self.card_h), border_radius=16)
        pygame.draw.rect(card_surf, (0, 245, 212, min(200, alpha)), (0, 0, self.card_w, self.card_h), width=2, border_radius=16)

        # 1. Top Header Banner
        pygame.draw.rect(card_surf, (30, 41, 59, min(255, alpha)), (0, 0, self.card_w, 80), border_top_left_radius=16, border_top_right_radius=16)
        pygame.draw.line(card_surf, (51, 65, 85, min(255, alpha)), (0, 80), (self.card_w, 80), 2)

        title_text = f_heading.render("GOVERNMENT OF KERALA - HIGHER EDUCATION EVALUATION", True, (148, 163, 184))
        sub_text = f_title.render("STUDENT FINAL STATUS REPORT", True, (255, 255, 255))
        
        card_surf.blit(title_text, (self.card_w // 2 - title_text.get_width() // 2, 14))
        card_surf.blit(sub_text, (self.card_w // 2 - sub_text.get_width() // 2, 38))

        # 2. Satirical Official Stamp (Top Right)
        stamp_surf = pygame.Surface((180, 50), pygame.SRCALPHA)
        pygame.draw.rect(stamp_surf, (16, 185, 129, min(220, alpha)), (0, 0, 180, 50), width=2, border_radius=8)
        stamp_txt = f_bold.render("EMPLOYABLE", True, (16, 185, 129))
        stamp_sub = f_sm.render("KTU CERTIFIED", True, (52, 211, 153))
        stamp_surf.blit(stamp_txt, (180 // 2 - stamp_txt.get_width() // 2, 8))
        stamp_surf.blit(stamp_sub, (180 // 2 - stamp_sub.get_width() // 2, 28))
        # Rotate slightly for authentic rubber stamp feel
        stamp_rot = pygame.transform.rotate(stamp_surf, -6)
        card_surf.blit(stamp_rot, (self.card_w - 210, 20))

        # 3. Main Metrics Grid (Left side)
        grid_x = 40
        grid_y = 105

        metrics = [
            ("ESTIMATED CGPA", f"{results['cgpa']} / 10.0", (56, 189, 248)),
            ("EMPLOYABILITY QUOTIENT", f"{results['employability']}% (HIGH)", (16, 185, 129)),
            ("CAMPUS PLACEMENT OFFER", f"{results['placement_role']}", (250, 204, 21)),
            ("AMMAVAN APPROVAL RATING", f"{results['relative_approval']}", (129, 140, 248)),
            ("FINAL MENTAL STABILITY", f"{results['mental_health']}% [CRITICAL COLLAPSE]", (239, 68, 68)),
            ("BURNOUT ACCUMULATION", f"{results['burnout']}% [PERMANENT]", (247, 37, 133))
        ]

        for i, (label, val, col) in enumerate(metrics):
            row_y = grid_y + i * 46
            
            # Row background pill
            pygame.draw.rect(card_surf, (30, 41, 59, min(160, alpha)), (grid_x, row_y, 480, 40), border_radius=8)
            
            lbl_surf = f_sm.render(label, True, (148, 163, 184))
            val_surf = f_bold.render(val, True, col)
            
            card_surf.blit(lbl_surf, (grid_x + 14, row_y + 12))
            card_surf.blit(val_surf, (grid_x + 200, row_y + 10))

        # 4. Stat Summary Bars (Right side)
        right_x = 550
        card_surf.blit(f_bold.render("FINAL SEMESTER BREAKDOWN", True, (255, 255, 255)), (right_x, grid_y))

        stat_display_order = [
            ("Assignments", stats_dict.get("assignments", 0), (56, 189, 248)),
            ("Placement Prep", stats_dict.get("placement", 0), (16, 185, 129)),
            ("Hackathon XP", stats_dict.get("hackathon", 0), (250, 204, 21)),
            ("Sleep Left", stats_dict.get("sleep", 0), (129, 140, 248)),
            ("Social / Chai", stats_dict.get("friends", 0), (251, 146, 60)),
            ("Lab Records", stats_dict.get("record", 0), (6, 182, 212)),
            ("Mental Health", stats_dict.get("mental_health", 0), (239, 68, 68)),
        ]

        bar_w = 280
        for i, (name, val, col) in enumerate(stat_display_order):
            by = grid_y + 32 + i * 35
            
            lbl = f_sm.render(name, True, (203, 213, 225))
            card_surf.blit(lbl, (right_x, by))
            
            # Bar background
            pygame.draw.rect(card_surf, (30, 41, 59, min(255, alpha)), (right_x + 110, by + 4, bar_w - 110, 12), border_radius=4)
            # Filled bar
            fill_len = int((bar_w - 110) * (val / 100.0))
            if fill_len > 0:
                pygame.draw.rect(card_surf, col, (right_x + 110, by + 4, fill_len, 12), border_radius=4)
                
            val_lbl = f_sm.render(f"{int(val)}%", True, col)
            card_surf.blit(val_lbl, (right_x + bar_w + 10, by))

        # 5. The Golden Punchline Box (Bottom Center)
        punch_y = self.card_h - 145
        punch_w = self.card_w - 80
        pygame.draw.rect(card_surf, (245, 158, 11, min(40, alpha)), (40, punch_y, punch_w, 65), border_radius=10)
        pygame.draw.rect(card_surf, (245, 158, 11, min(220, alpha)), (40, punch_y, punch_w, 65), width=2, border_radius=10)

        punch_text = f_title.render("“ Congratulations. You are now employable. ”", True, (254, 240, 138))
        card_surf.blit(punch_text, (self.card_w // 2 - punch_text.get_width() // 2, punch_y + 18))

        # 6. Restart & Operator Controls (Bottom Footer)
        footer_y = self.card_h - 55
        instr_text = f_bold.render("PRESS [R] TO RESTART FOR NEXT JUDGE", True, (0, 245, 212))
        sub_instr = f_sm.render("Act 2 - Oru Average Malayali | Useless Projects Hackathon 3.0", True, (100, 116, 139))
        
        card_surf.blit(instr_text, (self.card_w // 2 - instr_text.get_width() // 2, footer_y))
        card_surf.blit(sub_instr, (self.card_w // 2 - sub_instr.get_width() // 2, footer_y + 24))

        # Blit whole card to screen
        surface.blit(card_surf, (self.x, self.y))
