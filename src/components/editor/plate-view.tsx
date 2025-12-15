'use client';

import { Plate, usePlateEditor } from 'platejs/react';
import type { Value } from 'platejs';

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';

export function PlateView({ content }: { content: Value }) {
    const editor = usePlateEditor({
        plugins: BasicNodesKit,
        value: content,
        readOnly: true,
    });

    return (
        <Plate editor={editor}>
            <EditorContainer>
                <Editor variant="none" readOnly className="focus:outline-none" />
            </EditorContainer>
        </Plate>
    );
}
