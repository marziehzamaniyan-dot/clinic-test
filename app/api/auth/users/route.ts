import { NextResponse } from 'next/server';
import { MongoUserRepo } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const users = await MongoUserRepo.listUsers();
    return NextResponse.json({
      success: true,
      users,
      count: users.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'خطا در دریافت لیست کاربران مونگو' },
      { status: 500 }
    );
  }
}
