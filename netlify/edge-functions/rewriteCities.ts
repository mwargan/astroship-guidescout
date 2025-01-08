export default async (request, context) => {
  const path = "/cities/" + context.geo?.city?.name.toLowerCase();
  return Response.redirect(new URL(path, request.url));
};

export const config = {
  path: "/cities",
};
