"use client";

import React, { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  UnderlineIcon,
  LinkIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const MenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonProps & { active?: boolean; tooltip: string }
>(({ className, active, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="sm"
    className={cn(
      "h-8 w-8 p-1",
      active && "bg-sky-300 text-primary",
      className
    )}
    {...props}
  />
));
MenuButton.displayName = "MenuButton";

const RichTextEditor = ({
  value,
  onChange,
  disabled,
  placeholder = "Start typing...",
}: RichTextEditorProps) => {
  const [activeTab, setActiveTab] = useState("write");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
        bulletList: {
          itemTypeName: "listItem",
        },
        orderedList: {
          itemTypeName: "listItem",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4",
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[150px] p-3",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const toggleHeading = useCallback(
    (level: 1 | 2) => {
      if (!editor) return;
      editor.chain().focus().toggleHeading({ level }).run();
    },
    [editor]
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <div className="flex items-center gap-1">
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBold().run();
              }}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
            >
              <Bold className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleItalic().run();
              }}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
            >
              <Italic className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleUnderline().run();
              }}
              disabled={!editor.can().chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
            >
              <UnderlineIcon className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                setLink();
              }}
              active={editor.isActive("link")}
            >
              <LinkIcon className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                toggleHeading(1);
              }}
              active={editor.isActive("heading", { level: 1 })}
            >
              <Heading1 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                toggleHeading(2);
              }}
              active={editor.isActive("heading", { level: 2 })}
            >
              <Heading2 className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleBulletList().run();
              }}
              active={editor.isActive("bulletList")}
            >
              <List className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().toggleOrderedList().run();
              }}
              active={editor.isActive("orderedList")}
            >
              <ListOrdered className="h-4 w-4" />
            </MenuButton>
          </div>
          <div className="flex items-center gap-1">
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().undo().run();
              }}
              disabled={!editor.can().chain().focus().undo().run()}
            >
              <Undo className="h-4 w-4" />
            </MenuButton>
            <MenuButton
              onClick={(e) => {
                e.preventDefault();
                editor.chain().focus().redo().run();
              }}
              disabled={!editor.can().chain().focus().redo().run()}
            >
              <Redo className="h-4 w-4" />
            </MenuButton>
          </div>
        </div>
        <TabsList className="px-3 border-b">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-0">
          <EditorContent editor={editor} disabled={disabled} />
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div
            className="prose prose-sm max-w-none p-3"
            dangerouslySetInnerHTML={{
              __html: editor.getHTML(),
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RichTextEditor;
