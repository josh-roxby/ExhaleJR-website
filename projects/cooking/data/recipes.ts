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
];

export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find((r) => r.slug === slug);
}
