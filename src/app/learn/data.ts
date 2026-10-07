export interface Tutorial {
  title: string;
  slug: string;
  category: string;
  summary: string;
  video: string;
  content: string;
}

export const tutorials: Tutorial[] = [
  {
    title: "How to Build a Natural Skincare Routine",
    slug: "natural-skincare-routine",
    category: "Skincare Basics",
    summary: "Learn the perfect morning and night skincare routine for glowing skin.",
    video: "https://www.youtube.com/embed/3mMOF6XNF5Y",
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
    title: "Calm Red & Irritated Skin",
    slug: "calm-red-irritated-skin",
    category: "Skincare Basics",
    summary: "Tips to soothe redness, irritation and sensitive skin with gentle routines.",
    video: "https://www.youtube.com/embed/8mjB0bMGEFs",
    content: `
      <h2>Sensitive Skin SOS</h2>
      <p>
        Redness and irritation are common — weather, new products and over-exfoliating can all
        trigger them. This guide walks you through calming hacks and soothing routines.
      </p>
      <ul>
        <li>Patch-test new products behind your ear for 48 hours.</li>
        <li>Apply cool compresses and gel moisturizers to reduce flare-ups.</li>
        <li>Limit exfoliation to 1–3 days a week and choose chemical over physical scrubs.</li>
      </ul>
    `,
  },
  {
    title: "Makeup for Beginners: Natural Everyday Look",
    slug: "makeup-for-beginners",
    category: "Makeup Tutorials",
    summary: "Follow this simple makeup tutorial to achieve a fresh, natural look.",
    video: "https://www.youtube.com/embed/HADsQcmmHtA",
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
    title: "The Ultimate Soft Glam Makeup Tutorial",
    slug: "soft-glam-makeup",
    category: "Makeup Tutorials",
    summary: "A beginner-friendly soft glam look that dresses up any occasion.",
    video: "https://www.youtube.com/embed/MAxrxeH3tnU",
    content: `
      <h2>Soft Glam, Made Simple</h2>
      <p>
        Soft glam is the perfect middle ground between natural and full glam. Learn how to build
        dimension with bronzer, blush and highlight for a polished, radiant finish.
      </p>
      <ul>
        <li>Build your base in thin, blendable layers.</li>
        <li>Concentrate product on the center of the face and blend outward.</li>
        <li>Finish with a setting spray to allow oils to come through naturally.</li>
      </ul>
    `,
  },
  {
    title: "5-Minute No-Foundation Makeup With Just 5 Products",
    slug: "five-minute-everyday-makeup",
    category: "Makeup Tutorials",
    summary: "A fast, effortless routine using concealer, blush, brows, liner and mascara.",
    video: "https://www.youtube.com/embed/u36P_z64i4M",
    content: `
      <h2>Beauty in Five Minutes</h2>
      <p>
        Love your skin as it is? This minimal routine proves you don't need full-coverage
        foundation for a glowing, fresh everyday look.
      </p>
      <ul>
        <li>Conceal only where you need it — under-eye, nose and blemishes.</li>
        <li>Blend blush toward the temples for a lifted effect.</li>
        <li>Brush brows first, then fill gaps with light strokes.</li>
      </ul>
    `,
  },
  {
    title: "How to Choose the Right Foundation Shade",
    slug: "choose-foundation-shade",
    category: "Product Education",
    summary: "Learn how to find your perfect foundation shade every time.",
    video: "https://www.youtube.com/embed/S1uiOw086f4",
    content: `
      <h2>Finding Your Perfect Match</h2>
      <p>
        Always test foundation on your jawline under natural light. BRAMA foundations come in inclusive shades for every skin tone.
      </p>
      <ul>
        <li>Identify your undertone (warm, cool, neutral).</li>
        <li>Swatch a few close shades and let them settle before deciding.</li>
        <li>Match shade to your neck, not just your face.</li>
      </ul>
    `,
  },
];