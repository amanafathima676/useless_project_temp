"""
Zone Mapper Module for Act 2 (Indian Education Machine)
Maps (x, y) offset from center into 8 discrete college-life directional zones
with center dead-zone filtering.
"""

import math

# Directional Zones with metadata
ZONES = [
    {
        "id": "assignments",
        "name": "Assignments",
        "direction": "NORTH",
        "angle_center": 270,  # Up
        "color": (56, 189, 248),  # Sky Blue
        "hex": "#38bdf8",
        "icon": "[ASSIGN]",
        "slang": "Copying senior's assignment at 2 AM",
        "flavor": "+Assignments | -Sleep"
    },
    {
        "id": "hackathon",
        "name": "Hackathon",
        "direction": "NORTH-EAST",
        "angle_center": 315,  # Up-Right
        "color": (250, 204, 21),  # Amber Yellow
        "hex": "#facc15",
        "icon": "[HACK]",
        "slang": "36-hr Red Bull sprint with ChatGPT",
        "flavor": "+Hackathon | -Friends, -Sleep"
    },
    {
        "id": "placement",
        "name": "Placement Prep",
        "direction": "EAST",
        "angle_center": 0,  # Right
        "color": (16, 185, 129),  # Emerald Green
        "hex": "#10b981",
        "icon": "[PLACEMT]",
        "slang": "Grinding LeetCode & Aptitude tests",
        "flavor": "+Placement | -Club Activities"
    },
    {
        "id": "club",
        "name": "Club Activities",
        "direction": "SOUTH-EAST",
        "angle_center": 45,  # Down-Right
        "color": (236, 72, 153),  # Pink/Magenta
        "hex": "#ec4899",
        "icon": "[CLUB]",
        "slang": "College fest coordinator drama",
        "flavor": "+Club | -Assignments"
    },
    {
        "id": "sleep",
        "name": "Sleep",
        "direction": "SOUTH",
        "angle_center": 90,  # Down
        "color": (129, 140, 248),  # Indigo
        "hex": "#818cf8",
        "icon": "[SLEEP]",
        "slang": "Passing out on hostel bed",
        "flavor": "+Sleep | -Placement"
    },
    {
        "id": "friends",
        "name": "Friends & Chai",
        "direction": "SOUTH-WEST",
        "angle_center": 135,  # Down-Left
        "color": (251, 146, 60),  # Orange
        "hex": "#fb923c",
        "icon": "[CHAI]",
        "slang": "Canteen Sulaimani & life debate",
        "flavor": "+Friends | -Record"
    },
    {
        "id": "mental_health",
        "name": "Panic / Cope",
        "direction": "WEST",
        "angle_center": 180,  # Left
        "color": (248, 113, 113),  # Red
        "hex": "#f87171",
        "icon": "[COPE]",
        "slang": "Staring at ceiling questioning life",
        "flavor": "Trying to stop mental health decay"
    },
    {
        "id": "record",
        "name": "Lab Record",
        "direction": "NORTH-WEST",
        "angle_center": 225,  # Up-Left
        "color": (6, 182, 212),  # Cyan
        "hex": "#06b6d4",
        "icon": "[RECORD]",
        "slang": "Drawing circuit diagrams in ink",
        "flavor": "+Record | -Sleep, -Friends"
    }
]


class ZoneMapper:
    def __init__(self, dead_zone_radius=0.18):
        self.dead_zone_radius = dead_zone_radius  # Radius in normalized [-1, 1] units
        self.zones = ZONES
        self.num_zones = len(ZONES)
        self.sector_angle = 360.0 / self.num_zones  # 45 degrees per sector

    def map_position(self, norm_x, norm_y):
        """
        Takes normalized (x, y) coordinates where (0, 0) is screen center,
        x in [-1, 1], y in [-1, 1] (+y is down).
        
        Returns:
            dict: {
                'is_dead_zone': bool,
                'distance': float,
                'angle_deg': float,
                'zone_index': int (or None if dead zone),
                'zone': dict (or None if dead zone)
            }
        """
        distance = math.sqrt(norm_x * norm_x + norm_y * norm_y)
        
        if distance < self.dead_zone_radius:
            return {
                "is_dead_zone": True,
                "distance": distance,
                "angle_deg": 0.0,
                "zone_index": None,
                "zone": None
            }
            
        # atan2 gives angle from positive x-axis (Right = 0 rad, Down = +pi/2, Up = -pi/2)
        angle_rad = math.atan2(norm_y, norm_x)
        angle_deg = math.degrees(angle_rad)
        if angle_deg < 0:
            angle_deg += 360.0
            
        # Each sector spans [center - 22.5, center + 22.5]
        # Sector 0 (Assignments / North) is centered at 270 deg
        # Sector 2 (Placement / East) is centered at 0 deg
        # Offset angle by 22.5 deg to align sector boundaries cleanly
        shifted_angle = (angle_deg + 22.5) % 360.0
        sector_idx = int(shifted_angle // 45.0)
        
        # Mapping sector_idx (where 0 is around 0° East) to our ZONES list:
        # 0 -> Placement (East) -> index 2
        # 1 -> Club (South-East) -> index 3
        # 2 -> Sleep (South) -> index 4
        # 3 -> Friends (South-West) -> index 5
        # 4 -> Cope (West) -> index 6
        # 5 -> Record (North-West) -> index 7
        # 6 -> Assignments (North) -> index 0
        # 7 -> Hackathon (North-East) -> index 1
        zone_map_table = [2, 3, 4, 5, 6, 7, 0, 1]
        active_zone_idx = zone_map_table[sector_idx]
        
        return {
            "is_dead_zone": False,
            "distance": min(1.0, distance),
            "angle_deg": angle_deg,
            "zone_index": active_zone_idx,
            "zone": self.zones[active_zone_idx]
        }
