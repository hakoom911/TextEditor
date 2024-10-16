/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-empty-pattern */

import useEditor, { ICtrlActions, IMethods } from "@/hooks/useEditor";
import { cn } from "@/lib/utils";
import { KeyboardEvent, useState } from "react";

type Props = {};

export default function TextEditor({}: Props) {
  const {text,cursor,actions,ctrlActions,insertCharacter,onEditorPanelClick} = useEditor()
  const [isActive,setIsActive] = useState(false);

  const handleKeyDown = (e: KeyboardEvent) => {

    // --------------------------------------------------------
    // Check if the event have ctrl key and it's function exist
    // --------------------------------------------------------
    if (e.ctrlKey && Object.keys(ctrlActions).includes(`Ctrl${e.key}`)) {
      e.preventDefault();
      ctrlActions[`Ctrl${e.key}` as keyof ICtrlActions]()
      return;
    }
    
    const { key }= e;
    if (key.length === 1) {
      insertCharacter(key);
    }else if (Object.keys(actions).includes(key)){
      actions[key as keyof IMethods]()
    }
  };

  // console.log(`array:${JSON.stringify(text, null, 2)}`);
  return (
    <div onClick={()=>setIsActive(true)}  className="relative py-4 flex flex-col items-center text-muted justify-center bg-stone-900 font-mono p-4  shadow-xl rounded-lg h-[80vh] w-[80vw] ">
      <div className="flex  h-[100%] w-[100%] bg-stone-800 overflow-auto ">
        <EditorText
          isActive={isActive}
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
  isActive:boolean;
};

function EditorText({onPointerClick,onKeyDown,text,cursor,isActive}: EditorTextType) {
   
  const renderText = () => {
    return text.map((line, rowIndex) => {
      const isPointerLine: boolean = cursor.row === rowIndex;
      return (
        <>
          <div
            key={`row-${rowIndex}`}
            className={cn(
              "w-full flex   border-t-[1.5px] border-b-[1.5px] border-transparent",
              isPointerLine && " border-stone-600"
            )}
          >
            <span
              className={cn(
                "w-[3%] px-5 text-muted-foreground",
                isPointerLine && "text-white"
              )}
            >
              {rowIndex + 1}
            </span>
            {line.map((char, colIndex) => (
              <div
                key={`part-row-${rowIndex+1}-${colIndex+rowIndex}`}
                className="relative z-0 justify-center"
                onClick={(e) => {
                  e.preventDefault()
                  onPointerClick(rowIndex, colIndex)
                }}
              >
                <span className={cn("inline-block  h-4")}>
                  {char === "space" ? "\u00A0" : `${char}`}
                  {cursor.row === rowIndex && cursor.col === colIndex && isActive && (
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
      // onKeyUp={(e)=>{
      //   e.preventDefault()
      //   return console.log(`shift:'${e.shiftKey}' the key:'${e.key}' ctrl:'${e.ctrlKey}'`)}
      // }
        
      tabIndex={0}
      className="w-full flex flex-col whitespace-nowrap overflow-x-auto tracking-wider cursor-text"
    >
      {renderText()}
    </div>
  );
}
