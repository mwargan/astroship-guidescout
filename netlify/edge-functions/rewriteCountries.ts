export default async (request, context) => {
  const path = "/countries/" + context.geo?.country?.name.toLowerCase();
  return Response.redirect(new URL(path, request.url));
};

export const config = {
  path: "/countries",
};
