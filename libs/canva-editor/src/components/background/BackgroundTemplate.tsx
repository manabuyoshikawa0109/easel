'use client';

import { FC } from 'react';
import { useEditorExtensions } from '../../contexts/EditorExtensionsContext';

interface Props {
  pageIndex: number;
  width: number;
  height: number;
}

/**
 * エディタのキャンバス内で、外部から注入された背景を描画するための橋渡し役
 * libs/canva-editor/src/components/editor/CanvaEditor.tsxのEditorExtensionsContextで
 * useEditorExtensions()してワークシートの背景描画関数やサイドバー拡張を取り出して使えるようにしている
 */
const BackgroundTemplate: FC<Props> = ({ pageIndex }) => {
  const { renderBackground } = useEditorExtensions();

  // renderBackgroundが未設定ならnullを返し、何も描画しない
  if (!renderBackground) return null;

  // renderBackgroundが設定済みなら、呼び出して結果を描画
  return <>{renderBackground(pageIndex)}</>;
};

export default BackgroundTemplate;
