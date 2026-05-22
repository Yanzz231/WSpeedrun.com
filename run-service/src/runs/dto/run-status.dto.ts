export const RUN_STATUSES = ['PENDING', 'ACCEPTED', 'REJECTED'] as const;

export type RunStatus = (typeof RUN_STATUSES)[number];
