/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";

export type IMethods = {
    ArrowRight:() =>void,
    ArrowLeft:() =>void,
    Enter:() =>void,
    Backspace:() =>void,
    Delete:() =>void,
  }

export default function useEditor() {
    const [text, setText] = useState<string[][]>([[" "]]);
    const [cursor, setCursor] = useState({ row: 0, col: 0 });

    const onEditorPanelClick =  useCallback((row:number,col:number) => {
        setCursor({row,col});
    },[])


    const ArrowRight = useCallback(() => {
        if (cursor.col < text[cursor.row].length - 1) {
            setCursor({ ...cursor, col: cursor.col + 1 });
        } else if (cursor.row < text.length - 1) {
            setCursor({ row: cursor.row + 1, col: 0 });
        }
    }, [text,cursor]);

    const ArrowLeft = useCallback(() => {
        if (cursor.col > 0) {
            setCursor({ ...cursor, col: cursor.col - 1 });
        } else if (cursor.row > 0) {
            setCursor({ row: cursor.row - 1, col: text[cursor.row - 1].length - 1 });
        }
    }, [text,cursor]);

    const Enter = useCallback(() => {
        const newText = [...text];
        const currentLine = newText[cursor.row];
        const newLine = currentLine.slice(cursor.col);
        newText[cursor.row] = currentLine.slice(0, cursor.col);
        newText.splice(cursor.row + 1, 0, newLine);
        newText[cursor.row].push(" ");

        setText(newText);
        setCursor({ row: cursor.row + 1, col: 0 });
    }, [text,cursor]);

    const Backspace = useCallback(() => {
        if (cursor.col > 0) {
            const newText = [...text];
            const currentLine = newText[cursor.row];

            newText[cursor.row] = [
                ...currentLine.slice(0, cursor.col - 1),
                ...currentLine.slice(cursor.col),
            ];

            setText(newText);
            setCursor({ row: cursor.row, col: cursor.col - 1 });
        } else if (cursor.row > 0) {
            const newText = [...text];
            const previousLine = newText[cursor.row - 1];
            previousLine.pop();
            newText[cursor.row - 1] = [...previousLine, ...newText[cursor.row]];
            newText.splice(cursor.row, 1);

            setText(newText);
            setCursor({ row: cursor.row - 1, col: previousLine.length });
        }
    }, [text,cursor]);

    const Delete = useCallback(() => {
        if (text[cursor.row].length - 1 > cursor.col) {
            const newText = [...text];
            const currentLine = newText[cursor.row];
            const firstPartOfLine = [...currentLine.slice(0, cursor.col + 1)];

            firstPartOfLine.pop();
            newText[cursor.row] = [
                ...firstPartOfLine,
                ...currentLine.slice(cursor.col + 1),
            ];

            setText(newText);
        } else if (text.length - 1 > cursor.row) {

            const newText = [...text];
            const afterLine = newText[cursor.row + 1];

            newText[cursor.row].pop()
            newText[cursor.row] = [...newText[cursor.row], ...afterLine];
            newText.splice(cursor.row + 1, 1);

            setText(newText);
        }
    }, [text,cursor]);

    const insertCharacter = useCallback((char: string) => {
        const newText = [...text];
        const newChar = char === " " ? "space" : char;
        if (newText[cursor.row][newText[cursor.row].length - 1] === " ") {
          newText[cursor.row].pop();
        }
        newText[cursor.row] = [
          ...newText[cursor.row].slice(0, cursor.col),
          newChar,
          ...newText[cursor.row].slice(cursor.col),
        ];
        newText[cursor.row].push(" ");
        setText(newText);
        setCursor({ row: cursor.row, col: cursor.col + 1 });
      },[text,cursor]);

      const actions :IMethods ={ArrowLeft,ArrowRight,Backspace,Delete,Enter}

      return {actions,insertCharacter,onEditorPanelClick,text,cursor}

}