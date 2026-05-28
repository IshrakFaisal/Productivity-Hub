import assert from "node:assert/strict";
import test from "node:test";
import { productivityTools } from "../src/data/productivityTools";
import { analyzeProductivityStack } from "../src/lib/stackAnalysis";

function tools(ids: string[]) {
  return productivityTools.filter((tool) => ids.includes(tool.id));
}

test("scores the starter stack as broad and healthy", () => {
  const analysis = analyzeProductivityStack(tools(["notion", "todoist", "google-workspace"]));

  assert.equal(analysis.homeBase?.id, "notion");
  assert.equal(analysis.coverageScore, 10);
  assert.ok(analysis.score >= 85);
  assert.ok(analysis.messages.some((message) => message.type === "good"));
});

test("warns when a stack has too much task overlap and no calendar lane", () => {
  const analysis = analyzeProductivityStack(tools(["todoist", "trello", "linear"]));

  assert.ok(analysis.messages.some((message) => message.text.includes("3 task apps")));
  assert.ok(analysis.messages.some((message) => message.text.includes("do not have a calendar")));
});
