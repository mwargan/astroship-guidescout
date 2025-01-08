import { Country } from "country-state-city";

export default async (request, context) => {
  const geoCountryCode = context.geo?.country?.code;

  const country = Country.getCountryByCode(geoCountryCode);

  const path = "/countries/" + country?.name.toLowerCase();

  return Response.redirect(new URL(path, request.url));
};

export const config = {
  path: "/countries",
};
