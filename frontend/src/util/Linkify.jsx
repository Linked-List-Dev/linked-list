import React from 'react';

function Linkify({ text }) {
  if (!text) {
    return null; // Return null or some default content if text is undefined
  }

  // Regular expression to detect URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Split the text into an array of segments
  const segments = text.split(urlRegex)

  // Create a new array with text segments and link elements
  const content = segments.map((segment, index) => {
    if (segment.match(urlRegex)) {
      return (
        <a key={index} href={segment} target="_blank" rel="noopener noreferrer">
          {segment}
        </a>
      );
    } else {
      return <span key={index}>{segment}</span>;
    }
  });

  return content;
}

export default Linkify