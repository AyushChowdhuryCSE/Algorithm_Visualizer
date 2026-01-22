import { sleep } from '../../utils/helpers';

export const selectionSort = async (array, setArray, speed) => {
  const delay = Math.max(1, 500 - speed * 5);
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    arr[minIdx].state = 'swap'; // Highlight current minimum
    setArray([...arr]);

    for (let j = i + 1; j < n; j++) {
      arr[j].state = 'compare';
      setArray([...arr]);
      await sleep(delay);

      if (arr[j].value < arr[minIdx].value) {
        arr[minIdx].state = 'default';
        minIdx = j;
        arr[minIdx].state = 'swap';
        setArray([...arr]);
      } else {
        arr[j].state = 'default';
      }
    }

    // Swap
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setArray([...arr]);
      await sleep(delay);
    }

    arr[i].state = 'sorted';
    if (minIdx !== i) arr[minIdx].state = 'default';
    setArray([...arr]);
  }

  arr[n - 1].state = 'sorted';
  setArray([...arr]);
};
