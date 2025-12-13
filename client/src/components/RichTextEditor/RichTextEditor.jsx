import { useState } from 'react';
import { Input } from 'antd';
import styles from './RichTextEditor.module.css';

const { TextArea } = Input;

const RichTextEditor = ({ value, onChange, placeholder = "Viết nội dung blog của bạn..." }) => {
  const [showPreview, setShowPreview] = useState(false);

  const insertMarkup = (before, after = '') => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
  };

  return (
    <div className={styles.editorWrapper}>
      <div className={styles.toolbar}>
        <button type="button" onClick={() => insertMarkup('<h2>', '</h2>')} title="Heading 2">
          <strong>H2</strong>
        </button>
        <button type="button" onClick={() => insertMarkup('<h3>', '</h3>')} title="Heading 3">
          <strong>H3</strong>
        </button>
        <button type="button" onClick={() => insertMarkup('<strong>', '</strong>')} title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" onClick={() => insertMarkup('<em>', '</em>')} title="Italic">
          <em>I</em>
        </button>
        <button type="button" onClick={() => insertMarkup('<code>', '</code>')} title="Inline Code">
          &lt;/&gt;
        </button>
        <button type="button" onClick={() => insertMarkup('<pre><code>', '</code></pre>')} title="Code Block">
          Code Block
        </button>
        <button type="button" onClick={() => insertMarkup('<ul>\n  <li>', '</li>\n</ul>')} title="List">
          • List
        </button>
        <button type="button" onClick={() => insertMarkup('<a href="">', '</a>')} title="Link">
          Link
        </button>
        <button type="button" onClick={() => insertMarkup('<img src="" alt="', '" />')} title="Image">
          Image
        </button>
        <div className={styles.divider} />
        <button 
          type="button" 
          onClick={() => setShowPreview(!showPreview)}
          className={showPreview ? styles.active : ''}
          title="Preview"
        >
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {showPreview ? (
        <div 
          className={styles.preview}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      ) : (
        <TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={15}
          className={styles.textarea}
        />
      )}

      <div className={styles.hint}>
        Tip: Sử dụng HTML tags như &lt;h2&gt;, &lt;strong&gt;, &lt;code&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
      </div>
    </div>
  );
};

export default RichTextEditor;
