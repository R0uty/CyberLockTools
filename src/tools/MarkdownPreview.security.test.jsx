/* @vitest-environment jsdom */

import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import MarkdownPreview from './MarkdownPreview';

describe('MarkdownPreview security', () => {
  it('sanitizes script tags and inline handlers in rendered output', () => {
    const { container, getByPlaceholderText } = render(<MarkdownPreview />);

    fireEvent.change(getByPlaceholderText('Enter your markdown here...'), {
      target: {
        value: '[safe](javascript:alert(1))\n\n<img src=x onerror="alert(2)" />\n\n<script>alert(3)</script>',
      },
    });

    const preview = container.querySelector('.markdown-preview-box');

    expect(preview).toBeTruthy();
    expect(preview?.querySelector('script')).toBeNull();
    expect(preview?.querySelector('[onerror]')).toBeNull();
    expect(preview?.innerHTML.includes('javascript:')).toBe(false);
  });
});
