export const fromJson = (data: string) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
};

export const toJson = (data: any) => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    return data;
  }
};
