export default async (request, context) => {
  const cityName = context.geo?.city?.name?.toLowerCase();
  const countryName = context.geo?.country?.name?.toLowerCase();
  const path = cityName
    ? `/cities/${cityName}`
    : countryName
      ? `/countries/${countryName}`
      : "/";
  return Response.redirect(new URL(path, request.url));
};

export const config = {
  path: "/cities",
};
