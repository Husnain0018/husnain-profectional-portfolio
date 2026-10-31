import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { syncGitHubRepositoriesToProjects } from '@/lib/github';

export async function POST() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const syncResult = await syncGitHubRepositoriesToProjects();
    if (!syncResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: syncResult.error || 'GitHub synchronization failed.',
          syncedAt: syncResult.syncedAt,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      message: `Synchronized ${syncResult.totalRepos} public repositories from GitHub (@Husnain0018).`,
      ...syncResult,
    });
  } catch (err) {
    console.error('Error in POST /api/admin/github-sync:', err);
    return NextResponse.json(
      { error: 'Unexpected error during GitHub synchronization.' },
      { status: 500 }
    );
  }
}
