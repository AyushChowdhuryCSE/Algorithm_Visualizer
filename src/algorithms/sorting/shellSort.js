import { sleep } from "../../utils/helpers";

export const shellSort = async (array, setArray, speed) => {
  const delay = Math.max(1, 500 - speed * 5);
  const arr = [...array];
  const n = arr.length;

  // Start with large gap, reduce
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      // Create a copy of the object so we don't duplicate references
      let temp = { ...arr[i] };
      arr[i] = { ...arr[i], state: "compare" }; // Create distinct object for visual update
      setArray([...arr]);
      await sleep(delay);

      let j = i;
      while (j >= gap && arr[j - gap].value > temp.value) {
        arr[j - gap].state = "swap";
        setArray([...arr]);
        await sleep(delay);

        // Copy the object values, don't just assign reference
        arr[j] = { ...arr[j - gap] };

        arr[j - gap].state = "default";
        j -= gap;
        setArray([...arr]);
      }

      arr[j] = temp;
      arr[j].state = "default";
      setArray([...arr]);
    }
  }

  // Mark all sorted
  for (let i = 0; i < n; i++) {
    arr[i].state = "sorted";
  }
  setArray([...arr]);
};
