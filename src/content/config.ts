// 1. Import utilities from `astro:content`
import { getSlug } from "@utils/all";
import { z, defineCollection } from "astro:content";
import TourAgencies from "@data/tourAgencies.json";

// 2. Define your collection(s)
const blogCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    title: z.string(),
    snippet: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.string().transform((str) => new Date(str)),
    author: z.string().default("GuideScout"),
    category: z.string(),
    tags: z.array(z.string()),
  }),
});

const teamCollection = defineCollection({
  schema: z.object({
    draft: z.boolean(),
    name: z.string(),
    title: z.string(),
    avatar: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    publishDate: z.string().transform((str) => new Date(str)),
  }),
});

const tourAgenciesCollection = defineCollection({
  loader: async () => {
    // Get the data from json file
    // @ts-ignore
    const data = TourAgencies.features;

    return (
      data
        .map((company) => {
          const name = (
            company.properties["name:en"] ??
            company.properties["name:uk"] ??
            company.properties.name
          )?.trim();
          return {
            ...company,
            name,
            slug: getSlug(name, company.properties["addr:city"]),
          };
        })
        .filter((company) => company.name && company.name.length > 1)
        // Unique by slug
        .filter(
          (company, index, self) =>
            index === self.findIndex((t) => t.slug === company.slug),
        )
    );
  },

  schema: z.object({
    type: z.string(),
    name: z.string(),
    slug: z.string(),
    properties: z.object({
      "@id": z.string(),
      building: z.string().optional(),
      name: z.string().optional(),
      shop: z.string().optional(),
      type: z.string().optional(),
      "addr:city": z.string().optional(),
      "addr:country": z.string().optional(),
      "addr:housenumber": z.string().optional(),
      "addr:postcode": z.string().optional(),
      "addr:street": z.string().optional(),
    }),
    geometry: z.object({
      type: z.string(),
      coordinates: z
        .array(z.array(z.tuple([z.number(), z.number()]))) // Polygon
        .or(z.array(z.array(z.array(z.tuple([z.number(), z.number()]))))) // MultiPolygon
        .or(z.tuple([z.number(), z.number()])) // Point
        .or(z.array(z.tuple([z.number(), z.number()]))), // LineString
    }),
    id: z.string(),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  blog: blogCollection,
  team: teamCollection,
  agency: tourAgenciesCollection,
};
