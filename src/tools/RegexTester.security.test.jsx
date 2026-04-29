/* @vitest-environment jsdom */

import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import RegexTester from './RegexTester';

describe('RegexTester security', () => {
  it('renders highlighted matches without injecting raw HTML', () => {
    const { container } = render(<RegexTester />);

    fireEvent.change(container.querySelector('#pattern'), {
      target: { value: '.*' },
    });

    fireEvent.change(container.querySelector('#testString'), {
      target: { value: '<img src=x onerror="alert(1)"><script>alert(2)</script>' },
    });

    const highlighted = container.querySelector('.highlighted-text');

    expect(highlighted).toBeTruthy();
    expect(highlighted?.querySelector('script')).toBeNull();
    expect(highlighted?.querySelector('[onerror]')).toBeNull();
    expect(highlighted?.textContent).toContain('<script>alert(2)</script>');
  });
});
