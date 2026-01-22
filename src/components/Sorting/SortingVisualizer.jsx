import React, { useEffect, useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { generateRandomArray } from '../../utils/helpers';
import { bubbleSort } from '../../algorithms/sorting/bubbleSort';
import './SortingVisualizer.css';

const SortingVisualizer = () => {
  const { speed, arraySize, isPlaying, setIsPlaying, algorithm } = useSettings();
  const [array, setArray] = useState([]);

  // Initialize array on mount or size change
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
    if (algorithm === 'bubble') {
      await bubbleSort(array, setArray, speed);
    }
    // Add other algorithms here
    setIsPlaying(false);
  };

  return (
    <div className="sorting-container">
      <div className="array-container">
        {array.map((bar, idx) => (
          <div
            key={bar.id} // Stable ID is better than index if possible, but index works for simple swaps
            className={`array-bar ${bar.state}`}
            style={{
              height: `${(bar.value / 500) * 80}%`, // Scale to 80% of container height
              width: `${Math.max(2, 600 / arraySize)}px` // Dynamic width
            }}
          ></div>
        ))}
      </div>
      
      <div className="controls-overlay">
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
