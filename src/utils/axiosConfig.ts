export const getAxiosConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
