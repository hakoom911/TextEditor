/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-empty-pattern */

import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {};

export default function TextEditor({}: Props) {
  const [text, setText] = useState([[""]]);
  const [cursor, setCursor] = useState({ row: 0, col: 2 });

  const insertCharacter = (char: string) => {
    const newText = [...text];
    newText[cursor.row] = [
      ...newText[cursor.row].slice(0, cursor.col),
      char, 
      ...newText[cursor.row].slice(cursor.col),
    ];
  
    setText(newText);
    setCursor({ row: cursor.row, col: cursor.col + 1 });
  };

  const moveCursorRight = () => {
    if (cursor.col < text[cursor.row].length) {
      setCursor({ ...cursor, col: cursor.col + 1 });
    } else if (cursor.row < text.length - 1) {
      setCursor({ row: cursor.row + 1, col: 0 });
    }
  };

  const moveCursorLeft = () => {
    if (cursor.col > 0) {
      setCursor({ ...cursor, col: cursor.col - 1 });
    } else if (cursor.row > 0) {
      setCursor({ row: cursor.row - 1, col: text[cursor.row - 1].length });
    }
  };

  const insertNewLine = () => {
    const newText = [...text];
    const currentLine = newText[cursor.row];
    const newLine = currentLine.slice(cursor.col);
    newText[cursor.row] = currentLine.slice(0, cursor.col);
    newText.splice(cursor.row + 1, 0, newLine);

    setText(newText);
    setCursor({ row: cursor.row + 1, col: 0 });
  };

  const deleteCharacter = () => {
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

      newText[cursor.row - 1] = [...previousLine, ...newText[cursor.row]];
      newText.splice(cursor.row, 1);

      setText(newText);
      setCursor({ row: cursor.row - 1, col: previousLine.length });
    }
  };

  const handleKeyDown = (e: any) => {
    const { key } = e;

    if (key === "ArrowRight") {
      moveCursorRight();
    } else if (key === "ArrowLeft") {
      moveCursorLeft();
    } else if (key === "Enter") {
      insertNewLine();
    } else if (key === "Backspace") {
      deleteCharacter();
    } else if (key.length === 1) {
      insertCharacter(key);
    }
  };

  console.log(`array:${JSON.stringify(text,null,2)}`)
  return (
    <div className="relative flex flex-col items-center justify-center bg-stone-900 text-amber-600 leading-5 p-4  shadow-xl rounded-lg h-[80vh] w-[80vw] ">
      <div className="flex  h-[100%] w-[100%] bg-stone-800 overflow-auto ">
        <EditorText
          text={text}
          cursor={cursor}
          onPointerClick={(row, col) => setCursor({ row, col })}
          onKeyDown={(e)=>handleKeyDown(e)}
        />
      </div>
      <EditorFooter row={cursor.row} col={cursor.col} />
    </div>
  );
}

function EditorFooter({ row, col }: { row: number; col: number }) {
  return (
    <div className=" absolute  bottom-2 z-[999] h-[4%] bg-black items-center justify-between w-[97%] px-4">
      <div className="flex p-1 justify-start text-sm font-bold text-muted-foreground">
        {/* TODO adding the current row and col */}
        <span>Ln {row + 1}</span> ,<span>Col {col + 1}</span>
      </div>
    </div>
  );
}
type EditorTextType = {
  text: string[][];
  cursor: {
    row: number;
    col: number;
  };
  onPointerClick: (row: number, col: number) => void;
  onKeyDown: (e:any) => void;
};

function EditorText({
  text,
  cursor,
  onPointerClick,
  onKeyDown,
}: EditorTextType) {

  const renderText = () => {
    return text.map((line, rowIndex) => {
      const isPointerLine: boolean = cursor.row === rowIndex;
      return (
        <>
          <div
            key={rowIndex}
            className={cn(
              "w-full flex py-0 ",
              isPointerLine && " border-t-2 border-b-2 border-stone-600"
            )}
          >
            <span
              className={cn(
                "w-[3%] px-2 text-muted-foreground",
                isPointerLine && "text-white"
              )}
            >
              {rowIndex + 1}
            </span>
            {line.map((char, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="relative z-0 justify-center"
                onClick={() => onPointerClick(rowIndex, colIndex)}
              >
                <span className={cn(" ")}>
                  {char !== " "?`${char}`:'\u00A0'}
                  {cursor.row === rowIndex && cursor.col === colIndex && (
                    <div className="absolute inset-0  z-[999] px-px bg-white  h-[18px] justify-self-start" />
                  )}
                </span>
              </div>  
            ))}
          </div>
        </>
      );
    });
  };

  return (
    <div
      onKeyDown={onKeyDown}
      tabIndex={0}
      className="w-full flex flex-col whitespace-nowrap overflow-x-auto tracking-wider cursor-text"
    >
      {renderText()}
    </div>
  );
}
