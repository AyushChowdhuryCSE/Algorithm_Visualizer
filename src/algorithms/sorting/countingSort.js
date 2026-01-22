import { sleep } from '../../utils/helpers';

export const countingSort = async (array, setArray, speed) => {
  const delay = Math.max(1, 500 - speed * 5);
  const arr = [...array];
  const n = arr.length;

  // Find max value
  let max = arr[0].value;
  for (let i = 1; i < n; i++) {
    arr[i].state = 'compare';
    setArray([...arr]);
    await sleep(delay / 4);
    if (arr[i].value > max) {
      max = arr[i].value;
    }
    arr[i].state = 'default';
  }

  // Create counting array
  const count = new Array(max + 1).fill(0);
  
  // Count occurrences
  for (let i = 0; i < n; i++) {
    arr[i].state = 'compare';
    setArray([...arr]);
    await sleep(delay / 2);
    count[arr[i].value]++;
    arr[i].state = 'default';
  }

  // Cumulative count
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  // Build output array
  const output = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    arr[i].state = 'swap';
    setArray([...arr]);
    await sleep(delay);
    
    output[count[arr[i].value] - 1] = { ...arr[i] };
    count[arr[i].value]--;
    arr[i].state = 'default';
  }

  // Copy to original
  for (let i = 0; i < n; i++) {
    arr[i] = { ...output[i], state: 'sorted' };
    setArray([...arr]);
    await sleep(delay / 2);
  }
};
