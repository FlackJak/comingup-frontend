"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

export default function About() {
  const [content, setContent] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('content_about');
    if (saved) {
      setContent(saved);
    } else {
      fetch('/content/about.md')
        .then(res => res.text())
        .then(text => setContent(text));
    }
  }, []);

  return (
    <div className="prose dark:prose-invert max-w-4xl mx-auto">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
