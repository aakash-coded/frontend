import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../components/Navbar';
import { renderWithProviders } from '../test-utils';

describe('Navbar', () => {
  it('toggles the mobile menu and updates aria label', async () => {
    renderWithProviders(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /open mobile menu/i });
    await userEvent.click(menuButton);

    expect(screen.getByRole('button', { name: /close mobile menu/i })).toBeInTheDocument();
    expect(screen.getByText(/cart/i)).toBeInTheDocument();
  });
});
