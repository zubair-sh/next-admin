// HTTP service
export const http = {
  get: async (url: string) => {
    const response = await fetch(url);
    return response.json();
  },
  post: async (url: string, data: unknown) => {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  },
};
