'use client';

import { useState } from 'react';
import CanvaEditor from 'canva-editor';
import type { EditorConfig } from 'canva-editor';
import { WorksheetContentProvider } from '../_contexts/WorksheetContentContext';
import WorksheetBackground from './WorksheetBackground';
import WorksheetSettingsContent from './WorksheetSettingsContent';
import DocumentIcon from 'canva-editor/icons/DocumentIcon';

const A4_CANVAS_DATA = [
  {
    name: '',
    notes: '',
    layers: {
      ROOT: {
        type: { resolvedName: 'RootLayer' },
        props: {
          boxSize: { width: 794, height: 1123 },
          position: { x: 0, y: 0 },
          rotate: 0,
          color: 'transparent',
          image: null,
        },
        locked: false,
        child: [],
        parent: null,
      },
    },
  },
];

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const editorConfig: EditorConfig = {
  apis: {
    url: `${API_BASE_URL}/api`,
    userToken: '',
    searchFonts: '/search-fonts',
    searchTemplates: '/search-templates',
    searchTexts: '/search-texts',
    searchImages: '/search-images',
    searchShapes: '/search-shapes',
    searchFrames: '/search-frames',
    fetchUserImages: '/your-uploads/get-user-images',
    uploadUserImage: '/your-uploads/upload',
    removeUserImage: '/your-uploads/remove',
    templateKeywordSuggestion: '/template-suggestion',
    textKeywordSuggestion: '/text-suggestion',
    imageKeywordSuggestion: '/image-suggestion',
    shapeKeywordSuggestion: '/shape-suggestion',
    frameKeywordSuggestion: '/frame-suggestion',
  },
  unsplash: { accessKey: '' },
  editorAssetsUrl: `${API_BASE_URL}/editor`,
  imageKeywordSuggestions: 'animal,sport,love,scene,dog,cat,whale',
  templateKeywordSuggestions: 'mother,sale,discount,fashion,model,deal,motivation,quote',
};

export default function WorksheetEditor() {
  const [saving, setSaving] = useState(false);

  const handleChanges = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <WorksheetContentProvider>
      <CanvaEditor
        data={{ name: '', editorConfig: A4_CANVAS_DATA }}
        config={editorConfig}
        saving={saving}
        onChanges={handleChanges}
        onDesignNameChanges={handleChanges}
        onRemove={() => {}}
        renderBackground={(pageIndex) => (
          <WorksheetBackground pageIndex={pageIndex} />
        )}
        sidebarExtension={{
          tab: {
            name: 'WorksheetSettings',
            displayName: 'Worksheet',
            icon: (
              <span style={{ display: 'flex' }}>
                <DocumentIcon />
              </span>
            ),
          },
          renderContent: (onClose) => (
            <WorksheetSettingsContent onClose={onClose} />
          ),
        }}
      />
    </WorksheetContentProvider>
  );
}
