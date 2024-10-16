/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";

export type IMethods = {
    ArrowRight: () => void,
    ArrowLeft: () => void,
    Enter: () => void,
    Backspace: () => void,
    Delete: () => void,
    ArrowUp: () => void
    ArrowDown: () => void
    Tab: () => void
}

export type ICtrlActions = {
    CtrlBackspace: () => void,
    // CtrlArrowRight: () => void,
    // CtrlArrowLeft: () => void,
    // CtrlEnter: () => void,
    // CtrlDelete: () => void,
    // CtrlArrowUp: () => void
    // CtrlArrowDown: () => void
}

const alpha = new Set(["_", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);

const findCloserIncompatibleCharIndex = (array: string[], type: "alphaChar" | "space" | "otherChar") => {
    switch (type) {
        case "space":
            for (let i = array.length - 1; i >= 0; i--) {
                if ((i === 0 && array[i] === "space") || array[i] !== "space") {
                    return i;
                }
            }
            return -1;
        case "alphaChar":
            for (let i = array.length - 1; i >= 0; i--) {
                if ((i === 0 && alpha.has(array[i].toLowerCase())) || !alpha.has(array[i].toLowerCase())) {
                    return i;
                }
            }
            return -1
        default:
            for (let i = array.length - 1; i >= 0; i--) {
                if ((i === 0 && !alpha.has(array[i])) || (alpha.has(array[i]) || array[i] === "space")) {
                    return i;
                }
            }
            return -1;
    }
};

export default function useEditor() {
    const [text, setText] = useState<string[][]>([[" "]]);
    const [cursor, setCursor] = useState({ row: 0, col: 0 });
    const [colPreviousPos, setColPreviousPos] = useState(0);

    const { row, col } = cursor;

    const onEditorPanelClick = useCallback((row: number, col: number) => {
        setCursor({ row, col });
        setColPreviousPos(col);
    }, [])


    // --------------------
    // Single key actions 
    // --------------------

    const ArrowUp = useCallback(() => {
        const { row } = cursor
        if (row > 0) {
            const newCol = text[row - 1].length - 1 < colPreviousPos ? text[row - 1].length - 1 : colPreviousPos
            setCursor({ row: row - 1, col: newCol });
        }
    }, [text, cursor, colPreviousPos]);

    const ArrowDown = useCallback(() => {
        const { row } = cursor
        if (row < text.length - 1) {
            const newCol = text[row + 1].length - 1 < colPreviousPos ? text[row + 1].length - 1 : colPreviousPos
            setCursor({ row: row + 1, col: newCol });
        }
    }, [text, cursor, colPreviousPos]);

    const ArrowRight = useCallback(() => {
        if (col < text[row].length - 1) {
            setCursor({ ...cursor, col: col + 1 });
            setColPreviousPos(col + 1)
        } else if (row < text.length - 1) {
            setCursor({ row: row + 1, col: 0 });
            setColPreviousPos(0)

        }
    }, [text, cursor]);

    const ArrowLeft = useCallback(() => {
        if (col > 0) {
            setCursor({ ...cursor, col: col - 1 });
            setColPreviousPos(col - 1)

        } else if (row > 0) {
            setCursor({ row: row - 1, col: text[row - 1].length - 1 });
            setColPreviousPos(text[row - 1].length - 1)
        }
    }, [text, cursor]);

    const Enter = useCallback(() => {
        const newText = [...text];
        const currentLine = newText[row];
        const newLine = currentLine.slice(col);
        newText[row] = currentLine.slice(0, col);
        newText.splice(row + 1, 0, newLine);
        newText[row].push(" ");

        setText(newText);
        setCursor({ row: row + 1, col: 0 });
        setColPreviousPos(0)
    }, [text, cursor]);

    const Backspace = useCallback(() => {
        if (col > 0) {
            const newText = [...text];
            const currentLine = newText[row];

            newText[row] = [
                ...currentLine.slice(0, col - 1),
                ...currentLine.slice(col),
            ];

            setText(newText);
            setCursor({ row: row, col: col - 1 });
            setColPreviousPos(col - 1)
        } else if (row > 0) {
            const newText = [...text];
            const previousLine = newText[row - 1];
            previousLine.pop();
            newText[row - 1] = [...previousLine, ...newText[row]];
            newText.splice(row, 1);

            setText(newText);
            setCursor({ row: row - 1, col: previousLine.length });
            setColPreviousPos(previousLine.length)
        }
    }, [text, cursor]);

    const Delete = useCallback(() => {
        if (text[row].length - 1 > col) {
            const newText = [...text];
            const currentLine = newText[row];
            const firstPartOfLine = [...currentLine.slice(0, col + 1)];

            firstPartOfLine.pop();
            newText[row] = [
                ...firstPartOfLine,
                ...currentLine.slice(col + 1),
            ];

            setText(newText);
        } else if (text.length - 1 > row) {

            const newText = [...text];
            const afterLine = newText[row + 1];

            newText[row].pop()
            newText[row] = [...newText[row], ...afterLine];
            newText.splice(row + 1, 1);

            setText(newText);
        }
    }, [text, cursor]);

    const Tab = useCallback(() => {
        const newText =[...text];
        newText[row] = [...newText[row].slice(0,col),"space","space","space","space",...newText[row].slice(col)];
        setText(newText);
        setCursor({row,col:col+4});
        setColPreviousPos(col+4);
        }
    , [text, cursor]);

    const insertCharacter = useCallback((char: string) => {
        const newText = [...text];
        const newChar = char === " " ? "space" : char;
        if (newText[row][newText[row].length - 1] === " ") {
            newText[row].pop();
        }
        newText[row] = [
            ...newText[row].slice(0, col),
            newChar,
            ...newText[row].slice(col),
        ];
        newText[row].push(" ");
        setText(newText);
        setCursor({ row: row, col: col + 1 });
        setColPreviousPos(col + 1)
    }, [text, cursor]);


    // ----------------------------
    // Ctrl with other key actions
    // ----------------------------

    const CtrlBackspace = useCallback(() => {
        
        if (text.length === 1 && text[0][0] === " ") return;
        if (col > 0) {
            const newText = [...text];
            let closerIncompatibleCharIndex: number = -1;
            if (newText[row][col - 1] === "space") {
                closerIncompatibleCharIndex = findCloserIncompatibleCharIndex(newText[row].slice(0, col - 1), "space");
            } else if (alpha.has(newText[row][col - 1])) {
                closerIncompatibleCharIndex = findCloserIncompatibleCharIndex(newText[row].slice(0, col - 1), "alphaChar");
            } else {
                closerIncompatibleCharIndex = findCloserIncompatibleCharIndex(newText[row].slice(0, col - 1), "otherChar");
            }

            if (closerIncompatibleCharIndex !== -1) {
                closerIncompatibleCharIndex = closerIncompatibleCharIndex > 0 ?  closerIncompatibleCharIndex + 1 : closerIncompatibleCharIndex
                newText[row] = [...newText[row].slice(0, closerIncompatibleCharIndex), ...newText[row].slice(col)]
                setText(newText);
                setCursor({ row, col: closerIncompatibleCharIndex })
                setColPreviousPos(closerIncompatibleCharIndex)
            }
        } else if (row > 0) {
            const newText = [...text];
            const previousLine = newText[row - 1];
            previousLine.pop();
            newText[row - 1] = [...previousLine, ...newText[row]];
            newText.splice(row, 1);

            setText(newText);
            setCursor({ row: row - 1, col: previousLine.length });
            setColPreviousPos(previousLine.length)
        }
    }, [text, cursor])




    const singleKeyActions: IMethods = { ArrowLeft, ArrowRight, Backspace, Delete, Enter, ArrowUp, ArrowDown ,Tab }

    const ctrlActions: ICtrlActions = { CtrlBackspace };

    return { singleKeyActions, ctrlActions, insertCharacter, onEditorPanelClick, text, cursor }

}