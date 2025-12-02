// Ví dụ custom hook, bạn có thể xoá hoặc thay thế
import { useState } from 'react';

export function useExample() {
  const [value, setValue] = useState<string>('');
  return { value, setValue };
}


