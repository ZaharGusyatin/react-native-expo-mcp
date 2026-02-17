import { Router } from "../../utils/format.js";
import { getStackChoice } from "./00-stack-choice.js";
import { getArchitecture } from "./01-architecture.js";
import { getStyling } from "./02-styling.js";
import { getComponents } from "./03-components.js";
import { getStateManagement } from "./04-state-management.js";
import { getNavigation } from "./05-navigation.js";
import { getPerformance } from "./08-performance.js";
import { getRecommendations } from "./09-recommendations.js";

export type PracticeCategory =
  | "stack-choice"
  | "architecture"
  | "styling"
  | "components"
  | "state-management"
  | "navigation"
  | "performance"
  | "recommendations"
  | "all";

export function getBestPractice(category: PracticeCategory, router?: Router): string {
  switch (category) {
    case "stack-choice":
      return getStackChoice();
    case "architecture":
      return getArchitecture(router);
    case "styling":
      return getStyling();
    case "components":
      return getComponents();
    case "state-management":
      return getStateManagement();
    case "navigation":
      return getNavigation(router);
    case "performance":
      return getPerformance();
    case "recommendations":
      return getRecommendations();
    case "all":
      return [
        getStackChoice(),
        getArchitecture(router),
        getStyling(),
        getComponents(),
        getStateManagement(),
        getNavigation(router),
        getPerformance(),
        getRecommendations(),
      ].join("\n\n---\n\n");
    default:
      return `Категорія "${category}" не знайдена. Доступні: stack-choice, architecture, styling, components, state-management, navigation, performance, recommendations, all`;
  }
}
