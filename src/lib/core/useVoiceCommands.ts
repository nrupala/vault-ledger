import { useState, useCallback } from 'react';

export type VoiceIntent = 'task' | 'note' | 'expense' | 'habit' | 'calendar' | 'unknown';

export interface ParsedCommand {
  intent: VoiceIntent;
  data: any;
  raw: string;
}

export function useVoiceCommands(onCommand: (cmd: ParsedCommand) => void) {
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  const parseIntent = (text: string): ParsedCommand => {
    const lower = text.toLowerCase();
    
    // 1. Task Intent
    if (lower.startsWith('task ') || lower.includes('add task')) {
      return {
        intent: 'task',
        data: { title: text.replace(/task |add task /gi, '').trim() },
        raw: text
      };
    }

    // 2. Expense Intent
    const expenseMatch = lower.match(/(?:expense|log|spent) (\d+) (?:for|on) (.+)/i);
    if (expenseMatch) {
      return {
        intent: 'expense',
        data: { amount: parseFloat(expenseMatch[1]), description: expenseMatch[2].trim() },
        raw: text
      };
    }

    // 3. Note Intent
    if (lower.startsWith('note ') || lower.includes('take note')) {
      return {
        intent: 'note',
        data: { content: text.replace(/note |take note /gi, '').trim() },
        raw: text
      };
    }

    // 4. Habit Intent
    if (lower.startsWith('habit ') || lower.includes('track habit')) {
      return {
        intent: 'habit',
        data: { title: text.replace(/habit |track habit /gi, '').trim() },
        raw: text
      };
    }

    return { intent: 'unknown', data: {}, raw: text };
  };

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastTranscript(transcript);
      const cmd = parseIntent(transcript);
      onCommand(cmd);
    };

    recognition.start();
  }, [onCommand]);

  return { isListening, lastTranscript, startListening };
}
