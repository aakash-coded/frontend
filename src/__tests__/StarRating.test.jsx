import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StarRating } from '../pages/ProductDetailsPage';
import { render } from '@testing-library/react';

describe('StarRating', () => {
  it('calls onChange when a star is clicked', async () => {
    const onChange = vi.fn();
    render(<StarRating value={2} onChange={onChange} />);

    const starButton = screen.getByRole('button', { name: /rate 5 stars/i });
    await userEvent.click(starButton);

    expect(onChange).toHaveBeenCalledWith(5);
  });
});
