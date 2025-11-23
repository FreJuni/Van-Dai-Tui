'use client';
import React from 'react'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cn } from '@/lib/utils';

type TipTapProps = {
    val: string;
}

const TipTap = ({ val }: TipTapProps) => {
    const editor = useEditor({
        extensions: [StarterKit.configure({
            orderedList: {
                HTMLAttributes: {
                    class: 'list-decimal pl-4'
                },
                itemTypeName: 'listItem',
            },
            bulletList: {
                HTMLAttributes: {
                    class: 'list-disc pl-4'
                },
                itemTypeName: 'listItem',
            },
            heading: {
                HTMLAttributes: {
                    class: 'text-2xl font-bold'
                },
                levels: [1]
            }
        }
        )],
        content: val,
        // Don't render immediately on the server to avoid SSR issues
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                )
            }
        }
    });

    return <EditorContent editor={editor} />
}

export default TipTap
