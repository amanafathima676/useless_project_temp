/**
 * Automated Unit Verification for Act 2 JavaScript Modules (4-Directional System)
 * Directly translates test_act2.py to Node.js assertions.
 */

const assert = require("assert");
const { ZoneMapper, ZONES } = require("./js/zone-mapper.js");
const StatEngine = require("./js/stat-engine.js");
const AudioSynthesizer = require("./js/audio-synthesizer.js");
const ResultCard = require("./js/result-card.js");

function testAll() {
  console.log("=== 1. Testing 4-Direction ZoneMapper ===");
  const zm = new ZoneMapper(0.18);

  // Test center deadzone
  const resCenter = zm.mapPosition(0.05, 0.05);
  assert.strictEqual(resCenter.is_dead_zone, true, "Deadzone failed");
  console.log("[OK] Deadzone verified");

  // Test UP (Academics): x=0, y=-0.8 (Up is negative Y)
  const resUp = zm.mapPosition(0.0, -0.8);
  assert.strictEqual(resUp.is_dead_zone, false);
  assert.strictEqual(resUp.zone.id, "academics", `Expected academics, got ${resUp.zone.id}`);
  assert.strictEqual(resUp.zone.decreases, "arts_sports");
  console.log("[OK] UP -> Academics verified");

  // Test RIGHT (Hackathons): x=0.8, y=0.0 (Right is positive X)
  const resRight = zm.mapPosition(0.8, 0.0);
  assert.strictEqual(resRight.is_dead_zone, false);
  assert.strictEqual(resRight.zone.id, "hackathons", `Expected hackathons, got ${resRight.zone.id}`);
  assert.strictEqual(resRight.zone.decreases, "academics");
  console.log("[OK] RIGHT -> Hackathons verified");

  // Test DOWN (Skill Dev): x=0.0, y=0.8 (Down is positive Y)
  const resDown = zm.mapPosition(0.0, 0.8);
  assert.strictEqual(resDown.is_dead_zone, false);
  assert.strictEqual(resDown.zone.id, "skill_dev", `Expected skill_dev, got ${resDown.zone.id}`);
  assert.strictEqual(resDown.zone.decreases, "hackathons");
  console.log("[OK] DOWN -> Skill Dev verified");

  // Test LEFT (Arts & Sports): x=-0.8, y=0.0 (Left is negative X)
  const resLeft = zm.mapPosition(-0.8, 0.0);
  assert.strictEqual(resLeft.is_dead_zone, false);
  assert.strictEqual(resLeft.zone.id, "arts_sports", `Expected arts_sports, got ${resLeft.zone.id}`);
  assert.strictEqual(resLeft.zone.decreases, "skill_dev");
  console.log("[OK] LEFT -> Arts & Sports verified");

  console.log("ZoneMapper tests passed successfully!\n");

  console.log("=== 2. Testing StatEngine & Trade-off Rules ===");
  const se = new StatEngine();
  const initialStats = se.getAllStats();
  console.log("Initial stats:", initialStats);

  // Test UP trade-off: Academics increases, Arts & Sports decreases
  se.tick("academics", 1.0);
  const s1 = se.getAllStats();
  assert.ok(s1.academics > initialStats.academics, "Academics failed to increase");
  assert.ok(s1.arts_sports < initialStats.arts_sports, "Arts & Sports failed to decrease");
  console.log("[OK] UP Tradeoff verified: Academics up, Arts & Sports down");

  // Simulate 30 seconds to reach target end state
  for (let i = 0; i < 30; i++) {
    se.tick("hackathons", 1.0);
  }

  const results = se.calculateResults();
  console.log("Final Result Card Metrics:", results);
  assert.strictEqual(results.sleep_str, "1.5 hrs");
  assert.strictEqual(results.sleep_status, "[ CRITICAL ]");
  assert.strictEqual(results.happiness_str, "8%");
  assert.strictEqual(results.happiness_status, "[ LOW BATTERY ]");
  assert.strictEqual(results.passion_str, "89%");
  assert.strictEqual(results.passion_status, "[ OVERHEATING ]");
  assert.strictEqual(results.mental_stability_str, "2%");
  assert.strictEqual(results.mental_stability_status, "[ SYSTEM FAILURE ]");
  console.log("[OK] All 4 requested card metrics verified exactly!\n");

  console.log("=== 3. Testing AudioSynthesizer ===");
  const audio = new AudioSynthesizer();
  assert.strictEqual(typeof audio.playTick, "function");
  assert.strictEqual(typeof audio.playZoneSwitch, "function");
  assert.strictEqual(typeof audio.playPanic, "function");
  assert.strictEqual(typeof audio.playBuzzer, "function");
  assert.strictEqual(typeof audio.playSuccess, "function");
  console.log("[OK] AudioSynthesizer interface verified\n");

  console.log("=== 4. Testing ResultCard ===");
  const card = new ResultCard(1280, 720);
  assert.strictEqual(card.card_w, 780);
  const html = card.renderHTML(results);
  assert.ok(html.includes("STUDENT FINAL STATUS REPORT"));
  assert.ok(html.includes("EMPLOYABLE"));
  assert.ok(html.includes("Congratulations. You are now employable."));
  console.log("[OK] ResultCard HTML rendering verified\n");

  console.log("=== ALL ACT 2 JAVASCRIPT TESTS PASSED WITH 100% SUCCESS! ===");
}

testAll();
