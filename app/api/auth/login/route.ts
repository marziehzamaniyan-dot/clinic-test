import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { MongoUserRepo } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'لطفاً نام کاربری / کد ملی و کلمه عبور را وارد فرمایید.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = await MongoUserRepo.findByUsername(cleanUsername);

    if (!user) {
      return NextResponse.json(
        { error: 'کاربری با این مشخصات در سیستم دیتابیس مونگو یافت نشد. در صورت عدم ثبت‌نام، لطفاً ابتدا ثبت‌نام نمایید.' },
        { status: 401 }
      );
    }

    // Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'کلمه عبور وارد شده نادرست است.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'ورود موفقیت‌آمیز بود.',
      user: {
        username: user.username,
        displayName: user.fullName,
        role: user.role,
        nationalId: user.nationalId,
        phone: user.phone,
      },
    });
  } catch (err: any) {
    console.error('Login API Error:', err);
    return NextResponse.json(
      { error: err.message || 'خطا در ارتباط با دیتابیس مونگو' },
      { status: 500 }
    );
  }
}
