import { act } from 'react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, } from '@testing-library/react';
import DeletePage from './page';

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    // Add other router methods you need
  }),
}));

it('displays correct headings', async () => {
  const params = Promise.resolve({ name: 'test-instance' });

  await act(async () => {
    render(<DeletePage params={params} />)
  });

  await waitFor(() => {
    expect(screen.getByText('test-instance')).toBeInTheDocument();
    expect(screen.getByText('By submitting the following form, this instance will be permanently deleted'))
  })
})

it('only enables delete button when input matches instance name', async () => {
  const params = Promise.resolve({ name: 'test-instance' });

  await act(async () => {
    render(<DeletePage params={params} />)
  });

  const deleteButton = screen.getByRole('button', { name: /delete/i });
  expect(deleteButton).toBeDisabled();

  await userEvent.type(screen.getByRole('textbox'), 'test-instance');
  expect(deleteButton).toBeEnabled();
})
