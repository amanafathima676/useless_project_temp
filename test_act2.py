"""
Automated unit verification for Act 2 modules
"""
import zone_mapper
import stat_engine
import audio_synthesizer
import radar_chart
import result_card
import hand_tracker

def test_all():
    print("=== 1. Testing ZoneMapper ===")
    zm = zone_mapper.ZoneMapper(dead_zone_radius=0.18)
    
    # Test center deadzone
    res_center = zm.map_position(0.05, 0.05)
    assert res_center["is_dead_zone"] is True, "Deadzone failed"
    
    # Test North (Assignments): x=0, y=-0.8 (Up is negative Y)
    res_north = zm.map_position(0.0, -0.8)
    assert res_north["is_dead_zone"] is False
    assert res_north["zone"]["id"] == "assignments", f"Expected assignments, got {res_north['zone']['id']}"
    
    # Test East (Placement): x=0.8, y=0.0
    res_east = zm.map_position(0.8, 0.0)
    assert res_east["is_dead_zone"] is False
    assert res_east["zone"]["id"] == "placement", f"Expected placement, got {res_east['zone']['id']}"
    
    # Test South (Sleep): x=0.0, y=0.8 (Down is positive Y)
    res_south = zm.map_position(0.0, 0.8)
    assert res_south["is_dead_zone"] is False
    assert res_south["zone"]["id"] == "sleep", f"Expected sleep, got {res_south['zone']['id']}"

    print("ZoneMapper tests passed!")

    print("=== 2. Testing StatEngine ===")
    se = stat_engine.StatEngine()
    initial_stats = se.get_all_stats()
    print("Initial stats:", initial_stats)

    # Simulate 30 seconds of Hackathon grind
    for _ in range(300):
        se.tick("hackathon", 0.1)

    after_hack = se.get_all_stats()
    print("Stats after 30s Hackathon grind:", after_hack)
    assert after_hack["hackathon"] > initial_stats["hackathon"], "Hackathon stat did not increase"
    assert after_hack["sleep"] < initial_stats["sleep"], "Sleep did not decrease"
    assert after_hack["mental_health"] < initial_stats["mental_health"], "Mental health did not decay"

    results = se.calculate_results()
    print("Result scorecard generated:", results)
    assert "cgpa" in results
    assert "employability" in results
    assert results["punchline"] == "Congratulations. You are now employable."
    print("StatEngine tests passed!")

    print("=== 3. Testing AudioSynthesizer ===")
    audio = audio_synthesizer.AudioSynthesizer()
    print(f"Audio Synthesizer initialized. Enabled: {audio.enabled}")
    if audio.enabled:
        audio.play_tick()
        audio.play_zone_switch()

    print("=== 4. Testing RadarChart and ResultCard classes ===")
    rc = radar_chart.RadarChart(cx=300, cy=300, radius=150)
    assert len(rc.axes) == 8
    card = result_card.ResultCard(1280, 720)
    assert card.card_w == 880

    print("=== ALL ACT 2 UNIT TESTS PASSED WITH 100% SUCCESS! ===")

if __name__ == "__main__":
    test_all()
