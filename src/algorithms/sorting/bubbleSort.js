import { sleep } from '../../utils/helpers';

export const bubbleSort = async (array, setArray, speed) => {
  // Speed conversion: High speed = Low delay
  const delay = Math.max(1, 1000 - speed * 10); 
  
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Check if sorting was stopped (optional, if we have a proper cancel mechanism)
      
      // Highlight comparison
      arr[j].state = 'compare';
      arr[j + 1].state = 'compare';
      setArray([...arr]);
      await sleep(delay);

      if (arr[j].value > arr[j + 1].value) {
        // Swap visual state
        arr[j].state = 'swap';
        arr[j + 1].state = 'swap';
        setArray([...arr]);
        // await sleep(delay); // Optional extra delay for swap

        // Actual Swap
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        
        setArray([...arr]);
        await sleep(delay);
      }

      // Reset state
      arr[j].state = 'default';
      arr[j + 1].state = 'default';
    }
    // Mark last element as sorted
    arr[n - i - 1].state = 'sorted';
    setArray([...arr]);
  }
  
  // Ensure all are marked sorted at the end (redundant but safe)
  for (let i = 0; i < n; i++) {
    arr[i].state = 'sorted';
  }
  setArray([...arr]);
};
