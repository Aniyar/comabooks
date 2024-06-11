import React from "react";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { switchPreview } from "slicers/preview_slicer";
import { CoverEntityDto } from "generated";

const MAX_WIDTH_PER_LINE = 195; // Adjust this value to fit your layout
const MAX_LINES_PER_PAGE = 13;

const measureTextWidth = (text: string, font: string): number => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    return context.measureText(text).width;
  }
  return 0;
};

const splitAnswerIntoLines = (answer: string, font: string): string[] => {
  const paragraphs = answer.split(/\n+/);
  let lines: string[] = [];

  paragraphs.forEach((paragraph) => {
    const words = paragraph.split(/\s+/);
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + word + " ";
      if (measureTextWidth(testLine, font) > MAX_WIDTH_PER_LINE) {
        if (currentLine.trim()) {
          lines.push(currentLine.trim());
        }
        currentLine = word + " ";
      } else {
        currentLine += word + " ";
      }
    });

    if (currentLine.trim()) {
      lines.push(currentLine.trim());
    }

    // Add an empty line to simulate paragraph break
    lines.push("");
  });

  return lines;
};

const splitLinesIntoPages = (lines: string[]): string[][] => {
  let pages: string[][] = [];
  let currentPage: string[] = [];

  lines.forEach((line) => {
    if (currentPage.length >= MAX_LINES_PER_PAGE) {
      pages.push(currentPage);
      currentPage = [];
    }
    currentPage.push(line);
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

export const Preview = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const font = "16px Arial"; // Adjust this value to match your CSS
  const answerLines = splitAnswerIntoLines(answer, font);
  const answerPages = splitLinesIntoPages(answerLines);
  const pageNumber = useSelector<RootState, number>(
    (state) => state.page.value ?? 0
  );
  const coverData = useSelector<RootState, CoverEntityDto | null>(
    (state) => state.cover.value
  );
  const isOddPageNumber = pageNumber % 2 !== 0;

  return (
    <div
      className="book-preview-backdrop"
      onClick={() => dispatch(switchPreview(false))}
    >
      {answerPages.map((pageLines, pageIndex) => (
        <div
          key={pageIndex}
          className="book-preview-content"
          onClick={(e) => e.stopPropagation()}
        >
        {pageIndex === 0 && (
          <p className="preview-question">{question || '\u00A0'}</p>
        )}
          {pageLines.map((line, idx) => (
            <p key={idx} className="preview-answer">
              {line || '\u00A0'}
            </p>
          ))}
          <div className="preview-colon">
            {isOddPageNumber ? (
              <>
                <p>{pageNumber + pageIndex + 1}</p>
                <p>{coverData?.bookName || "Название книги"}</p>
              </>
            ) : (
              <>
                <p>{coverData?.fullName || "Ваше имя"}</p>
                <p>{pageNumber + pageIndex + 1}</p>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Preview;
