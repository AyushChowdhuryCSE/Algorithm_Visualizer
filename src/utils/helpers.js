export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateRandomArray = (size, min = 5, max = 500) => {
  const array = [];
  for (let i = 0; i < size; i++) {
    array.push({
      id: i,
      value: randomIntFromInterval(min, max),
      state: 'default' // 'default', 'compare', 'swap', 'sorted'
    });
  }
  return array;
};
