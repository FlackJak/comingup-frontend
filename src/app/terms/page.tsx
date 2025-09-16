import React from "react";
import ReactMarkdown from "react-markdown";
import fs from "fs";
import path from "path";

export default function TermsPage() {
  const markdown = fs.readFileSync(path.join(process.cwd(), "public/content/terms.md"), "utf-8");

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
