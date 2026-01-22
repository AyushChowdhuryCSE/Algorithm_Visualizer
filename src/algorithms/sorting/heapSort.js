import { sleep } from '../../utils/helpers';

export const heapSort = async (array, setArray, speed) => {
  const delay = Math.max(1, 500 - speed * 5);
  const arr = [...array];
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    await heapify(arr, n, i, setArray, delay);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    arr[0].state = 'swap';
    arr[i].state = 'swap';
    setArray([...arr]);
    await sleep(delay);

    [arr[0], arr[i]] = [arr[i], arr[0]];
    arr[i].state = 'sorted';
    setArray([...arr]);
    await sleep(delay);

    await heapify(arr, i, 0, setArray, delay);
  }

  arr[0].state = 'sorted';
  setArray([...arr]);
};

const heapify = async (arr, n, i, setArray, delay) => {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n) {
    arr[left].state = 'compare';
    setArray([...arr]);
    await sleep(delay / 2);
    if (arr[left].value > arr[largest].value) {
      largest = left;
    }
    arr[left].state = arr[left].state === 'sorted' ? 'sorted' : 'default';
  }

  if (right < n) {
    arr[right].state = 'compare';
    setArray([...arr]);
    await sleep(delay / 2);
    if (arr[right].value > arr[largest].value) {
      largest = right;
    }
    arr[right].state = arr[right].state === 'sorted' ? 'sorted' : 'default';
  }

  if (largest !== i) {
    arr[i].state = 'swap';
    arr[largest].state = 'swap';
    setArray([...arr]);
    await sleep(delay);

    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    arr[i].state = arr[i].state === 'sorted' ? 'sorted' : 'default';
    arr[largest].state = arr[largest].state === 'sorted' ? 'sorted' : 'default';
    setArray([...arr]);

    await heapify(arr, n, largest, setArray, delay);
  }
};
