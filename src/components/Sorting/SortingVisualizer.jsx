import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { generateRandomArray } from '../../utils/helpers';
import { bubbleSort } from '../../algorithms/sorting/bubbleSort';
import { mergeSort } from '../../algorithms/sorting/mergeSort';
import { quickSort } from '../../algorithms/sorting/quickSort';
import { selectionSort } from '../../algorithms/sorting/selectionSort';
import { insertionSort } from '../../algorithms/sorting/insertionSort';
import { heapSort } from '../../algorithms/sorting/heapSort';
import { shellSort } from '../../algorithms/sorting/shellSort';
import { countingSort } from '../../algorithms/sorting/countingSort';
import { radixSort } from '../../algorithms/sorting/radixSort';
import { bucketSort } from '../../algorithms/sorting/bucketSort';
import './SortingVisualizer.css';

const ALGORITHMS = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'heap', label: 'Heap Sort' },
  { value: 'shell', label: 'Shell Sort' },
  { value: 'counting', label: 'Counting Sort' },
  { value: 'radix', label: 'Radix Sort' },
  { value: 'bucket', label: 'Bucket Sort' },
];

const SortingVisualizer = () => {
  const { speed, arraySize, setArraySize, setSpeed, isPlaying, setIsPlaying } = useSettings();
  const [array, setArray] = useState([]);
  const [algorithm, setAlgorithm] = useState('bubble');

  useEffect(() => {
    if (!isPlaying) {
      resetArray();
    }
  }, [arraySize]);

  const resetArray = () => {
    const newArray = generateRandomArray(arraySize, 10, 500);
    setArray(newArray);
    setIsPlaying(false);
  };

  const handleSort = async () => {
    setIsPlaying(true);
    switch (algorithm) {
      case 'bubble':
        await bubbleSort(array, setArray, speed);
        break;
      case 'selection':
        await selectionSort(array, setArray, speed);
        break;
      case 'insertion':
        await insertionSort(array, setArray, speed);
        break;
      case 'merge':
        await mergeSort(array, setArray, speed);
        break;
      case 'quick':
        await quickSort(array, setArray, speed);
        break;
      case 'heap':
        await heapSort(array, setArray, speed);
        break;
      case 'shell':
        await shellSort(array, setArray, speed);
        break;
      case 'counting':
        await countingSort(array, setArray, speed);
        break;
      case 'radix':
        await radixSort(array, setArray, speed);
        break;
      case 'bucket':
        await bucketSort(array, setArray, speed);
        break;
      default:
        await bubbleSort(array, setArray, speed);
    }
    setIsPlaying(false);
  };

  return (
    <div className="sorting-container">
      <div className="array-container">
        {array.map((bar, idx) => (
          <div
            key={idx}
            className={`array-bar ${bar.state}`}
            style={{
              height: `${(bar.value / 500) * 80}%`,
              width: `${Math.max(2, 600 / arraySize)}px`
            }}
          ></div>
        ))}
      </div>
      
      <div className="controls-overlay">
        <div className="algo-select-group">
          <label>
            Algorithm
            <select 
              value={algorithm} 
              onChange={(e) => setAlgorithm(e.target.value)}
              disabled={isPlaying}
              className="algo-select"
            >
              {ALGORITHMS.map((algo) => (
                <option key={algo.value} value={algo.value}>
                  {algo.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="sliders-group">
          <label>
            Size: {arraySize}
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={arraySize} 
              onChange={(e) => setArraySize(Number(e.target.value))}
              disabled={isPlaying}
            />
          </label>
          <label>
            Speed: {speed}
            <input 
              type="range" 
              min="1" 
              max="100" 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
              disabled={isPlaying}
            />
          </label>
        </div>
        <div className="buttons-group">
          <button 
            className="control-btn primary" 
            onClick={handleSort} 
            disabled={isPlaying}
          >
            Sort
          </button>
          <button 
            className="control-btn secondary" 
            onClick={resetArray} 
            disabled={isPlaying}
          >
            New
          </button>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
