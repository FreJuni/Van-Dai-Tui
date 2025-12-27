'use client';
import React, { useEffect } from 'react'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cn } from '@/lib/utils';
import { Toggle } from '../ui/toggle';
import { Bold, Heading1, Italic, ListCheck, ListOrdered, Strikethrough } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

type TipTapProps = {
    val: string;
}

const TipTap = ({ val }: TipTapProps) => {
    const { setValue } = useFormContext();

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
                class:
                    "min-h-[120px] overflow-y-auto max-h-[200px] px-3 py-2 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            }
        },
        onUpdate: ({ editor }) => {
            const content = editor.getHTML();
            setValue('description', content, {
                shouldDirty: true,
                shouldValidate: true
            });
        }
    });

    useEffect(() => {
        if (editor && val !== editor.getHTML()) {
            editor.commands.setContent(val || '');
        }
    }, [val, editor]);

    return <div className='flex flex-col gap-3'>
        {
            editor &&
            (
                <div>
                    <Toggle
                        pressed={editor.isActive('heading', { level: 1 })}
                        onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        size={'sm'}
                    >
                        <Heading1 className='w-5 h-5' />
                    </Toggle>

                    <Toggle
                        pressed={editor.isActive("bold")}
                        onPressedChange={() => editor.chain().focus().toggleBold().run()}
                        size={'sm'}
                    >
                        <Bold className='w-5 h-5' />
                    </Toggle>

                    <Toggle
                        pressed={editor.isActive("italic")}
                        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                        size={'sm'}
                    >
                        <Italic className='w-5 h-5' />
                    </Toggle>

                    <Toggle
                        pressed={editor.isActive("strike")}
                        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                        size={'sm'}
                    >
                        <Strikethrough className='w-5 h-5' />
                    </Toggle>

                    <Toggle
                        pressed={editor.isActive("orderedList")}
                        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                        size={'sm'}
                    >
                        <ListOrdered className='w-5 h-5' />
                    </Toggle>

                    <Toggle
                        pressed={editor.isActive("bulletList")}
                        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                        size={'sm'}
                    >
                        <ListCheck className='w-5 h-5' />
                    </Toggle>

                </div>
            )
        }
        <EditorContent editor={editor} />
    </div>
}

export default TipTap
