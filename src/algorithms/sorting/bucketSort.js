import { sleep } from '../../utils/helpers';

export const bucketSort = async (array, setArray, speed) => {
  const delay = Math.max(1, 500 - speed * 5);
  const arr = [...array];
  const n = arr.length;

  if (n <= 0) return;

  // Find max value
  let max = arr[0].value;
  let min = arr[0].value;
  for (let i = 1; i < n; i++) {
    if (arr[i].value > max) max = arr[i].value;
    if (arr[i].value < min) min = arr[i].value;
  }

  // Number of buckets
  const bucketCount = Math.floor(Math.sqrt(n));
  const range = (max - min) / bucketCount + 1;
  const buckets = Array.from({ length: bucketCount }, () => []);

  // Distribute into buckets
  for (let i = 0; i < n; i++) {
    arr[i].state = 'compare';
    setArray([...arr]);
    await sleep(delay / 2);

    const bucketIdx = Math.floor((arr[i].value - min) / range);
    buckets[Math.min(bucketIdx, bucketCount - 1)].push(arr[i]);
    arr[i].state = 'swap';
    setArray([...arr]);
    await sleep(delay / 2);
  }

  // Sort individual buckets using insertion sort
  for (let i = 0; i < bucketCount; i++) {
    buckets[i].sort((a, b) => a.value - b.value);
  }

  // Concatenate all buckets
  let index = 0;
  for (let i = 0; i < bucketCount; i++) {
    for (let j = 0; j < buckets[i].length; j++) {
      arr[index] = { ...buckets[i][j], state: 'sorted' };
      setArray([...arr]);
      await sleep(delay);
      index++;
    }
  }
};
