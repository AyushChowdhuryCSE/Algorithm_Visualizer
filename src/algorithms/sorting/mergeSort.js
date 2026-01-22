import { sleep } from '../../utils/helpers';

export const mergeSort = async (array, setArray, speed) => {
  const delay = Math.max(1, 500 - speed * 5);
  const arr = [...array];
  
  await mergeSortHelper(arr, 0, arr.length - 1, setArray, delay);
  
  // Mark all as sorted
  for (let i = 0; i < arr.length; i++) {
    arr[i].state = 'sorted';
  }
  setArray([...arr]);
};

const mergeSortHelper = async (arr, start, end, setArray, delay) => {
  if (start >= end) return;
  
  const mid = Math.floor((start + end) / 2);
  await mergeSortHelper(arr, start, mid, setArray, delay);
  await mergeSortHelper(arr, mid + 1, end, setArray, delay);
  await merge(arr, start, mid, end, setArray, delay);
};

const merge = async (arr, start, mid, end, setArray, delay) => {
  const left = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);
  
  let i = 0, j = 0, k = start;
  
  while (i < left.length && j < right.length) {
    // Highlight comparison
    arr[start + i].state = 'compare';
    arr[mid + 1 + j].state = 'compare';
    setArray([...arr]);
    await sleep(delay);
    
    if (left[i].value <= right[j].value) {
      arr[k] = { ...left[i], state: 'swap' };
      i++;
    } else {
      arr[k] = { ...right[j], state: 'swap' };
      j++;
    }
    setArray([...arr]);
    await sleep(delay);
    arr[k].state = 'default';
    k++;
  }
  
  while (i < left.length) {
    arr[k] = { ...left[i], state: 'default' };
    i++;
    k++;
    setArray([...arr]);
    await sleep(delay / 2);
  }
  
  while (j < right.length) {
    arr[k] = { ...right[j], state: 'default' };
    j++;
    k++;
    setArray([...arr]);
    await sleep(delay / 2);
  }
};
