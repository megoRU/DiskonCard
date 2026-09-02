import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BarcodeModal from './BarcodeModal';

describe('BarcodeModal component', () => {
  it('should render store name and card number', () => {
    const cardData = {
      storeName: 'Пятёрочка',
      cardNumber: '1234567890123',
    };
    const onClose = vi.fn();

    render(<BarcodeModal cardData={cardData} onClose={onClose} />);

    expect(screen.getByText('Пятёрочка')).toBeInTheDocument();
    expect(screen.getByText('1234567890123')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const cardData = {
      storeName: 'Лента',
      cardNumber: '999888777666',
    };
    const onClose = vi.fn();

    render(<BarcodeModal cardData={cardData} onClose={onClose} />);

    const closeButton = screen.getByLabelText('Закрыть просмотр штрих-кода');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should return null when cardData is not provided', () => {
    const { container } = render(<BarcodeModal cardData={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });
});
