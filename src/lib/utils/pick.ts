/**
 * Create an object composed of the picked object properties
 * and formats some values with `$in` based on a specific key.
 * @param {Record<string, any>} object
 * @param {string[]} keys
 * @returns {Object}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pick = (object: Record<string, any>, keys: string[]) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keys.reduce((obj: any, key: string) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      const value = object[key];

      if (typeof value === "string" && value.includes(",")) {
        // eslint-disable-next-line no-param-reassign
        obj[key] = { in: value.split(",") };
      } else {
        // eslint-disable-next-line no-param-reassign
        obj[key] = value;
      }
    }

    return obj;
  }, {});
