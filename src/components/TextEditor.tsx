/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-empty-pattern */

import useEditor, { IMethods } from "@/hooks/useEditor";
import { cn } from "@/lib/utils";
import { KeyboardEvent } from "react";

type Props = {};





export default function TextEditor({}: Props) {
  const {text,cursor,actions,insertCharacter,onEditorPanelClick} = useEditor()

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    const { key }= e;
    if (key.length === 1) {
      insertCharacter(key);
    }else if (Object.keys(actions).includes(key)){
      actions[key as keyof IMethods]()
    }
    console.log(`key:${key}`);

  };

  console.log(`array:${JSON.stringify(text, null, 2)}`);
  return (
    <div className="relative py-4 flex flex-col items-center justify-center bg-stone-900 text-muted-foreground leading-5 p-4  shadow-xl rounded-lg h-[80vh] w-[80vw] ">
      <div className="flex  h-[100%] w-[100%] bg-stone-800 overflow-auto ">
        <EditorText
          text={text}
          cursor={cursor}
          onPointerClick={(row, col) => onEditorPanelClick( row, col )}
          onKeyDown={(e) => handleKeyDown(e)}
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
  onKeyDown: (e: any) => void;
};

function EditorText({onPointerClick,onKeyDown,text,cursor}: EditorTextType) {

  const renderText = () => {
    return text.map((line, rowIndex) => {
      const isPointerLine: boolean = cursor.row === rowIndex;
      return (
        <>
          <div
            key={rowIndex}
            className={cn(
              "w-full flex   border-t-[1.5px] border-b-[1.5px] border-transparent",
              isPointerLine && " border-stone-600"
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
                <span className={cn("")}>
                  {char === "space" ? "\u00A0" : `${char}`}
                  {cursor.row === rowIndex && cursor.col === colIndex && (
                    <div className="absolute inset-0 animate-blink-cursor  z-[999] px-px bg-white  w-0.5 h-5 justify-self-start" />
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
      // onFocusCapture={}
      className="w-full flex flex-col whitespace-nowrap overflow-x-auto tracking-wider cursor-text"
    >
      {renderText()}
    </div>
  );
}
