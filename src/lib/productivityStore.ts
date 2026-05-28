"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  initialProductivityHubState,
  normalizeImportedState,
  type OnboardingProfile,
  type ProductivityHubState,
  type QuizSnapshot,
  type SavedStack,
} from "@/lib/productivityStoreCore";

export type { OnboardingProfile, ProductivityHubState, QuizSnapshot, SavedStack } from "@/lib/productivityStoreCore";

const storageKey = "productivity-hub-state-v1";

const initialState = initialProductivityHubState;

let loaded = false;
let memoryState: ProductivityHubState = initialState;
const listeners = new Set<() => void>();

function readState() {
  if (typeof window === "undefined") return initialState;

  try {
    const stored = window.localStorage.getItem(storageKey);
    return stored ? ({ ...initialState, ...JSON.parse(stored) } as ProductivityHubState) : initialState;
  } catch {
    return initialState;
  }
}

function writeState(state: ProductivityHubState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getClientSnapshot() {
  if (!loaded) {
    memoryState = readState();
    loaded = true;
  }

  return memoryState;
}

function getServerSnapshot() {
  return initialState;
}

function commitState(state: ProductivityHubState) {
  memoryState = state;
  writeState(state);
  listeners.forEach((listener) => listener());
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

export function useProductivityHubStore() {
  const state = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

  const update = useCallback((recipe: (current: ProductivityHubState) => ProductivityHubState) => {
    const next = recipe(getClientSnapshot());
    commitState(next);
  }, []);

  const toggleFavorite = useCallback(
    (toolId: string) => {
      update((current) => ({
        ...current,
        favorites: current.favorites.includes(toolId)
          ? current.favorites.filter((id) => id !== toolId)
          : unique([toolId, ...current.favorites]),
      }));
    },
    [update],
  );

  const trackTool = useCallback(
    (toolId: string) => {
      update((current) => ({
        ...current,
        recentToolIds: unique([toolId, ...current.recentToolIds]).slice(0, 8),
      }));
    },
    [update],
  );

  const saveStack = useCallback(
    ({ name, toolIds, score, notes }: Omit<SavedStack, "id" | "createdAt">) => {
      const stack: SavedStack = {
        id: `stack-${Date.now()}`,
        name,
        toolIds,
        score,
        notes,
        createdAt: new Date().toISOString(),
      };

      update((current) => ({
        ...current,
        savedStacks: [stack, ...current.savedStacks].slice(0, 12),
      }));
      return stack;
    },
    [update],
  );

  const deleteStack = useCallback(
    (stackId: string) => {
      update((current) => ({
        ...current,
        savedStacks: current.savedStacks.filter((stack) => stack.id !== stackId),
      }));
    },
    [update],
  );

  const saveQuizResult = useCallback(
    (snapshot: Omit<QuizSnapshot, "createdAt">) => {
      update((current) => ({
        ...current,
        quizResult: { ...snapshot, createdAt: new Date().toISOString() },
      }));
    },
    [update],
  );

  const saveOnboarding = useCallback(
    (profile: Omit<OnboardingProfile, "completed" | "createdAt">) => {
      update((current) => ({
        ...current,
        onboarding: {
          ...profile,
          completed: true,
          createdAt: new Date().toISOString(),
        },
      }));
    },
    [update],
  );

  const importWorkspace = useCallback((incoming: unknown) => {
    const parsed = normalizeImportedState(incoming);
    commitState(parsed);
  }, []);

  const resetWorkspace = useCallback(() => {
    commitState(initialState);
  }, []);

  return useMemo(
    () => ({
      state,
      deleteStack,
      resetWorkspace,
      importWorkspace,
      saveOnboarding,
      saveQuizResult,
      saveStack,
      toggleFavorite,
      trackTool,
    }),
    [deleteStack, importWorkspace, resetWorkspace, saveOnboarding, saveQuizResult, saveStack, state, toggleFavorite, trackTool],
  );
}

export function downloadTextFile(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
