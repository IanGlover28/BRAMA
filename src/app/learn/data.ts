export interface Article {
  title: string;
  slug: string;
  category: string;
  summary: string;
  image: string;
  content: string; // Could be markdown or plain HTML
}

export const articles: Article[] = [
  {
    title: "What Is THC?",
    slug: "what-is-thc",
    category: "Cannabis Basics",
    summary: "THC is the main psychoactive compound in cannabis responsible for the 'high'.",
    image: "/images/learn/thc.jpg",
    content: `
      <h2>Understanding THC</h2>
      <p>
        Tetrahydrocannabinol (THC) is the most well-known cannabinoid found in cannabis. It interacts with your body’s endocannabinoid system to produce euphoric and relaxing effects.
      </p>
      <p>
        The strength of THC effects depends on the strain, dose, and your individual tolerance.
      </p>
      <h3>Key Takeaways</h3>
      <ul>
        <li>THC produces psychoactive effects.</li>
        <li>Higher doses can lead to anxiety for some users.</li>
        <li>Balance with CBD can moderate THC’s intensity.</li>
      </ul>
    `,
  },
  {
    title: "How to Properly Store Cannabis",
    slug: "how-to-properly-store-cannabis",
    category: "Cannabis How Tos",
    summary: "Proper storage keeps your cannabis fresh and potent for longer periods.",
    image: "/images/learn/storage.jpg",
    content: `
      <h2>How to Store Cannabis</h2>
      <p>
        Store cannabis in airtight containers in a cool, dark place to maintain potency and flavor. Avoid exposure to sunlight, humidity, and air.
      </p>
      <ul>
        <li>Use glass jars with tight lids.</li>
        <li>Keep away from direct heat.</li>
        <li>Store in a dry environment (humidity 59–63%).</li>
      </ul>
    `,
  },
  {
    title: "How to Roll a Joint",
    slug: "how-to-roll-a-joint",
    category: "Cannabis How Tos",
    summary: "Learn the classic way to roll a joint with precision and ease.",
    image: "/images/learn/joint.jpg",
    content: `
      <h2>Rolling a Perfect Joint</h2>
      <ol>
        <li>Grind your cannabis evenly.</li>
        <li>Place it into rolling paper with a filter tip.</li>
        <li>Shape, roll, lick, and seal the joint.</li>
        <li>Light it up and enjoy responsibly.</li>
      </ol>
      <p>Practice makes perfect — keep it consistent for a smooth burn.</p>
    `,
  },
];
