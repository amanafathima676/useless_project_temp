"""
Procedural Audio Synthesizer for Act 2 (Indian Education Machine)
Synthesizes game audio & tension soundscapes directly in Python via NumPy and Pygame Mixer.
Zero external audio files required.
"""

import math
import numpy as np
import pygame
import time

class AudioSynthesizer:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate
        self.enabled = False
        self.heartbeat_timer = 0.0
        self.last_heartbeat_time = 0.0

        try:
            pygame.mixer.init(frequency=sample_rate, size=-16, channels=2, buffer=512)
            self.enabled = True
            print("[AudioSynthesizer] Audio mixer initialized successfully.")
            
            # Pre-generate procedural sound effects
            self.snd_tick = self._make_sound(self._gen_tick(freq=880, duration=0.03))
            self.snd_blip = self._make_sound(self._gen_blip(freq=600, duration=0.06))
            self.snd_zone_switch = self._make_sound(self._gen_chirp(start_freq=400, end_freq=800, duration=0.08))
            self.snd_panic = self._make_sound(self._gen_beep(freq=1200, duration=0.08))
            self.snd_heartbeat = self._make_sound(self._gen_heartbeat(duration=0.12))
            self.snd_buzzer = self._make_sound(self._gen_buzzer(duration=0.8))
            self.snd_success = self._make_sound(self._gen_fanfare(duration=0.6))
        except Exception as e:
            print(f"[AudioSynthesizer] Warning: Audio init failed ({e}). Running in silent mode.")
            self.enabled = False

    def _make_sound(self, samples):
        """Converts float numpy array (-1.0 to 1.0) into a stereo Pygame Sound object."""
        if not self.enabled:
            return None
        # Convert to 16-bit signed integers
        int_samples = (samples * 32767).astype(np.int16)
        # Duplicate for stereo
        stereo_samples = np.column_stack((int_samples, int_samples))
        return pygame.sndarray.make_sound(stereo_samples)

    def _gen_tick(self, freq=800, duration=0.03):
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        # Exponential decay envelope
        env = np.exp(-t * 90)
        wave = np.sin(2 * np.pi * freq * t) * env * 0.4
        return wave

    def _gen_blip(self, freq=600, duration=0.06):
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        env = np.sin(np.pi * t / duration) ** 2
        wave = np.sin(2 * np.pi * freq * t) * env * 0.3
        return wave

    def _gen_chirp(self, start_freq=400, end_freq=850, duration=0.08):
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        freqs = np.linspace(start_freq, end_freq, len(t))
        phase = 2 * np.pi * np.cumsum(freqs) / self.sample_rate
        env = np.sin(np.pi * t / duration)
        return np.sin(phase) * env * 0.35

    def _gen_beep(self, freq=1200, duration=0.08):
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        env = np.exp(-t * 30)
        return np.sin(2 * np.pi * freq * t) * env * 0.5

    def _gen_heartbeat(self, duration=0.12):
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        env = np.exp(-t * 25)
        # Low thud at 65 Hz
        thud = np.sin(2 * np.pi * 65 * t) * env * 0.7
        return thud

    def _gen_buzzer(self, duration=0.8):
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        # Buzz tone combining 180Hz + 360Hz with decaying envelope
        env = np.exp(-t * 3.0)
        buzz = (0.6 * np.sin(2 * np.pi * 180 * t) + 0.4 * np.sin(2 * np.pi * 360 * t)) * env * 0.6
        return buzz

    def _gen_fanfare(self, duration=0.6):
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        # Harmonious major chord
        chord = (
            0.4 * np.sin(2 * np.pi * 523.25 * t) +  # C5
            0.3 * np.sin(2 * np.pi * 659.25 * t) +  # E5
            0.3 * np.sin(2 * np.pi * 783.99 * t)    # G5
        ) * np.exp(-t * 2.5) * 0.5
        return chord

    def play_tick(self):
        if self.enabled and self.snd_tick:
            self.snd_tick.play()

    def play_zone_switch(self):
        if self.enabled and self.snd_zone_switch:
            self.snd_zone_switch.play()

    def play_panic(self):
        if self.enabled and self.snd_panic:
            self.snd_panic.play()

    def play_buzzer(self):
        if self.enabled and self.snd_buzzer:
            self.snd_buzzer.play()

    def play_success(self):
        if self.enabled and self.snd_success:
            self.snd_success.play()

    def update_tension(self, mental_health, time_remaining, dt):
        """
        Dynamically pulses heartbeat sounds faster as Mental Health drops or time runs out.
        """
        if not self.enabled or not self.snd_heartbeat:
            return

        # Calculate heartbeat interval: 1.2s at 100% sanity down to 0.35s at 0% sanity
        sanity_factor = max(0.0, min(1.0, mental_health / 100.0))
        heartbeat_interval = 0.35 + 0.85 * sanity_factor

        current_time = time.time()
        if current_time - self.last_heartbeat_time >= heartbeat_interval:
            self.last_heartbeat_time = current_time
            self.snd_heartbeat.play()
