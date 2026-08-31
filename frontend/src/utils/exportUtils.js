export function exportPlanAsJson(dietPlan, user) {
  if (!dietPlan) return;

  const exportData = {
    appName: "NutriFit360 Health Care Platform",
    exportedAt: new Date().toISOString(),
    user: {
      name: user?.name || "Health User",
      email: user?.email || ""
    },
    healthMetrics: {
      goal: dietPlan.healthGoal === 'weight_gain' ? 'Weight Gain (+500 kcal)' : 'Weight Loss (-500 kcal)',
      age: dietPlan.age,
      gender: dietPlan.gender,
      heightCm: dietPlan.heightCm,
      currentWeightKg: dietPlan.currentWeightKg,
      targetWeightKg: dietPlan.targetWeightKg,
      bmi: dietPlan.bmi,
      bmiStatus: dietPlan.bmiStatus,
      bmrKcal: dietPlan.bmr,
      tdeeKcal: dietPlan.tdee,
      targetCaloriesKcal: dietPlan.targetCalories,
      dietPreference: dietPlan.dietPreference,
      activityLevel: dietPlan.activityLevel
    },
    macroTargets: dietPlan.macros,
    dailyMealPlan: dietPlan.mealPlan,
    workoutSchedule: dietPlan.workoutPlan,
    dietGuidelines: dietPlan.dietGuidelines,
    exerciseGuidelines: dietPlan.exerciseGuidelines
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `NutriFit360_${(user?.name || 'Health').replace(/\s+/g, '_')}_Plan.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function printHealthPlan() {
  window.print();
}
