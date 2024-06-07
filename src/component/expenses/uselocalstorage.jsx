import { useEffect } from 'react';

const UseLocalStorage = (key, value) => {
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
};

export default UseLocalStorage;
