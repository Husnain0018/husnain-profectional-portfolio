import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import {
  getPortfolioData,
  updateProfile,
  saveSkills,
  saveProjects,
  saveEducation,
  saveCertifications,
  saveExperience,
  saveServices,
  saveSocialLinks,
  saveContactMessages,
  saveAppearance,
  saveSeo,
  saveGitHubConfig,
} from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const data = await getPortfolioData();
  const { admin_auth, ...safeAdminPayload } = data;
  return NextResponse.json({
    ...safeAdminPayload,
    admin_email: admin_auth?.email || session.email,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { section, payload } = body;

    switch (section) {
      case 'profile': {
        const updated = await updateProfile(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'skills': {
        const updated = await saveSkills(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'projects': {
        const updated = await saveProjects(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'education': {
        const updated = await saveEducation(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'certifications': {
        const updated = await saveCertifications(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'experience': {
        const updated = await saveExperience(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'services': {
        const updated = await saveServices(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'social_links': {
        const updated = await saveSocialLinks(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'contact_messages': {
        const updated = await saveContactMessages(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'appearance': {
        const updated = await saveAppearance(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'seo': {
        const updated = await saveSeo(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      case 'github_config': {
        const updated = await saveGitHubConfig(payload);
        return NextResponse.json({ success: true, data: updated });
      }
      default:
        return NextResponse.json(
          { error: `Unknown CMS section: ${String(section)}` },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error('Error in PUT /api/admin/cms:', err);
    return NextResponse.json(
      { error: 'Failed to save CMS section changes.' },
      { status: 500 }
    );
  }
}
