import assert from "node:assert/strict";
import test from "node:test";
import { normalizeImportedState } from "../src/lib/productivityStoreCore";

test("normalizes imported workspace data and drops unsafe values", () => {
  const state = normalizeImportedState({
    favorites: ["notion", 42, "todoist"],
    savedCollections: ["student-research", null, "creator-studio"],
    savedGuides: ["best-task-managers", false],
    recentToolIds: ["linear", false],
    savedStacks: [
      {
        id: 123,
        name: "Imported stack",
        toolIds: ["notion", null, "todoist"],
        score: 88,
        createdAt: "2026-05-27T00:00:00.000Z",
        notes: "Useful",
      },
      { name: "missing id" },
    ],
    quizResult: {
      homeBaseId: "notion",
      supportIds: ["todoist", 7],
      answers: { role: "Founder", broken: 99 },
    },
  });

  assert.deepEqual(state.favorites, ["notion", "todoist"]);
  assert.deepEqual(state.savedCollections, ["student-research", "creator-studio"]);
  assert.deepEqual(state.savedGuides, ["best-task-managers"]);
  assert.deepEqual(state.recentToolIds, ["linear"]);
  assert.equal(state.savedStacks.length, 1);
  assert.equal(state.savedStacks[0].id, "123");
  assert.deepEqual(state.savedStacks[0].toolIds, ["notion", "todoist"]);
  assert.deepEqual(state.quizResult?.answers, { role: "Founder" });
});

test("rejects non-object workspace imports", () => {
  assert.throws(() => normalizeImportedState(null), /not valid JSON/);
});
