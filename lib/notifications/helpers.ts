/**
 * Helper functions for sending common project notifications
 */

interface NotificationParams {
  recipientId: string;
  projectName?: string;
  phaseName?: string;
  assetName?: string;
  userName?: string;
}

/**
 * Notify when a file is uploaded to a project
 */
export async function notifyFileUploaded({
  recipientId,
  projectName,
  assetName,
  userName,
}: NotificationParams) {
  const message = `${userName} uploaded "${assetName}" to ${projectName}. Check it out!`;

  return fetch('/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipientId,
      message,
      type: 'file_upload',
    }),
  });
}

/**
 * Notify when a project phase is completed
 */
export async function notifyPhaseCompleted({
  recipientId,
  projectName,
  phaseName,
}: NotificationParams) {
  const message = `${projectName} has completed ${phaseName}! Time to review and approve.`;

  return fetch('/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipientId,
      message,
      type: 'phase_completed',
    }),
  });
}

/**
 * Notify when a user is assigned to a project
 */
export async function notifyProjectAssignment({
  recipientId,
  projectName,
}: NotificationParams) {
  const message = `You've been assigned to "${projectName}". Login to view details and contribute.`;

  return fetch('/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipientId,
      message,
      type: 'project_assignment',
    }),
  });
}

/**
 * Notify when a gate is passed
 */
export async function notifyGatePassed({
  recipientId,
  projectName,
}: NotificationParams) {
  const message = `🎉 ${projectName} passed the gate review! Moving to the next phase.`;

  return fetch('/api/notifications/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipientId,
      message,
      type: 'gate_passed',
    }),
  });
}

/**
 * Notify multiple users (e.g., entire team)
 */
export async function notifyTeam({
  recipientIds,
  message,
  type,
}: {
  recipientIds: string[];
  message: string;
  type: string;
}) {
  const promises = recipientIds.map((recipientId) =>
    fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientId,
        message,
        type,
      }),
    })
  );

  return Promise.all(promises);
}
