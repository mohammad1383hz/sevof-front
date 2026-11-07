// src/components/article-generate/RichMarkdownEditor.tsx
//
// ویرایشگر متن غنی (WYSIWYG) برای محتوای Markdown.
//
// نصب پیش‌نیاز (فقط یک‌بار):
//   npm install @mdxeditor/editor
//
// ── چرا استایل قبلی به‌هم‌ریخته بود؟ ──
// تلاش می‌کردیم ظاهر تولبارِ خودِ کتابخانه را با حدس‌زدنِ نام کلاس‌های
// داخلی‌اش (که هش‌شده و بین ورژن‌ها عوض می‌شن) override کنیم؛ چون این
// اسم‌ها را نمی‌شد با اطمینان پیش‌بینی کرد، خیلی جاها اصلاً اعمال
// نمی‌شدند. این نسخه رویکردش را عوض کرده: هر بخشی که خودمان می‌سازیم
// (تولبار) کاملاً با کلاس‌های خودمان ساخته می‌شود و کروم پیش‌فرضِ
// کتابخانه برایش خنثی می‌شود؛ فقط ناحیه‌ی متن و پاپ‌آپ‌های داخلی (مثل
// دیالوگ لینک) از رندر خودِ کتابخانه استفاده می‌کنند که برایشان override
// دفاعی و عمومی (نه وابسته به یک نام کلاس خاص) نوشته شده است.

import { forwardRef, useImperativeHandle, useRef } from "react";
import {
  MDXEditor,
  type MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  linkPlugin,
  linkDialogPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertThematicBreak,
  // Separator,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import "./rich-md-editor.css";
import { t } from "../../i18n";

export interface RichMarkdownEditorHandle {
  getMarkdown: () => string;
  setMarkdown: (md: string) => void;
  focus: () => void;
}

interface RichMarkdownEditorProps {
  /** مقدار اولیه‌ی Markdown — چون MDXEditor uncontrolled است، فقط در mount اول اعمال می‌شود */
  initialMarkdown: string;
  onChangeMarkdown: (md: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeightClassName?: string;
  /**
   * سطوح هدینگ مجاز. پیش‌فرض [3, 4] چون H1/H2 برای عنوان مقاله/بخش
   * رزرو شده‌اند (منطق جداسازی بخش‌ها در FinalArticleCard روی "## "
   * حساس است).
   */
  allowedHeadingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[];
}

export const RichMarkdownEditor = forwardRef<RichMarkdownEditorHandle, RichMarkdownEditorProps>(
  (
    {
      initialMarkdown,
      onChangeMarkdown,
      placeholder,
      readOnly,
      minHeightClassName = "rmde-min-h",
      allowedHeadingLevels = [3, 4],
    },
    ref,
  ) => {
    const innerRef = useRef<MDXEditorMethods>(null);

    useImperativeHandle(ref, () => ({
      getMarkdown: () => innerRef.current?.getMarkdown() ?? "",
      setMarkdown: (md: string) => innerRef.current?.setMarkdown(md),
      focus: () => innerRef.current?.focus(),
    }));

    return (
      <div className={`rmde ${readOnly ? "rmde--readonly" : ""}`} dir="auto">
        <MDXEditor
          ref={innerRef}
          markdown={initialMarkdown}
          onChange={onChangeMarkdown}
          placeholder={placeholder ?? t("article.editor.placeholder")}
          className="rmde-editor"
          contentEditableClassName={`rmde-content ${minHeightClassName}`}
          plugins={[
            headingsPlugin({ allowedHeadingLevels }),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            markdownShortcutPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <div className="rmde-toolbar">
                  <div className="rmde-toolbar__group">
                    <UndoRedo />
                  </div>
                  <div className="rmde-toolbar__sep" />
                  <div className="rmde-toolbar__group">
                    <BlockTypeSelect />
                  </div>
                  <div className="rmde-toolbar__sep" />
                  <div className="rmde-toolbar__group">
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                  </div>
                  <div className="rmde-toolbar__sep" />
                  <div className="rmde-toolbar__group">
                    <ListsToggle />
                  </div>
                  <div className="rmde-toolbar__sep" />
                  <div className="rmde-toolbar__group">
                    <CreateLink />
                    <InsertThematicBreak />
                  </div>
                </div>
              ),
            }),
          ]}
        />
      </div>
    );
  },
);

RichMarkdownEditor.displayName = "RichMarkdownEditor";