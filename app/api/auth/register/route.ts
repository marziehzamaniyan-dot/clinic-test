import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { MongoUserRepo } from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, username, password, phone, nationalId, role, medicalCouncilNumber } = body;

    if (!fullName || !password || (!username && !nationalId)) {
      return NextResponse.json(
        { error: 'لطفاً نام، کلمه عبور و نام کاربری یا کد ملی را وارد نمایید.' },
        { status: 400 }
      );
    }

    if (password.length < 5) {
      return NextResponse.json(
        { error: 'کلمه عبور باید حداقل ۵ کاراکتر باشد.' },
        { status: 400 }
      );
    }

    const targetUsername = (username || nationalId).trim().toLowerCase();

    // Check if user already exists in MongoDB
    const existing = await MongoUserRepo.findByUsername(targetUsername);
    if (existing) {
      return NextResponse.json(
        { error: 'کاربری با این نام کاربری، کد ملی یا شماره تلفن از قبل در دیتابیس ثبت شده است.' },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    const validRoles = ['SUPER_ADMIN', 'RECEPTIONIST', 'CONTENT_EDITOR', 'PATIENT'];
    const assignedRole = validRoles.includes(role) ? role : 'PATIENT';

    const newUser = await MongoUserRepo.createUser({
      username: targetUsername,
      passwordHash,
      fullName: fullName.trim(),
      role: assignedRole,
      nationalId: nationalId?.trim() || (targetUsername.length === 10 ? targetUsername : undefined),
      phone: phone?.trim(),
      medicalCouncilNumber: medicalCouncilNumber?.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'ثبت‌نام با موفقیت در دیتابیس مونگو انجام شد.',
      user: {
        username: newUser.username,
        displayName: newUser.fullName,
        role: newUser.role,
        nationalId: newUser.nationalId,
        phone: newUser.phone,
      },
    });
  } catch (err: any) {
    console.error('Registration API Error:', err);
    return NextResponse.json(
      { error: err.message || 'خطای سرور در ثبت‌نام کاربر در دیتابیس' },
      { status: 500 }
    );
  }
}
