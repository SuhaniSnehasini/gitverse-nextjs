import { NextResponse } from 'next/server';
import { startAnalysisWorkerLoop } from '../../../../scripts/analysisWorker';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // max Vercel function duration (if supported by plan)

function secureCompare(a: string | null, b: string | null): boolean {
  if (!a || !b || a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export async function GET(request: Request) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const expectedSecret = process.env.ANALYSIS_RUNNER_SECRET;

  if (!expectedSecret && !isDevelopment) {
    console.error('CRITICAL: ANALYSIS_RUNNER_SECRET is missing in production environment');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  const expectedBearer = expectedSecret ? `Bearer ${expectedSecret}` : null;
  
  const isAuthorized = isDevelopment && !expectedSecret
    ? true // Allow bypass in local dev if no secret is set
    : secureCompare(authHeader, expectedBearer);

  if (!isAuthorized) {
    console.warn('Unauthorized access attempt to internal analysis runner denied');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Starting analysis cron run...');

  try {
    // Run the worker loop in "once" mode so it returns after one pass through the queue
    const metrics = await startAnalysisWorkerLoop({ 
      once: true
    });
    
    console.log(`Finished analysis cron run. Summary:`, metrics);
    
    return NextResponse.json({ 
      success: metrics.success, 
      message: 'Analysis worker execution completed',
      metrics
    });
  } catch (error: any) {
    console.error('run-analysis cron error:', error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ 
      error: 'Internal server error',
      success: false
    }, { status: 500 });
  }
}
