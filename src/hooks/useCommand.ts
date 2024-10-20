import { useCallback, useState } from 'react';

export interface ICommand{
    execute():void,
    undo():void,
    
}

export default function useCommand() {
  const [undoStack, setUndoStack] = useState<ICommand[]>([]);
  const [redoStack, setRedoStack] = useState<ICommand[]>([]);

  const executeCommand = useCallback((command: ICommand) => {
    command.execute();
    setUndoStack((prev) => [...prev, command]); 
    setRedoStack([]); 
  },[]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const lastCommand = undoStack[undoStack.length - 1];
    lastCommand.undo();
    setUndoStack((prev) => prev.slice(0, -1)); 
    setRedoStack((prev) => [...prev, lastCommand]);
  },[undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const lastUndoneCommand = redoStack[redoStack.length - 1];
    lastUndoneCommand.execute();
    setRedoStack((prev) => prev.slice(0, -1));
    setUndoStack((prev) => [...prev, lastUndoneCommand]);
  },[redoStack]);

  return { executeCommand, undo, redo };
}