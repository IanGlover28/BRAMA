export const CATEGORIES = [
  { slug: "lipcare", label: "Lip Care" },
  { slug: "skincare", label: "Skin Care" },
  { slug: "face-serums", label: "Face Serums" },
  { slug: "face-toners", label: "Face Toners" },
  { slug: "face-wash", label: "Face Wash" },
  { slug: "face-cream", label: "Face Cream" },
  { slug: "body-lotion", label: "Body Lotion" },
  { slug: "sugar-body-scrub", label: "Sugar Body Scrub" },
  { slug: "salt-body-scrubs", label: "Salt Body Scrubs" },
  { slug: "body-and-bath-works", label: "Body & Bath Works" },
  { slug: "makeup", label: "Makeup" },
  { slug: "haircare", label: "Hair Care" },
  { slug: "fragrances", label: "Fragrances" },
  { slug: "bodycare", label: "Body Care" },
] as const;

export const categorySlugs: string[] = CATEGORIES.map((c) => c.slug);