import { sleep } from '../../utils/helpers';

export const insertionSort = async (array, setArray, speed) => {
  const delay = Math.max(1, 500 - speed * 5);
  const arr = [...array];
  const n = arr.length;

  arr[0].state = 'sorted';
  setArray([...arr]);

  for (let i = 1; i < n; i++) {
    let key = { ...arr[i] }; // Clone object to avoid reference issues
    arr[i] = { ...arr[i], state: 'compare' }; // Visual update on a copy
    setArray([...arr]);
    await sleep(delay);

    let j = i - 1;
    while (j >= 0 && arr[j].value > key.value) {
      arr[j].state = 'swap';
      setArray([...arr]);
      await sleep(delay);
      
      arr[j + 1] = { ...arr[j] }; // Clone shifted element
      arr[j].state = 'sorted';
      j--;
      setArray([...arr]);
    }

    arr[j + 1] = { ...key, state: 'sorted' }; // Restore key as a new copy
    setArray([...arr]);
    await sleep(delay);
  }

  // Mark all sorted
  for (let i = 0; i < n; i++) {
    arr[i].state = 'sorted';
  }
  setArray([...arr]);
};
