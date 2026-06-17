'use client';

import { FC, useCallback, useEffect, useRef } from 'react';
import { useWorksheetContent } from '../_contexts/WorksheetContentContext';
import type { WorksheetLineStyle } from '../_contexts/WorksheetContentContext';

const LINE_GROUP_COUNT = 9;
const lineGroupIndexes = Array.from({ length: LINE_GROUP_COUNT }, (_, i) => i + 1);

const GROUP_HEIGHT = 51;
const GROUP_MARGIN_BOTTOM = 50;
const PADDING_H = 40;
const PADDING_V = 30;
const STUDENT_INFO_CELL_W = 80;
const STUDENT_INFO_HEIGHT = 80;
const TITLE_HEIGHT = 48;
const TITLE_MARGIN_BOTTOM = 22;
const HEADER_MARGIN_BOTTOM = 16;

const LINE_TOPS: Record<string, number> = {
  line1: 0,
  line2: 16,
  line3: 36,
  line4: 50,
};

const INPUT_FONT_SIZE = 50;
const INPUT_LINE_HEIGHT = 32;

interface Props {
  pageIndex: number;
  width?: number;
  height?: number;
}

const WorksheetBackground: FC<Props> = ({ pageIndex }) => {
  const { getPageData, updateWorksheetData, lastActiveInputRef } = useWorksheetContent();
  const data = getPageData(pageIndex);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    Object.entries(data.contentEditableValues).forEach(([key, value]) => {
      const el = refs.current[key];
      if (el && el.innerHTML !== value) {
        el.innerHTML = value;
      }
    });
  }, [pageIndex]);

  const saveContent = useCallback(
    (key: string, el: HTMLDivElement) => {
      updateWorksheetData(pageIndex, prev => ({
        ...prev,
        contentEditableValues: { ...prev.contentEditableValues, [key]: el.innerHTML },
      }));
    },
    [pageIndex, updateWorksheetData]
  );

  const stop = (e: React.MouseEvent | React.PointerEvent) => e.stopPropagation();

  const ceProps = (key: string) => ({
    ref: (el: HTMLDivElement | null) => { refs.current[key] = el; },
    contentEditable: true as const,
    suppressContentEditableWarning: true,
    onMouseDown: stop,
    onPointerDown: stop,
    onFocus: (e: React.FocusEvent<HTMLDivElement>) => {
      lastActiveInputRef.current = e.currentTarget;
    },
    onClick: (e: React.MouseEvent<HTMLDivElement>) => {
      lastActiveInputRef.current = e.currentTarget;
    },
    onInput: (e: React.SyntheticEvent<HTMLDivElement>) =>
      saveContent(key, e.currentTarget as HTMLDivElement),
  });

  const getLineStyle = (lineKey: string): React.CSSProperties => {
    const s: WorksheetLineStyle = data.lineStyles[lineKey] ?? { color: '#000', style: 'solid' };
    return {
      position: 'absolute' as const,
      top: LINE_TOPS[lineKey],
      left: 0,
      right: 0,
      height: 0,
      borderTop: `1px ${s.style} ${s.color}`,
    };
  };

  const getXScaleStyle = (lineInputKey: string): React.CSSProperties => ({
    transformOrigin: 'left center',
    transform: `scaleX(${(data.lineInputXScales[lineInputKey] ?? 100) / 100})`,
  });

  const LineSet = () => (
    <>
      {Object.keys(LINE_TOPS).map(lineKey => (
        <div key={lineKey} style={getLineStyle(lineKey)} />
      ))}
    </>
  );

  const lineInputCss = {
    display: 'block' as const,
    minWidth: '100%',
    width: 'fit-content',
    height: '100%',
    fontSize: INPUT_FONT_SIZE,
    lineHeight: `${INPUT_LINE_HEIGHT}px`,
    padding: '0 10px',
    fontFamily: '"CJ Gothic", sans-serif',
    whiteSpace: 'nowrap' as const,
    cursor: 'pointer' as const,
    userSelect: 'text' as const,
    overflow: 'visible' as const,
    '&:focus': {
      outline: '2px solid rgba(0, 123, 255, 0.3)',
      backgroundColor: 'rgba(0, 123, 255, 0.08)',
    },
  };

  return (
    <div
      css={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'visible', userSelect: 'text' }}
      onMouseDown={stop}
      onPointerDown={stop}
    >
      {/* 白い背景: A4 固定サイズ */}
      <div css={{ position: 'absolute', inset: 0, background: '#fff' }} />

      {/* コンテンツ領域 */}
      <div
        css={{ position: 'absolute', inset: 0, boxSizing: 'border-box', overflow: 'visible' }}
        style={{ padding: `${PADDING_V}px ${PADDING_H}px` }}
      >

        {/* ── ワークシートヘッダー ─────────────────────────────────── */}
        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 20,
            marginBottom: HEADER_MARGIN_BOTTOM,
            overflow: 'visible',
          }}
        >
          {/* Grade / Class / No. グリッド */}
          <div
            css={{
              display: 'grid',
              gridTemplateColumns: `repeat(3, ${STUDENT_INFO_CELL_W}px)`,
              border: '1px solid #000',
              flexShrink: 0,
            }}
          >
            {(['Grade', 'Class', 'No.'] as const).map((label, idx) => {
              const key = ['studentGrade', 'studentClass', 'studentNo'][idx];
              return (
                <div
                  key={label}
                  css={{
                    borderLeft: idx === 0 ? 'none' : '1px solid #000',
                    padding: '4px 6px',
                    height: STUDENT_INFO_HEIGHT,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <span css={{ fontSize: '0.65rem', fontWeight: 'bold' }}>{label}</span>
                  <div
                    {...ceProps(key)}
                    css={{
                      fontSize: '1.5rem',
                      outline: 'none',
                      background: 'transparent',
                      userSelect: 'text',
                      cursor: 'text',
                      minHeight: '1.5rem',
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Name / Date エリア */}
          <div
            css={{
              flex: 1,
              minWidth: 0,
              position: 'relative',
              height: GROUP_HEIGHT,
              marginTop: 20,
              overflow: 'visible',
            }}
          >
            {/* Name / Date ラベル */}
            <div
              css={{
                position: 'absolute',
                top: -18,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.7rem',
                fontWeight: 'bold',
              }}
            >
              <span>Name</span>
              <span>Date<span css={{ letterSpacing: 35 }}> ・・</span></span>
            </div>

            {/* 4本罫線 */}
            <LineSet />

            {/* contentEditable */}
            <div
              {...ceProps('nameDate')}
              style={getXScaleStyle('lineInput1')}
              css={lineInputCss}
            />
          </div>
        </div>

        {/* ── ワークシートタイトル ─────────────────────────────────── */}
        <div
          {...ceProps('worksheetTitle')}
          css={{
            marginBottom: TITLE_MARGIN_BOTTOM,
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '2rem',
            height: TITLE_HEIGHT,
            lineHeight: `${TITLE_HEIGHT}px`,
            borderBottom: '2px solid #000',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontFamily: '"Nunito", sans-serif',
            outline: 'none',
            cursor: 'text',
            userSelect: 'text',
            background: 'transparent',
          }}
          data-placeholder="タイトルを入力"
        />

        {/* ── 9行の罫線グループ ─────────────────────────────────────── */}
        {lineGroupIndexes.map(groupIndex => {
          const contentKey = `lineInput${groupIndex}`;
          const scaleKey = `lineInput${groupIndex + 1}`;
          return (
            <div
              key={groupIndex}
              css={{ position: 'relative', height: GROUP_HEIGHT, marginBottom: GROUP_MARGIN_BOTTOM }}
            >
              {/* 4本罫線 */}
              <LineSet />

              {/* contentEditable */}
              <div
                {...ceProps(contentKey)}
                style={getXScaleStyle(scaleKey)}
                css={lineInputCss}
              />
            </div>
          );
        })}

      </div>
    </div>
  );
};

export default WorksheetBackground;
