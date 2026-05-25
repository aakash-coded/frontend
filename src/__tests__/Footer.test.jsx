import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '../components/Footer';
import { renderWithProviders } from '../test-utils';

describe('Footer', () => {
  it('clears the newsletter email input after subscribe', async () => {
    renderWithProviders(<Footer />);

    const input = screen.getByRole('textbox', { name: /email address/i });
    const button = screen.getByRole('button', { name: /subscribe to newsletter/i });

    await userEvent.type(input, 'test@domain.com');
    expect(input).toHaveValue('test@domain.com');

    await userEvent.click(button);
    expect(input).toHaveValue('');
  });
});
