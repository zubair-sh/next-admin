/**
 * Create a MongoDB $or query for the provided keys using the search term.
 * @param {Object} query - Source object containing the `search` value.
 * @param {string[]} keys - Keys to construct regex match conditions for.
 * @returns {Object} - MongoDB $or query object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const match = (query: Record<string, any>, keys: string[]): any => {
  if (!query || !query["search"]) {
    return {};
  }

  const searchTerm = query["search"];

  return {
    OR: keys.map((key) => {
      if (key === "_id") {
        return {
          $expr: {
            $regexMatch: {
              input: { $toString: "$_id" },
              regex: searchTerm,
              options: "i",
            },
          },
        };
      }

      return {
        [key]: { contains: searchTerm, mode: "insensitive" },
      };
    }),
  };
};
