"""
Hand Tracker Module for Act 2 (Indian Education Machine)
Specialized for:
1. High-precision Forefinger (Index Finger Tip) Tracking via MediaPipe HandLandmarker
2. Full hand skeleton rendering & cyber HUD reticle on the index fingertip
3. Visual directional axes & deadzone ring overlaid directly on the mirror video feed
4. Multi-backend camera initialization with MJPG codec & sensor warmup
"""

import cv2
import numpy as np
import time
import os
import math

try:
    import mediapipe as mp
    from mediapipe.tasks import python
    from mediapipe.tasks.python import vision
    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False

HAND_CONNECTIONS = [
    (0, 1), (1, 2), (2, 3), (3, 4),        # Thumb
    (0, 5), (5, 6), (6, 7), (7, 8),        # Index finger (Forefinger)
    (5, 9), (9, 10), (10, 11), (11, 12),   # Middle finger
    (9, 13), (13, 14), (14, 15), (15, 16), # Ring finger
    (13, 17), (17, 18), (18, 19), (19, 20),# Pinky
    (0, 17)                                # Palm base
]


class HandTracker:
    def __init__(self, model_path="hand_landmarker.task", camera_id=0, smoothing_factor=0.40):
        self.camera_id = camera_id
        self.smoothing_factor = smoothing_factor
        self.model_path = model_path
        
        # Forefinger normalized coordinates: x in [-1.0, 1.0], y in [-1.0, 1.0] from center
        self.smoothed_x = 0.0
        self.smoothed_y = 0.0
        self.raw_x = 0.0
        self.raw_y = 0.0
        self.hand_detected = False
        self.forefinger_px = None
        
        # Mode & status
        self.use_mouse_fallback = False
        self.use_opencv_fallback = False
        self.detector = None
        self.cap = None
        self.hud_pulse = 0.0
        self.cam_status_msg = "SEARCHING FOR CAMERA..."
        
        # Initialize camera
        self._init_camera()
        
        # Initialize MediaPipe detector
        if MEDIAPIPE_AVAILABLE and os.path.exists(self.model_path):
            try:
                base_options = python.BaseOptions(model_asset_path=self.model_path)
                options = vision.HandLandmarkerOptions(
                    base_options=base_options,
                    num_hands=1,
                    min_hand_detection_confidence=0.30,
                    min_hand_presence_confidence=0.30,
                    min_tracking_confidence=0.30
                )
                self.detector = vision.HandLandmarker.create_from_options(options)
                print("[HandTracker] MediaPipe Forefinger Tracker initialized.")
            except Exception as e:
                print(f"[HandTracker] MediaPipe init error: {e}. Using OpenCV fallback.")
                self.use_opencv_fallback = True
        else:
            self.use_opencv_fallback = True

    def _init_camera(self):
        """Attempts to open camera across multiple backends and indices with MJPG codec & warmup."""
        backends = [cv2.CAP_DSHOW, cv2.CAP_MSMF, cv2.CAP_ANY]
        opened = False
        
        for cam_idx in [0, 1, 2]:
            for backend in backends:
                try:
                    cap = cv2.VideoCapture(cam_idx, backend)
                    if cap.isOpened():
                        # Set MJPG for crisp uncompressed transfer
                        try:
                            cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc('M', 'J', 'P', 'G'))
                        except Exception:
                            pass
                        
                        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                        cap.set(cv2.CAP_PROP_FPS, 30)

                        # Warmup reads to flush initial blank/dark frames
                        for _ in range(5):
                            cap.read()

                        ret, test_frame = cap.read()
                        if ret and test_frame is not None:
                            self.cap = cap
                            self.use_mouse_fallback = False
                            self.cam_status_msg = f"CAMERA READY (CAM {cam_idx})"
                            print(f"[HandTracker] Webcam initialized on index {cam_idx} with backend {backend}.")
                            opened = True
                            break
                        else:
                            cap.release()
                except Exception:
                    pass
            if opened:
                break

        if not opened:
            print("[HandTracker] Notice: Laptop webcam is currently unavailable. Using Mouse mode as backup.")
            self.use_mouse_fallback = True
            self.cam_status_msg = "WEBCAM DISABLED (PRESS F10 OR OPEN SHUTTER)"

    def retry_camera_init(self):
        if self.cap is None or not self.cap.isOpened():
            self._init_camera()
            return self.cap is not None and self.cap.isOpened()
        return True

    def set_mouse_position(self, screen_w, screen_h, mouse_x, mouse_y):
        if self.use_mouse_fallback:
            norm_x = (mouse_x - (screen_w / 2.0)) / (screen_w / 2.0)
            norm_y = (mouse_y - (screen_h / 2.0)) / (screen_h / 2.0)
            
            norm_x = max(-1.0, min(1.0, norm_x))
            norm_y = max(-1.0, min(1.0, norm_y))
            
            self.raw_x = norm_x
            self.raw_y = norm_y
            self.smoothed_x = norm_x
            self.smoothed_y = norm_y
            self.hand_detected = True

    def toggle_mouse_fallback(self):
        self.use_mouse_fallback = not self.use_mouse_fallback
        if not self.use_mouse_fallback:
            self.retry_camera_init()
        print(f"[HandTracker] Mouse fallback toggled: {self.use_mouse_fallback}")
        return self.use_mouse_fallback

    def process_frame(self):
        """
        Reads camera frame, tracks index finger tip, draws skeleton & HUD on the mirror frame.
        Returns: (frame_rgb, is_detected, (smoothed_x, smoothed_y), forefinger_px)
        """
        self.hud_pulse += 0.15

        if self.use_mouse_fallback or self.cap is None or not self.cap.isOpened():
            dummy = np.zeros((480, 640, 3), dtype=np.uint8)
            cv2.putText(dummy, "CAMERA NOT DETECTED / DISABLED", (20, 180),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (239, 68, 68), 2)
            cv2.putText(dummy, "1. Open camera shutter slider on bezel", (20, 225),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 209, 102), 1)
            cv2.putText(dummy, "2. Press [Fn + F10] to enable camera", (20, 255),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 209, 102), 1)
            cv2.putText(dummy, "3. Or use MOUSE CONTROL (Active now)", (20, 285),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 245, 212), 1)

            cx = int(320 + self.smoothed_x * 260)
            cy = int(240 + self.smoothed_y * 180)
            cv2.circle(dummy, (cx, cy), 14, (0, 245, 212), -1)
            cv2.circle(dummy, (cx, cy), 20, (0, 255, 255), 2)
            return dummy, self.hand_detected, (self.smoothed_x, self.smoothed_y), (cx, cy)

        ret, frame = self.cap.read()
        if not ret or frame is None:
            return None, False, (self.smoothed_x, self.smoothed_y), None

        # Mirror frame horizontally so it acts like a natural mirror
        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        
        detected = False
        target_x, target_y = 0.0, 0.0
        forefinger_px = None

        # 1. MediaPipe Forefinger Detection
        if self.detector is not None and not self.use_opencv_fallback:
            try:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
                result = self.detector.detect(mp_image)
                
                if result.hand_landmarks and len(result.hand_landmarks) > 0:
                    hand = result.hand_landmarks[0]
                    detected = True
                    
                    px_landmarks = [(int(lm.x * w), int(lm.y * h)) for lm in hand]
                    
                    # Draw Skeleton
                    for p1_idx, p2_idx in HAND_CONNECTIONS:
                        pt1 = px_landmarks[p1_idx]
                        pt2 = px_landmarks[p2_idx]
                        if p1_idx in [5, 6, 7] or p2_idx in [6, 7, 8]:
                            cv2.line(frame, pt1, pt2, (0, 255, 255), 3)
                        else:
                            cv2.line(frame, pt1, pt2, (200, 150, 50), 2)

                    # Draw Joints
                    for idx, (lx, ly) in enumerate(px_landmarks):
                        if idx == 8:
                            continue
                        cv2.circle(frame, (lx, ly), 4, (0, 245, 212), -1)

                    # Forefinger Tip = landmark 8
                    idx_tip = hand[8]
                    forefinger_px = (int(idx_tip.x * w), int(idx_tip.y * h))
                    
                    target_x = (idx_tip.x - 0.5) * 2.0
                    target_y = (idx_tip.y - 0.5) * 2.0

            except Exception:
                detected = False

        # 2. OpenCV Skin/Contour Fallback
        if not detected and (self.use_opencv_fallback or self.detector is None):
            hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
            lower_skin = np.array([0, 25, 40], dtype=np.uint8)
            upper_skin = np.array([30, 255, 255], dtype=np.uint8)
            mask = cv2.inRange(hsv, lower_skin, upper_skin)
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel, iterations=2)
            mask = cv2.dilate(mask, kernel, iterations=2)
            
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            if contours:
                largest_c = max(contours, key=cv2.contourArea)
                if cv2.contourArea(largest_c) > 1500:
                    topmost = tuple(largest_c[largest_c[:, :, 1].argmin()][0])
                    detected = True
                    forefinger_px = topmost
                    target_x = (topmost[0] / float(w) - 0.5) * 2.0
                    target_y = (topmost[1] / float(h) - 0.5) * 2.0

        if detected:
            self.hand_detected = True
            self.raw_x = target_x
            self.raw_y = target_y
            self.smoothed_x = (self.smoothing_factor * target_x) + ((1.0 - self.smoothing_factor) * self.smoothed_x)
            self.smoothed_y = (self.smoothing_factor * target_y) + ((1.0 - self.smoothing_factor) * self.smoothed_y)
        else:
            self.hand_detected = False
            self.smoothed_x *= 0.88
            self.smoothed_y *= 0.88

        self.smoothed_x = max(-1.0, min(1.0, self.smoothed_x))
        self.smoothed_y = max(-1.0, min(1.0, self.smoothed_y))

        # 3. Draw Cyber HUD
        self._draw_hud(frame, w, h, forefinger_px)

        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        return np.ascontiguousarray(rgb_frame), self.hand_detected, (self.smoothed_x, self.smoothed_y), forefinger_px

    def _draw_hud(self, frame, w, h, forefinger_px):
        cx, cy = w // 2, h // 2
        dead_r = int(w * 0.18 * 0.5)
        cv2.circle(frame, (cx, cy), dead_r, (80, 80, 80), 1, cv2.LINE_AA)
        cv2.line(frame, (cx - 15, cy), (cx + 15, cy), (100, 100, 100), 1)
        cv2.line(frame, (cx, cy - 15), (cx, cy + 15), (100, 100, 100), 1)

        if forefinger_px is not None and self.hand_detected:
            fx, fy = forefinger_px
            pulse_r = int(18 + 4 * math.sin(self.hud_pulse))
            cv2.circle(frame, (fx, fy), pulse_r, (0, 245, 212), 2, cv2.LINE_AA)
            cv2.circle(frame, (fx, fy), 5, (0, 255, 255), -1, cv2.LINE_AA)
            
            b_len = 10
            cv2.line(frame, (fx - pulse_r - 4, fy), (fx - pulse_r - 4 + b_len, fy), (0, 245, 212), 2)
            cv2.line(frame, (fx + pulse_r + 4, fy), (fx + pulse_r + 4 - b_len, fy), (0, 245, 212), 2)
            cv2.line(frame, (fx, fy - pulse_r - 4), (fx, fy - pulse_r - 4 + b_len), (0, 245, 212), 2)
            cv2.line(frame, (fx, fy + pulse_r + 4), (fx, fy + pulse_r + 4 - b_len), (0, 245, 212), 2)
            cv2.line(frame, (cx, cy), (fx, fy), (0, 200, 255), 1, cv2.LINE_AA)
            
            cv2.putText(frame, "FOREFINGER LOCKED", (fx + 22, fy - 8),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1, cv2.LINE_AA)
        else:
            cv2.putText(frame, "SEARCHING FOR HAND...", (10, 25),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.45, (239, 68, 68), 1, cv2.LINE_AA)
            cv2.putText(frame, "POINT FOREFINGER TOWARDS CAMERA", (cx - 150, h - 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (160, 180, 200), 1, cv2.LINE_AA)

    def release(self):
        if self.cap is not None and self.cap.isOpened():
            self.cap.release()
