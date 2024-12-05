"use client"

import React, { useMemo, useRef, useEffect } from "react";

interface PaginationItemProps {
  page: number;
  isCurrent?: boolean;
  colorScheme?: string;
  onPageChange: (page: number) => void;
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  page,
  isCurrent = false,
  colorScheme = 'blue',
  onPageChange
}) => {
  return (
    <button
      onClick={() => onPageChange(page)}
      className={`
        w-8 h-8 rounded-md text-sm font-medium transition-colors duration-200
        ${isCurrent
          ? `bg-${colorScheme}-500 text-white`
          : 'bg-white text-gray-700 hover:bg-gray-100'
        } 
        border border-gray-300
        flex items-center justify-center
      `}
    >
      {page}
    </button>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  pageRange?: number;
  colorScheme?: string;
  justifyPage?: "center" | "start" | "end";
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPage,
  pageRange,
  colorScheme = 'blue',
  justifyPage = 'center',
  onPageChange,
}: PaginationProps) {
  const range = useRef(pageRange ?? 5);
  const prevNum = useRef(1);

  useEffect(() => {
    prevNum.current = currentPage;
  }, [currentPage]);

  const renderPage = useMemo(() => {
    const pagesNumber: number[] = [];
    let iterationCount = Math.floor(
      (range.current + currentPage) / range.current
    );
    let startNum = iterationCount * range.current - range.current;

    if (
      (prevNum.current > startNum &&
        startNum > 1 &&
        currentPage === startNum) ||
      currentPage === totalPage
    ) {
      iterationCount = 1;
      startNum = currentPage - range.current;
    }

    for (let i = startNum; i <= totalPage; i++) {
      if (i > 0 && i < startNum + range.current + 1) {
        pagesNumber.push(i);
      }
    }

    let pages: React.ReactNode[] = [];

    if (startNum > 1) {
      pages.push(
        <span
          key="3dot.prev"
          className="w-8 h-8 flex items-center justify-center text-gray-400"
        >
          ...
        </span>
      );
    }

    pages = [
      ...pages,
      ...pagesNumber.map(num => (
        <PaginationItem
          key={`page.${num}`}
          colorScheme={colorScheme}
          onPageChange={onPageChange}
          page={num}
          isCurrent={currentPage === num}
        />
      )),
    ];

    if (totalPage - pagesNumber[pagesNumber.length - 1] !== 0) {
      pages.push(
        <span
          key="3dot.next"
          className="w-8 h-8 flex items-center justify-center text-gray-400"
        >
          ...
        </span>
      );
    }

    return pages;
  }, [totalPage, currentPage, colorScheme, onPageChange]);

  return (
    <div
      className={`
        flex justify-${justifyPage} 
        items-center mt-8
      `}
    >
      <div className="flex space-x-2 sm:space-x-4">
        {renderPage}
      </div>
    </div>
  );
}

export default Pagination;