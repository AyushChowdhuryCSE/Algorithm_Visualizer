import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [speed, setSpeed] = useState(50); // 1-100
  const [arraySize, setArraySize] = useState(50); // 1-100
  const [isPlaying, setIsPlaying] = useState(false);
  const [algorithm, setAlgorithm] = useState('bubble'); // 'bubble', 'merge', 'quick' / 'dijkstra', 'astar', 'dfs'

  return (
    <SettingsContext.Provider value={{
      speed, setSpeed,
      arraySize, setArraySize,
      isPlaying, setIsPlaying,
      algorithm, setAlgorithm
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
