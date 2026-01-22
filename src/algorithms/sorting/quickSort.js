import { sleep } from '../../utils/helpers';

export const quickSort = async (array, setArray, speed) => {
  const delay = Math.max(1, 500 - speed * 5);
  const arr = [...array];
  
  await quickSortHelper(arr, 0, arr.length - 1, setArray, delay);
  
  // Mark all as sorted
  for (let i = 0; i < arr.length; i++) {
    arr[i].state = 'sorted';
  }
  setArray([...arr]);
};

const quickSortHelper = async (arr, low, high, setArray, delay) => {
  if (low < high) {
    const pi = await partition(arr, low, high, setArray, delay);
    await quickSortHelper(arr, low, pi - 1, setArray, delay);
    await quickSortHelper(arr, pi + 1, high, setArray, delay);
  }
};

const partition = async (arr, low, high, setArray, delay) => {
  const pivot = arr[high];
  pivot.state = 'swap'; // Highlight pivot in purple
  setArray([...arr]);
  
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    arr[j].state = 'compare';
    setArray([...arr]);
    await sleep(delay);
    
    if (arr[j].value < pivot.value) {
      i++;
      // Swap arr[i] and arr[j]
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setArray([...arr]);
      await sleep(delay);
    }
    arr[j].state = 'default';
  }
  
  // Swap arr[i+1] and arr[high] (pivot)
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  arr[i + 1].state = 'sorted'; // Pivot is in final position
  setArray([...arr]);
  await sleep(delay);
  
  return i + 1;
};
