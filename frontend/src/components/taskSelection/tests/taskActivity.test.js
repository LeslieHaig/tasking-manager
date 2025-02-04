import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ReduxIntlProviders } from '../../../utils/testWithIntl';
import { TaskHistory } from '../taskActivity';

describe('TaskHistory', () => {
  let history = {
    taskId: 15,
    projectId: 2,
    taskStatus: 'INVALIDATED',
    taskHistory: [
      {
        historyId: 7,
        taskId: 15,
        action: 'STATE_CHANGE',
        actionText: 'INVALIDATED',
        actionDate: Date.now() - 1e3 * 60,
        actionBy: 'User01',
      },
      {
        historyId: 6,
        taskId: 15,
        action: 'COMMENT',
        actionText: 'missing buildings',
        actionDate: Date.now() - 1e3 * 60 * 60,
        actionBy: 'User01',
      },
      {
        historyId: 5,
        taskId: 15,
        action: 'LOCKED_FOR_VALIDATION',
        actionText: '00:04:39.104987',
        actionDate: Date.now() - 1e3 * 60 * 60 * 2,
        actionBy: 'User01',
      },
    ],
    taskAnnotation: [],
    perTaskInstructions: 'Per task instructions',
    autoUnlockSeconds: 7200,
    lastUpdated: Date.now() - 1e3 * 60 * 60,
    numberOfComments: null,
  };
  it('renders the task history comments and activities for a given project', () => {
    render(
      <ReduxIntlProviders>
        <TaskHistory projectId={2} taskId={15} commentPayload={history} />
      </ReduxIntlProviders>,
    );
    expect(screen.getByText(/Activities/)).toBeInTheDocument();
    expect(screen.getByText(/Comments/)).toBeInTheDocument();

    // retrieve checkboxes
    const historyCheckBoxes = screen.getAllByRole('checkbox');
    expect(historyCheckBoxes[0]).toBeChecked(); // initial value of comments checkbox is checked
    expect(historyCheckBoxes[1]).not.toBeChecked(); // initial value of activities checkbox is unchecked
    expect(screen.getByText('User01')).toBeInTheDocument();
    expect(screen.getByText('commented 1 hour ago')).toBeInTheDocument();
    expect(screen.getByText('missing buildings')).toBeInTheDocument();
    expect(
      screen.queryByText('marked as more mapping needed 1 minute ago'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('locked for validation 2 hours ago')).not.toBeInTheDocument();

    fireEvent.click(historyCheckBoxes[1]); // check activities checkbox
    expect(screen.getByText('marked as more mapping needed 1 minute ago')).toBeInTheDocument();
    expect(screen.getByText('locked for validation 2 hours ago')).toBeInTheDocument();
    fireEvent.click(historyCheckBoxes[0]); // uncheck comments checkbox
    expect(screen.queryByText('commented 1 hour ago')).not.toBeInTheDocument();
    expect(screen.queryByText('missing buildings')).not.toBeInTheDocument();
  });

  it('does not render any task history when not provided', () => {
    let history = {
      taskId: 15,
      projectId: 2,
      taskStatus: 'INVALIDATED',
    };
    render(
      <ReduxIntlProviders>
        <TaskHistory projectId={2} taskId={15} commentPayload={history} />
      </ReduxIntlProviders>,
    );
    const historyCheckBoxes = screen.getAllByRole('checkbox');
    fireEvent.click(historyCheckBoxes[1]); // check activities checkbox
    expect(screen.getByText(/Activities/)).toBeInTheDocument();
    expect(screen.getByText(/Comments/)).toBeInTheDocument();
    expect(historyCheckBoxes[0]).toBeChecked();
    expect(historyCheckBoxes[1]).toBeChecked();
  });
});
