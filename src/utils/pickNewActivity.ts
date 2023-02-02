import { ClientActivity } from "../types";

import logger from "./logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pickNewActivity = (activities: ClientActivity[], currentActivity: any): ClientActivity => {
  const randomIndex = Math.floor(Math.random() * activities.length);
  const randomActivity = activities[randomIndex];

  if (currentActivity && randomActivity.name === currentActivity.name && randomActivity.type === currentActivity.type) {
    logger.warn("Picked the same activity as the current one, picking a new one...");
    return pickNewActivity(activities, currentActivity);
  }

  logger.info(`Picked a new activity: ${randomActivity.name} (${randomActivity.type})`);
  return randomActivity;
};

export default pickNewActivity;