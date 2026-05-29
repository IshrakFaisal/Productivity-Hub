export type SavedStack = {
  id: string;
  name: string;
  toolIds: string[];
  score: number;
  createdAt: string;
  notes?: string;
};

export type QuizSnapshot = {
  homeBaseId: string;
  supportIds: string[];
  answers: Record<string, string>;
  createdAt: string;
};

export type OnboardingProfile = {
  completed: boolean;
  role: string;
  teamMode: string;
  toolPreference: string;
  priority: string;
  currentTools: string[];
  createdAt: string;
};

export type ProductivityHubState = {
  favorites: string[];
  savedCollections: string[];
  savedGuides: string[];
  savedStacks: SavedStack[];
  recentToolIds: string[];
  onboarding?: OnboardingProfile;
  quizResult?: QuizSnapshot;
};

export const initialProductivityHubState: ProductivityHubState = {
  favorites: [],
  savedCollections: [],
  savedGuides: [],
  savedStacks: [],
  recentToolIds: [],
};

export function normalizeImportedState(value: unknown): ProductivityHubState {
  if (!value || typeof value !== "object") {
    throw new Error("Workspace file is not valid JSON.");
  }

  const candidate = value as Partial<ProductivityHubState>;
  return {
    favorites: Array.isArray(candidate.favorites) ? candidate.favorites.filter(isString) : [],
    savedCollections: Array.isArray(candidate.savedCollections) ? candidate.savedCollections.filter(isString) : [],
    savedGuides: Array.isArray(candidate.savedGuides) ? candidate.savedGuides.filter(isString) : [],
    savedStacks: Array.isArray(candidate.savedStacks)
      ? candidate.savedStacks
          .filter((stack): stack is SavedStack => Boolean(stack && typeof stack === "object" && "id" in stack && "name" in stack && "toolIds" in stack))
          .map((stack) => ({
            id: String(stack.id),
            name: String(stack.name),
            toolIds: Array.isArray(stack.toolIds) ? stack.toolIds.filter(isString) : [],
            score: typeof stack.score === "number" ? stack.score : 0,
            createdAt: typeof stack.createdAt === "string" ? stack.createdAt : new Date().toISOString(),
            notes: typeof stack.notes === "string" ? stack.notes : undefined,
          }))
      : [],
    recentToolIds: Array.isArray(candidate.recentToolIds) ? candidate.recentToolIds.filter(isString) : [],
    onboarding: normalizeOnboarding(candidate.onboarding),
    quizResult: normalizeQuiz(candidate.quizResult),
  };
}

function normalizeOnboarding(value: unknown): OnboardingProfile | undefined {
  if (!value || typeof value !== "object") return undefined;
  const profile = value as Partial<OnboardingProfile>;
  if (!profile.completed) return undefined;

  return {
    completed: true,
    role: typeof profile.role === "string" ? profile.role : "Founder",
    teamMode: typeof profile.teamMode === "string" ? profile.teamMode : "Mostly alone",
    toolPreference: typeof profile.toolPreference === "string" ? profile.toolPreference : "Balanced",
    priority: typeof profile.priority === "string" ? profile.priority : "Clarity",
    currentTools: Array.isArray(profile.currentTools) ? profile.currentTools.filter(isString) : [],
    createdAt: typeof profile.createdAt === "string" ? profile.createdAt : new Date().toISOString(),
  };
}

function normalizeQuiz(value: unknown): QuizSnapshot | undefined {
  if (!value || typeof value !== "object") return undefined;
  const quiz = value as Partial<QuizSnapshot>;
  if (typeof quiz.homeBaseId !== "string") return undefined;

  return {
    homeBaseId: quiz.homeBaseId,
    supportIds: Array.isArray(quiz.supportIds) ? quiz.supportIds.filter(isString) : [],
    answers: quiz.answers && typeof quiz.answers === "object" ? Object.fromEntries(Object.entries(quiz.answers).filter(([, answer]) => typeof answer === "string")) as Record<string, string> : {},
    createdAt: typeof quiz.createdAt === "string" ? quiz.createdAt : new Date().toISOString(),
  };
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}
