import { useState, useEffect, useRef } from 'react';

export interface UseTypewriterOptions {
  lines: string[];
  baseSpeed?: number;
  humanVariance?: number;
  lineDelay?: number;
  startDelay?: number;
  punctuationDelay?: number;
  onComplete?: () => void;
  skip?: boolean;
}

export function useTypewriter({
  lines,
  baseSpeed = 30,
  humanVariance = 15,
  lineDelay = 200,
  startDelay = 150,
  punctuationDelay = 100,
  onComplete,
  skip = false
}: UseTypewriterOptions) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(!skip);
  const [isComplete, setIsComplete] = useState(skip);
  const [isPaused, setIsPaused] = useState(false);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // A ref to keep track of the latest callbacks to avoid dependency cycles in useEffect
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (skip) {
      setDisplayedLines([...lines]);
      setIsTyping(false);
      setIsComplete(true);
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    if (!lines || lines.length === 0) {
      setIsTyping(false);
      setIsComplete(true);
      if (onCompleteRef.current) onCompleteRef.current();
      return;
    }

    // Reset states when starting
    setDisplayedLines(lines.map(() => ''));
    setCurrentLineIndex(0);
    setCurrentCharIndex(0);
    setIsComplete(false);
    setIsPaused(false);
    setIsTyping(false); // will be true after startDelay
    
    // Start delay
    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
    }, startDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // We explicitly don't want to restart if lines change slightly unless it's a completely new command.
  // Assuming this hook is mounted once per command output.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip]); 

  // The actual typing trigger
  useEffect(() => {
    if (!isTyping || isComplete || isPaused) return;

    const currentFullLine = lines[currentLineIndex];
    if (currentFullLine === undefined) return;
    
    if (currentCharIndex >= currentFullLine.length) {
      // Line finished
      if (currentLineIndex >= lines.length - 1) {
        // All lines finished
        setIsTyping(false);
        setIsComplete(true);
        if (onCompleteRef.current) onCompleteRef.current();
      } else {
        // Move to next line
        setIsPaused(true);
        timeoutRef.current = setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentCharIndex(0);
          setIsPaused(false);
        }, lineDelay);
      }
      return;
    }

    // Calculate delay for next char
    let delay = baseSpeed + (Math.random() * humanVariance * 2 - humanVariance);
    const lastChar = currentFullLine[currentCharIndex - 1];
    if (lastChar && ['.', ',', ':', '!', '?'].includes(lastChar)) {
      delay += punctuationDelay;
    }

    timeoutRef.current = setTimeout(() => {
      setDisplayedLines(prev => {
        const newLines = [...prev];
        newLines[currentLineIndex] = currentFullLine.substring(0, currentCharIndex + 1);
        return newLines;
      });
      setCurrentCharIndex(prev => prev + 1);
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [currentCharIndex, currentLineIndex, isTyping, isComplete, isPaused, baseSpeed, humanVariance, lineDelay, punctuationDelay, lines]);

  return {
    displayedLines,
    isTyping,
    isComplete,
    isPaused
  };
}
