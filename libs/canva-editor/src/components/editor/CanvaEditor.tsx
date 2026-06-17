'use client';

import { FC, PropsWithChildren, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { EditorConfig } from 'canva-editor/types';
import { EditorContext } from './EditorContext';
import { useEditorStore } from '../../hooks/useEditorStore';
import HeaderLayout from 'canva-editor/layout/HeaderLayout';
import Sidebar from 'canva-editor/layout/Sidebar';
import EditorContent from 'canva-editor/layout/pages/EditorContent';
import AppLayerSettings from 'canva-editor/layout/AppLayerSettings';
import { PageControl } from 'canva-editor/utils/settings';
import { searchQueryParam } from 'canva-editor/utils/queryParam';
import Preview from './Preview';
import {
  TranslationContext,
  createTranslateFunction,
} from '../../contexts/TranslationContext';
import EditorExtensionsContext, { SidebarExtension } from '../../contexts/EditorExtensionsContext';

export type EditorProps = {
  data?: {
    name: string;
    editorConfig: any;
  };
  saving?: boolean;
  config: EditorConfig;
  onChanges: (changes: any) => void;
  onDesignNameChanges: (name: any) => void;
  onRemove: () => void;
  renderBackground?: (pageIndex: number) => ReactNode;
  sidebarExtension?: SidebarExtension;
};

const CanvaEditor: FC<PropsWithChildren<EditorProps>> = ({
  data,
  config,
  saving,
  onChanges,
  onDesignNameChanges,
  onRemove,
  renderBackground,
  sidebarExtension,
}) => {
  const version = '1.0.69';
  const { getState, actions, query } = useEditorStore();
  const leftSidebarRef = useRef<HTMLDivElement>(null);
  const [viewPortHeight, setViewPortHeight] = useState<number>();
  const isPreview = searchQueryParam('preview');

  useEffect(() => {
    const windowHeight = () => {
      setViewPortHeight(window.innerHeight);
    };
    window.addEventListener('resize', windowHeight);
    windowHeight();
    return () => {
      window.removeEventListener('resize', windowHeight);
    };
  }, []);

  useEffect(() => {
    if (config?.apis?.userToken) {
      sessionStorage.setItem('userToken', config.apis.userToken);
    }
  }, [config?.apis?.userToken]);

  // Create translate function from translations in config
  const translationContextValue = useMemo(() => {
    const messages = config.translations || {};
    const translate = createTranslateFunction(messages);
    return { messages, translate };
  }, [config.translations]);

  const extensionsContextValue = useMemo(
    () => ({ renderBackground, sidebarExtension }),
    [renderBackground, sidebarExtension]
  );

  return (
    /**
     * ReactのContext（コンポーネントツリーの中で、propsを一つ一つ手渡しせずにどこからでもデータを参照できる）という仕組み
     * renderBackgroundやsidebarExtensionを全子孫コンポーネントに配布
     * 引数で渡ってきたワークシートの背景描画関数やサイドバー拡張を子孫コンポーネントでuseEditorExtensions()して取り出して使えるようにしている
     * Provider = 「この値、子孫全員が自由に使っていいよ」と宣言する箱。propsで何段も渡す手間がなく、必要な場所でだけ取り出せるのが利点
     */
    <EditorExtensionsContext.Provider value={extensionsContextValue}>
    <TranslationContext.Provider value={translationContextValue}>
      <EditorContext.Provider value={{ config, getState, actions, query }}>
      {!isPreview ? (
        <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            width: '100vw',
            height: '100vh',
            maxHeight: viewPortHeight ? `${viewPortHeight}px` : 'auto',
          }}
        >
          <HeaderLayout
            logoUrl={config.logoUrl}
            logoComponent={config.logoComponent}
            designName={data?.name || ''}
            saving={saving || false}
            onChanges={onDesignNameChanges}
            onRemove={onRemove}
          />
          <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              flex: 'auto',
              overflow: 'auto',
              background: '#EBECF0',
              '@media (max-width: 900px)': {
                flexDirection: 'column-reverse',
              },
            }}
          >
            <div
              ref={leftSidebarRef}
              css={{
                display: 'flex',
                margin: 6,
              }}
            >
              <Sidebar version={version} />
            </div>
            <div
              css={{
                flexGrow: 1,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                padding: '6px 6px 6px 0'
              }}
            >
              <AppLayerSettings />
              <EditorContent data={data?.editorConfig} onChanges={onChanges} />
              <div
                css={{
                  height: 40,
                  margin: 'auto',
                  background: '#fff',
                  border: '1px solid rgba(57,76,96,.15)',
                  display: 'grid',
                  alignItems: 'center',
                  flexShrink: 0,
                  zIndex: 3,
                  borderRadius: 12,
                  position: 'absolute',
                  bottom: 12,
                  left: 0,
                  right: 0,
                  width: 'fit-content',
                  minWidth: 500,
                  maxWidth: '100%',
                  '@media (max-width: 900px)': {
                    display: 'none',
                  },
                }}
              >
                <PageControl />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>

{/* <div
          css={{
            display: 'flex',
            flexDirection: 'column',
            width: '100vw',
            height: '100vh',
            maxHeight: viewPortHeight ? `${viewPortHeight}px` : 'auto',
          }}
        >
        <div
            css={{
              display: 'flex',
              flexDirection: 'row',
              flex: 'auto',
              overflow: 'auto',
              background: '#EBECF0',
              '@media (max-width: 900px)': {
                flexDirection: 'column-reverse',
              },
            }}
          >
        <div
              css={{
                flexGrow: 1,
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
              }}
            >
          <EditorContent data={data?.editorConfig} onChanges={onChanges} />

            </div>
            </div>
            </div> */}
          <Preview data={data?.editorConfig} slideMode={false} />
        </>
      )}
      </EditorContext.Provider>
    </TranslationContext.Provider>
    </EditorExtensionsContext.Provider>
  );
};

export default CanvaEditor;
