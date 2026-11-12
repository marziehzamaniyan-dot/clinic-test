import { NextRequest, NextResponse } from 'next/server';
import { MongoUserRepo } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userCount = await MongoUserRepo.countUsers();
    const isDbConnected = MongoUserRepo.isDbConnected();
    return NextResponse.json({
      success: true,
      userCount,
      isDbConnected,
      message: 'وضعیت سرویس دیتابیس مونگو',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'خطا در بررسی وضعیت دیتابیس' },
      { status: 500 }
    );
  }
}
