'use client';

import { createContext, ReactNode, useContext } from 'react';

export type SidebarExtension = {
  tab: {
    name: string;
    displayName: string;
    icon: ReactNode;
  };
  renderContent: (onClose: () => void) => ReactNode;
};

type EditorExtensionsContextType = {
  renderBackground?: (pageIndex: number) => ReactNode;
  sidebarExtension?: SidebarExtension;
};

const EditorExtensionsContext = createContext<EditorExtensionsContextType>({});

export const useEditorExtensions = () => useContext(EditorExtensionsContext);

export default EditorExtensionsContext;
