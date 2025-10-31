export interface Tutorial {
  title: string;
  slug: string;
  category: string;
  summary: string;
  image: string;
  video?: string; // Added for video tutorials
  content: string; // HTML or markdown content
}

export const tutorials: Tutorial[] = [
  {
    title: "How to Build a Natural Skincare Routine",
    slug: "natural-skincare-routine",
    category: "Skincare Basics",
    summary: "Learn the perfect morning and night skincare routine for glowing skin.",
    image: "/images/learn/skincare-routine.jpg",
    video: "https://www.youtube.com/embed/abcd1234", // Replace with actual YouTube ID
    content: `
      <h2>Step-by-Step Guide</h2>
      <ol>
        <li>Start with a gentle cleanser suitable for your skin type.</li>
        <li>Apply toner to balance pH and prep your skin.</li>
        <li>Use a serum with active ingredients like Vitamin C or Hyaluronic Acid.</li>
        <li>Finish with moisturizer and sunscreen during the day.</li>
      </ol>
      <p>Consistency is key! Stick to this routine daily for best results.</p>
    `,
  },
  {
    title: "Makeup for Beginners: Natural Everyday Look",
    slug: "makeup-for-beginners",
    category: "Makeup Tutorials",
    summary: "Follow this simple makeup tutorial to achieve a fresh, natural look.",
    image: "/images/learn/makeup-beginners.jpg",
    video: "https://www.youtube.com/embed/xyz5678",
    content: `
      <h2>Natural Everyday Makeup</h2>
      <p>
        This tutorial covers how to apply foundation, blush and lip tint for a radiant look that lasts all day.
      </p>
      <ul>
        <li>Start with primer and light foundation.</li>
        <li>Apply soft blush to cheeks.</li>
        <li>Use nude or pink lipstick for a natural finish.</li>
      </ul>
    `,
  },
  {
    title: "How to Choose the Right Foundation Shade",
    slug: "choose-foundation-shade",
    category: "Product Education",
    summary: "Learn how to find your perfect BRAMA foundation shade.",
    image: "/images/learn/foundation.jpg",
    video: "https://www.youtube.com/embed/pqr9876",
    content: `
      <h2>Finding Your Perfect Match</h2>
      <p>
        Always test foundation on your jawline under natural light. BRAMA foundations come in 12 inclusive shades.
      </p>
      <ul>
        <li>Identify your undertone (warm, cool, neutral).</li>
        <li>Match shade to your neck, not just your face.</li>
        <li>Blend properly for a seamless finish.</li>
      </ul>
    `,
  },
];
