export interface Ingredient {
  qty: string;
  item: string;
  /** Optional notes like "room temperature" or "minced". */
  notes?: string;
}

export interface RecipeStep {
  text: string;
  /** Countdown in seconds. If set, the step shows a timer that beeps when done. */
  timer?: number;
}

export interface Recipe {
  slug: string;
  name: string;
  description: string;
  /** Active prep before cooking, in minutes. */
  prepTime: number;
  /** Cook time, in minutes. */
  cookTime: number;
  servings: number;
  tags: string[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
}

export const recipes: Recipe[] = [
  {
    slug: "carbonara",
    name: "Carbonara",
    description:
      "Roman classic. Pasta, eggs, guanciale, pecorino, lots of black pepper. No cream.",
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    tags: ["pasta", "italian", "quick"],
    ingredients: [
      { qty: "400g", item: "spaghetti" },
      { qty: "200g", item: "guanciale", notes: "pancetta works in a pinch" },
      { qty: "100g", item: "pecorino romano", notes: "finely grated" },
      { qty: "50g", item: "parmigiano", notes: "finely grated" },
      { qty: "4", item: "egg yolks", notes: "room temperature" },
      { qty: "1", item: "whole egg" },
      { qty: "1 tbsp", item: "black pepper", notes: "freshly cracked" },
      { qty: "to taste", item: "salt", notes: "for the pasta water" },
    ],
    steps: [
      {
        text: "Bring a large pot of water to a rolling boil. Salt heavily, like the sea.",
      },
      {
        text: "Slice the guanciale into matchsticks. Render in a wide pan over medium heat until crispy and golden. Off heat to cool slightly.",
        timer: 360,
      },
      {
        text: "In a bowl, beat together the egg yolks, whole egg, both cheeses, and a generous amount of black pepper. Set aside.",
      },
      {
        text: "Drop the spaghetti into the boiling water. Cook to al dente. Time per the package, usually 8 to 10 minutes.",
        timer: 540,
      },
      {
        text: "Reserve a cup of pasta water before draining. You'll need it.",
      },
      {
        text: "Drain the pasta and tip it straight into the pan with the guanciale. Off heat. Toss to coat in the rendered fat.",
      },
      {
        text: "Add a splash of pasta water and the egg-cheese mixture. Toss vigorously. Add more pasta water as needed to get a creamy sauce. The residual heat cooks the eggs without scrambling them.",
      },
      {
        text: "Plate immediately. Top with extra pecorino and a few more cracks of pepper.",
      },
    ],
  },
  {
    slug: "banana-bread",
    name: "Banana bread",
    description: "Easy loaf for the bananas you forgot about. The spottier the better.",
    prepTime: 15,
    cookTime: 70,
    servings: 8,
    tags: ["baking", "breakfast", "snack"],
    ingredients: [
      { qty: "3", item: "ripe bananas", notes: "the spottier the better" },
      { qty: "1/2 cup", item: "butter", notes: "melted" },
      { qty: "3/4 cup", item: "sugar" },
      { qty: "1", item: "egg", notes: "large" },
      { qty: "1 tsp", item: "vanilla extract" },
      { qty: "1 tsp", item: "baking soda" },
      { qty: "1 pinch", item: "salt" },
      { qty: "1.5 cups", item: "all-purpose flour" },
    ],
    steps: [
      { text: "Preheat the oven to 175°C / 350°F. Grease a loaf pan." },
      {
        text: "In a large bowl, mash the bananas until mostly smooth. A few lumps are fine.",
      },
      { text: "Stir in the melted butter." },
      { text: "Whisk in the sugar, egg, and vanilla until combined." },
      { text: "Sprinkle the baking soda and salt over the mix and stir." },
      {
        text: "Add the flour. Fold gently until just combined. Don't overmix or the bread will be tough.",
      },
      { text: "Pour the batter into the prepared loaf pan and smooth the top." },
      {
        text: "Bake until the top is golden and a toothpick inserted in the centre comes out clean.",
        timer: 3600,
      },
      {
        text: "Cool in the pan, then turn out onto a rack to finish cooling.",
        timer: 600,
      },
      {
        text: "Slice and eat. Best with butter, optional but encouraged.",
      },
    ],
  },
  {
    slug: "soft-boiled-eggs",
    name: "Soft-centred boiled eggs",
    description:
      "5 minutes 40 is the sweet spot. Soft yolk, set white. Plunge in cold water the second the timer hits zero.",
    prepTime: 2,
    cookTime: 8,
    servings: 2,
    tags: ["eggs", "breakfast", "quick"],
    ingredients: [
      { qty: "4", item: "eggs", notes: "fridge cold" },
      { qty: "1 bowl", item: "ice water", notes: "ready before the timer ends" },
      { qty: "to taste", item: "salt and pepper", notes: "for serving" },
    ],
    steps: [
      {
        text: "Fill a bowl with cold water and a few ice cubes. Set it next to the stove. You'll need it ready the second the timer hits zero.",
      },
      {
        text: "Bring a small pot of water to a rolling boil. Use enough water to cover the eggs by 2cm.",
      },
      {
        text: "Lower the eggs in carefully with a slotted spoon. Don't drop them, the shells will crack.",
      },
      {
        text: "Cook for exactly 5 minutes 40 seconds. This is the sweet spot. Soft creamy centre, fully set white, no green ring.",
        timer: 340,
      },
      {
        text: "The moment the timer hits zero, drain and plunge the eggs straight into the ice water. This is essential. It stops the cook instantly and makes the eggs much easier to peel. Leave for 2 minutes.",
        timer: 120,
      },
      {
        text: "Tap, peel, and serve. Salt, pepper, toast soldiers if you're so inclined.",
      },
    ],
  },
  {
    slug: "pancakes",
    name: "Pancakes",
    description:
      "Fluffy stack. The kind of Sunday morning you don't have to think about.",
    prepTime: 8,
    cookTime: 15,
    servings: 4,
    tags: ["breakfast", "baking", "weekend"],
    ingredients: [
      { qty: "1 cup", item: "all-purpose flour" },
      { qty: "2 tbsp", item: "sugar" },
      { qty: "2 tsp", item: "baking powder" },
      { qty: "1/2 tsp", item: "salt" },
      { qty: "1 cup", item: "milk", notes: "any kind, plant or dairy" },
      { qty: "1", item: "egg", notes: "large" },
      { qty: "2 tbsp", item: "butter", notes: "melted, plus more for the pan" },
      { qty: "1 tsp", item: "vanilla extract" },
      { qty: "to serve", item: "maple syrup", notes: "and a little extra butter" },
    ],
    steps: [
      {
        text: "In a large bowl, whisk together the flour, sugar, baking powder, and salt.",
      },
      {
        text: "In a second bowl, whisk together the milk, egg, melted butter, and vanilla.",
      },
      {
        text: "Pour the wet into the dry. Stir until just combined. Lumps are fine. Don't overmix or the pancakes will be tough.",
      },
      {
        text: "Rest the batter while the pan heats. This relaxes the gluten and gives a fluffier pancake.",
        timer: 300,
      },
      {
        text: "Heat a non-stick or cast-iron pan over medium-low. Add a small pat of butter and swirl to coat.",
      },
      {
        text: "Pour about a quarter cup of batter per pancake. Cook until bubbles form on the surface and the edges look set.",
        timer: 120,
      },
      {
        text: "Flip carefully. Cook the second side until golden underneath.",
        timer: 90,
      },
      {
        text: "Transfer to a warm plate. Repeat with the remaining batter, adding a little more butter to the pan as needed.",
      },
      {
        text: "Stack, top with butter and maple syrup. Eat immediately while the steam still rises.",
      },
    ],
  },
];

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}
