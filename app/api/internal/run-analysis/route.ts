import { NextResponse } from 'next/server';
import { startAnalysisWorkerLoop } from '../../../../scripts/analysisWorker';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

export async function GET(request: Request) {
  // Simple auth check for internal cron
  const authHeader = request.headers.get('authorization');
  if (
    process.env.ANALYSIS_RUNNER_SECRET &&
    authHeader !== `Bearer ${process.env.ANALYSIS_RUNNER_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const maxJobsParam = url.searchParams.get('maxJobs');
  const parsedMaxJobs = maxJobsParam ? parseInt(maxJobsParam, 10) : undefined;
  const maxJobs = parsedMaxJobs != null && !isNaN(parsedMaxJobs) && parsedMaxJobs > 0 
    ? parsedMaxJobs 
    : undefined;

  console.log(`Starting analysis cron run... (maxJobs: ${maxJobs ?? 'default'})`);

  try {
    // Run the worker loop with maxJobs if provided, otherwise "once" mode
    const metrics = await startAnalysisWorkerLoop({ 
      once: maxJobs === undefined,
      maxJobs
    });

    const workerElapsed = Date.now() - workerStart;
    const totalElapsed = Date.now() - requestStart;

    console.log(
      `[run-analysis] Worker completed successfully in ${workerElapsed}ms`
    );

    return NextResponse.json({
      success: true,
      message: 'Analysis cron completed successfully',
      workerElapsedMs: workerElapsed,
      totalElapsedMs: totalElapsed,
      timeBudgetMs,
    });
  } catch (error) {
    const elapsed = Date.now() - requestStart;

    console.error(
      '[run-analysis] Cron execution failed',
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            elapsedMs: elapsed,
          }
        : error
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        elapsedMs: elapsed,
      },
      { status: 500 }
    );
  }
}
