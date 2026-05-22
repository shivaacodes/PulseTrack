import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const stmt = db.prepare('SELECT id, name, domain FROM sites ORDER BY created_at DESC');
    const sites = stmt.all();
    return NextResponse.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({ error: 'Failed to fetch sites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, domain } = await request.json();

    if (!name || !domain) {
      return NextResponse.json({ error: 'Name and domain are required' }, { status: 400 });
    }

    const stmt = db.prepare('INSERT INTO sites (name, domain) VALUES (?, ?)');
    const info = stmt.run(name, domain);

    return NextResponse.json({ id: info.lastInsertRowid, name, domain }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating site:', error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return NextResponse.json({ error: 'Domain already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create site' }, { status: 500 });
  }
}
