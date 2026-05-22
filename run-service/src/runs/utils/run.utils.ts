// DTO
import type {
  ServiceCategoryDto,
  ServiceUserDto,
} from '../dto/run-response.dto';
import { RUN_STATUSES, RunStatus } from '../dto/run-status.dto';

export function formatDuration(seconds: number) {
  const totalSeconds = Number(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${hours} Hour(s) ${minutes} Minute(s) ${remainingSeconds} Second(s)`;
}

export function serializeRun(
  run: any,
  user?: ServiceUserDto,
  runCategory?: ServiceCategoryDto,
) {
  const runDuration = Number(run.run_duration);

  return {
    ...run,
    run_duration: runDuration,
    ...(user ? { user } : {}),
    ...(runCategory ? { run_category: runCategory } : {}),
    formatted_duration: formatDuration(runDuration),
  };
}

export function normalizeRunStatus(status: string): RunStatus | null {
  const normalizedStatus = status.toUpperCase();

  return RUN_STATUSES.includes(normalizedStatus as RunStatus)
    ? (normalizedStatus as RunStatus)
    : null;
}
