export class BaseRenderController {
  /**
   * Formats the given parameters to JSON.
   *
   * @param {any} params - The parameters to format.
   * @returns {string} - The formatted JSON string.
   * @throws Will throw an error if the parameters cannot be formatted to JSON.
   */
  formatToJson(params: any): string {
    try {
      return JSON.stringify(params);
    } catch (error) {
      console.error("Error formatting parameters to JSON:", error);
      throw new Error("Invalid parameters for JSON formatting");
    }
  }
}
