"use client";

import { Plate, usePlateEditor } from "platejs/react";
import { BasicNodesKit } from "@/components/editor/plugins/basic-nodes-kit";
import { Editor } from "@/components/editor/ui/editor";

export function PlateEditor({ initialValue, onChange }: { initialValue?: unknown[], onChange?: (value: unknown[]) => void }) {
  const editor = usePlateEditor({
    plugins: BasicNodesKit,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: (initialValue as unknown as any[]) || [
      {
        type: "p",
        children: [{ text: "" }],
      }
    ],
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }: { value: unknown[] }) => {
        onChange?.(value);
      }}
    >
      <Editor placeholder="Start writing your story..." />
    </Plate>
  );
}
