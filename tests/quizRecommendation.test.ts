import assert from "node:assert/strict";
import test from "node:test";
import { recommendProductivityStack } from "../src/lib/quizRecommendation";

test("recommends a flexible home base for a founder who wants an all-in-one system", () => {
  const result = recommendProductivityStack({
    role: "Founder",
    system: "Powerful all-in-one",
    team: "Small team",
    need: "Docs",
    view: "Databases",
    stack: "One app for everything",
    setup: "I like building systems",
  });

  assert.equal(result.homeBase.id, "notion");
  assert.ok(result.confidence >= 70);
  assert.ok(result.winnerReasons.length > 1);
});

test("returns task-focused support when execution is the main need", () => {
  const result = recommendProductivityStack({
    role: "Freelancer",
    system: "Simple tools",
    team: "Mostly alone",
    need: "Tasks",
    view: "Lists",
    stack: "Multiple focused tools",
    setup: "Almost none",
  });

  assert.ok([result.homeBase, ...result.supporting].some((tool) => tool.taskScore >= 9));
  assert.ok(result.stackDecision.includes("focused stack"));
});
