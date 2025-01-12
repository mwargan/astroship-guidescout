/** */
export const getFormattedDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

export const getSlug = (title, city = null as string | null) => {
  let slug = title?.toLowerCase().split(" ").join("-");
  if (city) {
    slug += "-" + city.toLowerCase().split(" ").join("-");
  }
  return slug;
};

export interface RootFeature {
  type: string;
  properties: Properties;
  geometry: Geometry;
  id: string;
  name?: string;
  website?: string;
}

export interface Properties {
  [key: string]: string;
}

export interface Geometry {
  type: string;
  coordinates: number[][][] | number[];
}

export const getFilteredFeatures = (features: RootFeature[]) => {
  features = features.map((company) => {
    return {
      ...company,
      name: (
        company.properties["name:en"] ??
        company.properties["name:uk"] ??
        company.properties.name
      )
        ?.trim()
        .normalize(),
      website:
        company.properties["contact:website"] ??
        company.properties.website ??
        undefined,
    };
  });

  // Filter out companies without a name
  features = features.filter(
    (company) =>
      company.name &&
      company.name.length > 1 &&
      // Obly alpahnumeric characters and spaces
      company.name.match(/^[a-zA-Z0-9 ]+$/),
  );

  // Make sure each name is unique
  features = features.filter(
    (company, index, self) =>
      index ===
      self.findIndex(
        (t) => t.name?.toLowerCase() === company.name?.toLowerCase(),
      ),
  );

  return features;
};
