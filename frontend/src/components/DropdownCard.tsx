import React, { useState, useRef, useEffect, ReactNode } from "react";

type DropdownCardProps = {
  title: string;
  children: ReactNode;
};

export default function DropdownCard({ title, children }: DropdownCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<string | number>("auto");

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setHeight(contentRef.current.scrollHeight);
      } else {
        setHeight(0);
      }
    }
  }, [isOpen]);

  return (
    <div
      className="mb-6 rounded-lg shadow-lg"
      style={{ backdropFilter: isOpen ? "none" : "none" }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex justify-between items-center px-4 py-2 font-semibold border rounded-t-lg bg-white"
      >
        <span className="select-none">{title}</span>
        <span className="select-none text-green-600 font-bold text-xl">
          {isOpen ? "−" : "+"}
        </span>
      </div>

      <div
        ref={contentRef}
        style={{
          height: height,
          overflow: "hidden",
          transition: "height 0.5s ease",
          backgroundColor: "white",
          borderTop: "1px solid #ddd",
          borderRadius: "0 0 0.5rem 0.5rem",
        }}
      >
        <div style={{ padding: isOpen ? "1rem" : 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
