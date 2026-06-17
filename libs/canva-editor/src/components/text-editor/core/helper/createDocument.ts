import { createNodeFromContent } from './createNodeFromContent';
import { Schema } from 'prosemirror-model';

export function createDocument(content: string, schema: Schema) {
    return createNodeFromContent(content, schema);
}
