export default async (request, context) => {
  const geocodeArea =
    context.url.searchParams.get("place") ||
    context.geo?.city?.name ||
    context.geo?.country?.name ||
    "Rovaniemi"; // Default to "Rovaniemi" if not provided

  const geocodeAreaFirstLetterCapitalized =
    geocodeArea.charAt(0).toUpperCase() + geocodeArea.slice(1);

  const query = `
    [out:json][timeout:25];
    // fetch area "${geocodeAreaFirstLetterCapitalized}" to search in
    area[name = "${geocodeAreaFirstLetterCapitalized}"]->.searchArea;
    // gather results
    (
      nwr[shop=travel_agency](area.searchArea);
      nwr["office"="guide"](area.searchArea);
      nwr["office"="travel_agent"](area.searchArea);
    );
    // print results
    out geom;
  `;

  const result = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: "data=" + encodeURIComponent(query),
  }).then((data) => data.json());

  return Response.json({
    place: geocodeAreaFirstLetterCapitalized,
    results: result?.elements,
  });
};

export const config = {
  cache: "manual",
  path: "/api/tourAgencies",
};
