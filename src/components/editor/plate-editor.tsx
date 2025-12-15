'use client';

import { normalizeNodeId } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';
import type { Value } from 'platejs';

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { cn } from "@/lib/utils";

export function PlateEditor({
  initialValue,
  onChange,
  readOnly = false
}: {
  initialValue?: Value;
  onChange?: (value: Value) => void;
  readOnly?: boolean;
}) {
  const editor = usePlateEditor({
    plugins: BasicNodesKit,
    value: initialValue || defaultValue,
    readOnly,
  });

  return (
    <Plate editor={editor} onValueChange={({ value }) => onChange?.(value)}>
      <EditorContainer>
        <Editor
          variant="none"
          placeholder={readOnly ? "" : "Tell your story..."}
          className={cn("text-lg focus:outline-none", !readOnly && "min-h-[500px]")}
          readOnly={readOnly}
        />
      </EditorContainer>
    </Plate>
  );
}

export const defaultValue: Value = normalizeNodeId([
  {
    children: [{ text: 'Basic Editor' }],
    type: 'h1',
  },
  {
    children: [{ text: 'Heading 2' }],
    type: 'h2',
  },
  {
    children: [{ text: 'Heading 3' }],
    type: 'h3',
  },
  {
    children: [{ text: 'This is a blockquote element' }],
    type: 'blockquote',
  },
  {
    children: [
      { text: 'Basic marks: ' },
      { bold: true, text: 'bold' },
      { text: ', ' },
      { italic: true, text: 'italic' },
      { text: ', ' },
      { text: 'underline', underline: true },
      { text: ', ' },
      { strikethrough: true, text: 'strikethrough' },
      { text: '.' },
    ],
    type: 'p',
  },
]);
