import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

import {
  completeData,
  minimalData,
  minimalDataWithRelativeUrl,
} from '../../Image/__tests__/__fixtures__/image';

import { NakedImage } from '../../..';

describe('NakedImage', () => {
  describe('passing className and/or style', () => {
    it('renders correctly', () => {
      const onLoad = vi.fn();

      const { container, component } = render(NakedImage, {
        props: {
          data: minimalData,
          imgClass: 'img-class-name',
          imgStyle: 'background: red; overflow: visible; padding: 0px 10px;',
          pictureClass: 'picture-class-name',
          pictureStyle: 'background: green;',
        },
      });

      component.$on('load', onLoad);

      const picture = screen.getByTestId('picture');
      const img = screen.getByTestId('img');

      fireEvent.load(img);

      expect(picture).toBeInTheDocument();
      expect(onLoad).toHaveBeenCalled();
      expect(container).toMatchSnapshot();
    });
  });

  describe('full data', () => {
    it('renders correctly', () => {
      const { container } = render(NakedImage, {
        props: { data: completeData },
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('minimal data', () => {
    it('renders correctly', () => {
      const { container } = render(NakedImage, {
        props: { data: minimalData },
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('minimalDataWithRelativeUrl', () => {
    it('renders correctly', () => {
      const { container } = render(NakedImage, {
        props: { data: minimalDataWithRelativeUrl },
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('priority=true', () => {
    it('renders correctly', () => {
      const { container } = render(NakedImage, {
        props: { data: minimalData, priority: true },
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('usePlaceholder=false', () => {
    it('renders correctly', () => {
      const { container } = render(NakedImage, {
        props: { data: minimalData, usePlaceholder: false },
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('explicit sizes', () => {
    it('renders correctly', () => {
      const { container } = render(NakedImage, {
        props: { data: minimalData, sizes: '(max-width: 600px) 200px, 50vw' },
      });
      expect(container).toMatchSnapshot();
    });
  });
});
