import { sleep } from '../../utils/helpers';

export const radixSort = async (array, setArray, speed) => {
  const delay = Math.max(1, 500 - speed * 5);
  const arr = [...array];
  const n = arr.length;

  // Find max to know number of digits
  let max = arr[0].value;
  for (let i = 1; i < n; i++) {
    if (arr[i].value > max) max = arr[i].value;
  }

  // Process each digit
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    await countingSortByDigit(arr, n, exp, setArray, delay);
  }

  // Mark all sorted
  for (let i = 0; i < n; i++) {
    arr[i].state = 'sorted';
  }
  setArray([...arr]);
};

const countingSortByDigit = async (arr, n, exp, setArray, delay) => {
  const output = new Array(n);
  const count = new Array(10).fill(0);

  // Count occurrences
  for (let i = 0; i < n; i++) {
    arr[i].state = 'compare';
    setArray([...arr]);
    await sleep(delay / 2);
    
    const digit = Math.floor(arr[i].value / exp) % 10;
    count[digit]++;
    arr[i].state = 'default';
  }

  // Cumulative count
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  // Build output
  for (let i = n - 1; i >= 0; i--) {
    arr[i].state = 'swap';
    setArray([...arr]);
    await sleep(delay);

    const digit = Math.floor(arr[i].value / exp) % 10;
    output[count[digit] - 1] = { ...arr[i] };
    count[digit]--;
    arr[i].state = 'default';
  }

  // Copy back
  for (let i = 0; i < n; i++) {
    arr[i] = { ...output[i], state: 'default' };
    setArray([...arr]);
    await sleep(delay / 4);
  }
};
