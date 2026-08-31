/**
 * Health & Diet Calculation Engine
 * Calculates BMI, BMR, TDEE, Caloric Targets, Macros, Custom Meal Plans, and Workout Routines
 */

function calculateBmi(weightKg, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let status = 'Normal Weight';
  let color = 'emerald';

  if (bmi < 18.5) {
    status = 'Underweight';
    color = 'amber';
  } else if (bmi >= 18.5 && bmi < 25) {
    status = 'Normal Weight';
    color = 'emerald';
  } else if (bmi >= 25 && bmi < 30) {
    status = 'Overweight';
    color = 'amber';
  } else {
    status = 'Obese';
    color = 'rose';
  }

  return { bmi: parseFloat(bmi.toFixed(1)), status, color };
}

function calculateBmr(weightKg, heightCm, age, gender) {
  // Mifflin-St Jeor Formula
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr -= 78;
  }
  return Math.round(bmr);
}

function calculateTdee(bmr, activityLevel) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extreme: 1.9
  };
  const factor = multipliers[activityLevel] || 1.4;
  return Math.round(bmr * factor);
}

function calculateTargetCalories(tdee, goal) {
  if (goal === 'weight_loss') {
    // 500 kcal deficit for safe 0.5kg/week weight loss
    return Math.max(1200, Math.round(tdee - 500));
  } else if (goal === 'weight_gain') {
    // 500 kcal surplus for 0.5kg/week weight gain
    return Math.round(tdee + 500);
  }
  return Math.round(tdee);
}

function calculateMacros(targetCalories, goal, preference) {
  let pRatio = 0.30;
  let cRatio = 0.45;
  let fRatio = 0.25;

  if (preference === 'keto') {
    pRatio = 0.25;
    cRatio = 0.05;
    fRatio = 0.70;
  } else if (goal === 'weight_loss' || preference === 'high_protein') {
    pRatio = 0.35;
    cRatio = 0.40;
    fRatio = 0.25;
  } else if (goal === 'weight_gain') {
    pRatio = 0.25;
    cRatio = 0.50;
    fRatio = 0.25;
  }

  const proteinGrams = Math.round((targetCalories * pRatio) / 4);
  const carbsGrams = Math.round((targetCalories * cRatio) / 4);
  const fatGrams = Math.round((targetCalories * fRatio) / 9);

  return { proteinGrams, carbsGrams, fatGrams, pRatio, cRatio, fRatio };
}

function generateMealPlan(targetCalories, goal, preference) {
  const isLoss = goal === 'weight_loss';

  // Base templates tailored to diet preference and goal
  const mealsByPref = {
    vegetarian: {
      breakfast: isLoss 
        ? { name: 'Oatmeal & Berries with Almond Milk', time: '08:00 AM', kcal: Math.round(targetCalories * 0.25), protein: '15g', carbs: '45g', fat: '7g', description: 'Rolled oats cooked in almond milk, topped with fresh blueberries, chia seeds, and half a scoop of plant protein.' }
        : { name: 'High-Calorie Peanut Butter & Banana Oatmeal', time: '08:00 AM', kcal: Math.round(targetCalories * 0.25), protein: '22g', carbs: '65g', fat: '18g', description: 'Oats prepared with whole milk, 2 tbsp natural peanut butter, sliced bananas, honey, and crushed walnuts.' },
      snack1: isLoss
        ? { name: 'Greek Yogurt & Walnuts', time: '11:00 AM', kcal: Math.round(targetCalories * 0.15), protein: '18g', carbs: '12g', fat: '6g', description: 'Plain low-fat Greek yogurt with a sprinkle of crushed walnuts and cinnamon.' }
        : { name: 'Dry Fruit & Seed Power Mix', time: '11:00 AM', kcal: Math.round(targetCalories * 0.15), protein: '12g', carbs: '35g', fat: '16g', description: 'Almonds, cashews, raisins, pumpkin seeds, and dark chocolate chips.' },
      lunch: isLoss
        ? { name: 'Quinoa Paneer / Tofu Salad Bowl', time: '01:30 PM', kcal: Math.round(targetCalories * 0.30), protein: '28g', carbs: '40g', fat: '12g', description: 'Grilled paneer/tofu over quinoa, mixed greens, cherry tomatoes, cucumbers, drizzled with lemon olive oil dressing.' }
        : { name: 'Lentil Curry (Dal Tadka) with Brown Rice & Paneer Butter Masala', time: '01:30 PM', kcal: Math.round(targetCalories * 0.30), protein: '32g', carbs: '75g', fat: '22g', description: 'Steamed brown rice served with rich yellow dal, paneer cooked in light gravy, and 2 whole wheat chapattis.' },
      snack2: isLoss
        ? { name: 'Green Apple & Roasted Chana (Chickpeas)', time: '05:00 PM', kcal: Math.round(targetCalories * 0.10), protein: '8g', carbs: '22g', fat: '3g', description: 'Crisp green apple paired with 1/2 cup spiced roasted chickpeas.' }
        : { name: 'Protein Milkshake with Avocado & Dates', time: '05:00 PM', kcal: Math.round(targetCalories * 0.10), protein: '20g', carbs: '45g', fat: '14g', description: 'Blend whole milk, whey/plant protein, 3 Medjool dates, and 1/4 ripe avocado.' },
      dinner: isLoss
        ? { name: 'Steamed Mixed Veggies & Grilled Tofu / Cottage Cheese', time: '08:00 PM', kcal: Math.round(targetCalories * 0.20), protein: '24g', carbs: '25g', fat: '10g', description: 'Herb-seasoned grilled tofu with broccoli, bell peppers, zucchini, and spinach.' }
        : { name: 'Stuffed Parathas with Paneer & Mixed Vegetable Bowl', time: '08:00 PM', kcal: Math.round(targetCalories * 0.20), protein: '26g', carbs: '60g', fat: '18g', description: 'Two paneer stuffed chapattis/parathas served with thick curd and sautéed vegetables.' }
    },
    non_vegetarian: {
      breakfast: isLoss
        ? { name: '3-Egg White & Spinach Omelet with Avocado Toast', time: '08:00 AM', kcal: Math.round(targetCalories * 0.25), protein: '26g', carbs: '20g', fat: '10g', description: 'Whole wheat toast topped with mashed avocado and 3 egg whites fluffy omelet.' }
        : { name: 'Whole Egg Omlet (3 Eggs) with Cheese & Oatmeal', time: '08:00 AM', kcal: Math.round(targetCalories * 0.25), protein: '32g', carbs: '50g', fat: '22g', description: '3 whole eggs scrambled with cheddar cheese, served alongside 1 bowl of whole milk oatmeal.' },
      snack1: isLoss
        ? { name: 'Boiled Eggs & Cucumber Sticks', time: '11:00 AM', kcal: Math.round(targetCalories * 0.15), protein: '14g', carbs: '5g', fat: '7g', description: '2 hard-boiled eggs with sea salt and fresh sliced cucumbers.' }
        : { name: 'Chicken Breast & Whole Wheat Sandwich', time: '11:00 AM', kcal: Math.round(targetCalories * 0.15), protein: '28g', carbs: '35g', fat: '10g', description: 'Sliced grilled chicken breast on toasted whole grain bread with mayo and lettuce.' },
      lunch: isLoss
        ? { name: 'Grilled Chicken Breast with Brown Rice & Broccoli', time: '01:30 PM', kcal: Math.round(targetCalories * 0.30), protein: '42g', carbs: '35g', fat: '8g', description: 'Herb marinated grilled chicken breast (180g) served with 1 cup brown rice and steamed broccoli.' }
        : { name: 'Lean Beef / Mutton Curry with Jasmine Rice & Sweet Potatoes', time: '01:30 PM', kcal: Math.round(targetCalories * 0.30), protein: '45g', carbs: '80g', fat: '20g', description: 'Flavorful meat curry accompanied by a generous serving of jasmine rice and roasted sweet potatoes.' },
      snack2: isLoss
        ? { name: 'Whey Protein Shake & Almonds', time: '05:00 PM', kcal: Math.round(targetCalories * 0.10), protein: '25g', carbs: '6g', fat: '5g', description: '1 scoop whey protein isolate mixed in water with 10 raw almonds.' }
        : { name: 'Mass Gainer Shake with Peanut Butter', time: '05:00 PM', kcal: Math.round(targetCalories * 0.10), protein: '35g', carbs: '60g', fat: '15g', description: 'Blend whey protein, oats, banana, peanut butter, and full-cream milk.' },
      dinner: isLoss
        ? { name: 'Baked Salmon / Tilapia Fillet with Asparagus', time: '08:00 PM', kcal: Math.round(targetCalories * 0.20), protein: '35g', carbs: '12g', fat: '14g', description: 'Wild-caught salmon baked with lemon, garlic, and fresh herbs, served with asparagus.' }
        : { name: 'Grilled Chicken Thighs with Quinoa & Roasted Veggies', time: '08:00 PM', kcal: Math.round(targetCalories * 0.20), protein: '38g', carbs: '55g', fat: '18g', description: 'Juicy tender chicken thighs served over seasoned quinoa and roasted zucchini.' }
    }
  };

  // Fallback to vegetarian or non-veg if other type requested
  const base = mealsByPref[preference] || mealsByPref['vegetarian'];
  return [base.breakfast, base.snack1, base.lunch, base.snack2, base.dinner];
}

function generateWorkoutPlan(goal, activityLevel) {
  const isLoss = goal === 'weight_loss';

  if (isLoss) {
    return {
      weeklyFrequency: '4 - 5 Days per Week',
      sessionDuration: '45 - 60 Minutes',
      targetCalorieBurn: '350 - 500 kcal per session',
      focusArea: 'Fat Loss, Metabolic Conditioning & Lean Muscle Retention',
      exercises: [
        {
          name: 'Morning HIIT Cardio & Jump Rope',
          type: 'Cardio',
          durationMins: 20,
          caloriesBurned: 180,
          intensity: 'High',
          setsReps: '30s Work / 15s Rest x 15 Rounds',
          description: 'Alternate between rapid jump rope, mountain climbers, high knees, and jumping jacks to maximize EPOC (afterburn effect).'
        },
        {
          name: 'Bodyweight & Dumbbell Circuit',
          type: 'Resistance Training',
          durationMins: 25,
          caloriesBurned: 200,
          intensity: 'Moderate-High',
          setsReps: '4 Sets x 12-15 Reps',
          description: 'Goblet squats, push-ups, dumbbell bent-over rows, lunges, and plank holds with minimal rest between exercises.'
        },
        {
          name: 'Brisk Incline Treadmill Walk',
          type: 'LISS Cardio',
          durationMins: 15,
          caloriesBurned: 100,
          intensity: 'Moderate',
          setsReps: '15 Mins @ 10% Incline, 5.0 km/h',
          description: 'Low-impact steady-state cardio to burn fat while preserving muscle mass.'
        },
        {
          name: 'Full Body Core & Mobility Stretch',
          type: 'Flexibility',
          durationMins: 10,
          caloriesBurned: 30,
          intensity: 'Low',
          setsReps: 'Hold each stretch for 30s',
          description: 'Cobra stretch, hamstring holds, child\'s pose, and bicycle crunches to improve mobility and recovery.'
        }
      ]
    };
  } else {
    // Weight Gain Workout Plan
    return {
      weeklyFrequency: '4 Days per Week (Upper/Lower Split)',
      sessionDuration: '50 - 70 Minutes',
      targetCalorieBurn: '250 - 350 kcal per session',
      focusArea: 'Hypertrophy, Progressive Overload & Muscle Mass Gain',
      exercises: [
        {
          name: 'Barbell Squats & Deadlifts',
          type: 'Compound Strength',
          durationMins: 25,
          caloriesBurned: 150,
          intensity: 'High',
          setsReps: '4 Sets x 6-8 Heavy Reps',
          description: 'Master compound movements to stimulate maximum growth hormone release and muscle mass build.'
        },
        {
          name: 'Dumbbell Bench Press & Overhead Press',
          type: 'Hypertrophy Strength',
          durationMins: 20,
          caloriesBurned: 120,
          intensity: 'High',
          setsReps: '4 Sets x 8-10 Reps (2 min rest)',
          description: 'Focus on time under tension and progressive overloading by increasing weight gradually each week.'
        },
        {
          name: 'Pull-Ups & Cable Lat Pulldowns',
          type: 'Upper Body Pull',
          durationMins: 15,
          caloriesBurned: 80,
          intensity: 'Moderate-High',
          setsReps: '3 Sets x 10-12 Reps',
          description: 'Build back thickness and upper body width for balanced physical development.'
        },
        {
          name: 'Light Warm-up Walk & Foam Rolling',
          type: 'Recovery Walk',
          durationMins: 10,
          caloriesBurned: 40,
          intensity: 'Low',
          setsReps: '5 Mins walk + 5 Mins roll',
          description: 'Keep cardio light to avoid burning calories needed for weight gain and muscle synthesis.'
        }
      ]
    };
  }
}

function getDietGuidelines(goal) {
  if (goal === 'weight_loss') {
    return [
      { title: 'Maintain Caloric Deficit', desc: 'Stick consistently to your target caloric deficit (~500 kcal below TDEE) to burn ~0.5kg of fat per week safely.' },
      { title: 'Prioritize Protein Intake', desc: 'Aim for 1.6 - 2.2g of protein per kg of body weight to keep you full and prevent muscle breakdown during fat loss.' },
      { title: 'Hydrate Exceptionally Well', desc: 'Drink at least 3.5 to 4 Liters (14-16 glasses) of water daily. Thirst is often mistaken for hunger.' },
      { title: 'Eliminate Liquid Calories', desc: 'Cut out sugary sodas, artificial fruit juices, and high-calorie coffee drinks. Stick to water, black coffee, and green tea.' },
      { title: 'Prioritize Fiber-Rich Whole Foods', desc: 'Fill half your plate with non-starchy vegetables (spinach, broccoli, cucumbers) and complex carbs (oats, brown rice, quinoa).' }
    ];
  } else {
    return [
      { title: 'Create Caloric Surplus', desc: 'Eat ~500 kcal above your TDEE consistently to enable clean weight and muscle tissue growth.' },
      { title: 'Eat Nutrient & Calorie-Dense Foods', desc: 'Incorporate healthy fats and dense foods like nuts, peanut butter, avocados, olive oil, dried fruits, and whole milk.' },
      { title: 'Eat 5-6 Meals Daily', desc: 'Spacing out 3 full meals plus 2-3 calorie-dense snacks prevents digestive discomfort while achieving your high calorie target.' },
      { title: 'Post-Workout Liquid Nutrition', desc: 'Consume a high-protein, carb-rich smoothie or mass gainer within 30-45 minutes after training for rapid muscle recovery.' },
      { title: 'Never Skip Meals', desc: 'Consistency is key. Prepare meals ahead of time or keep calorie-dense snack bars in your bag.' }
    ];
  }
}

function getExerciseGuidelines(goal) {
  if (goal === 'weight_loss') {
    return [
      { title: 'Frequency & Duration', desc: 'Work out 4 to 5 days per week for 45-60 minutes per session.' },
      { title: 'Cardio Strategy', desc: 'Combine 20 mins of high-intensity interval training (HIIT) with 20 mins of steady incline walking.' },
      { title: 'Resistance Training', desc: 'Lift weights 3 times a week using moderate weights (12-15 reps) to protect lean muscle tissue while losing fat.' },
      { title: 'Active Daily Movement (NEAT)', desc: 'Aim for 8,000 to 10,000 steps daily outside of structured gym workouts to keep your daily metabolic rate elevated.' }
    ];
  } else {
    return [
      { title: 'Frequency & Duration', desc: 'Train 4 days per week for 50-70 minutes per session to allow maximum recovery.' },
      { title: 'Progressive Overload', desc: 'Track your lift weights weekly. Focus on steadily increasing the weight or repetitions on key compound exercises.' },
      { title: 'Limit Excessive Cardio', desc: 'Keep cardio to light 10-15 minute warm-ups or cool-downs to preserve precious energy for building muscle mass.' },
      { title: 'Sleep & Recovery', desc: 'Get 7.5 to 9 hours of uninterrupted sleep every night. Muscle tissue grows during deep rest, not during training.' }
    ];
  }
}

module.exports = {
  calculateBmi,
  calculateBmr,
  calculateTdee,
  calculateTargetCalories,
  calculateMacros,
  generateMealPlan,
  generateWorkoutPlan,
  getDietGuidelines,
  getExerciseGuidelines
};
