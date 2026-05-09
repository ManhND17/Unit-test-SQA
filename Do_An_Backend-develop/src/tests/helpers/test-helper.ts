import { PrismaClient } from '@prisma/client';
import prisma from '@src/config/prisma';

export const getTestUser = async (roleName: string) => {
    let role = await prisma.role.findFirst({ where: { name: roleName } });
    if (!role) {
        role = await prisma.role.create({
            data: { name: roleName, prefix: roleName.toUpperCase() }
        });
    }

    const email = `test-${roleName}@example.com`;
    let user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
        user = await prisma.user.create({
            data: {
                username: `test${roleName}`,
                email: email,
                password: 'hashed-password',
                roleId: role.id,
                name: {
                    create: {
                        firstName: 'Test',
                        lastName: roleName
                    }
                }
            },
            include: { role: true }
        });
    }

    if (roleName === 'doctor') {
        let dept = await (prisma as any).department.findFirst();
        if (!dept) {
            dept = await (prisma as any).department.create({
                data: {
                    name: 'Test Dept',
                    description: 'Desc',
                    code: 'T' + Math.floor(Math.random() * 1000),
                    type: 'clinical'
                }
            });
        }

        let staff = await (prisma as any).staff.findUnique({ where: { userId: user.id } });
        if (!staff) {
            staff = await (prisma as any).staff.create({
                data: {
                    userId: user.id,
                    staffId: 'S' + user.id.substring(0, 4),
                    position: 'Doctor',
                    departmentId: dept.id,
                    joinTime: new Date()
                }
            });
        }
        let doctor = await (prisma as any).doctor.findUnique({ where: { userId: user.id } });
        if (!doctor) {
            await (prisma as any).doctor.create({
                data: {
                    userId: user.id,
                    specialization: 'General',
                    experienceYears: 5,
                    level: 'Specialist'
                }
            });
        }
    } else if (roleName === 'patient') {
        let patient = await (prisma as any).patient.findUnique({ where: { userId: user.id } });
        if (!patient) {
            await (prisma as any).patient.create({
                data: {
                    userId: user.id,
                    patientId: 'P' + user.id.substring(0, 4)
                }
            });
        }
    }

    return user;
};

export const getTestCategory = async () => {
    const name = 'Test Category';
    let category = await prisma.category.findFirst({ where: { name } });
    if (!category) {
        category = await prisma.category.create({
            data: {
                name,
                slug: 'test-category',
                description: 'Test description'
            }
        });
    }
    return category;
};

export const runInTransaction = async (testFn: (tx: any) => Promise<void>) => {
    await prisma.$transaction(async (tx) => {
        await testFn(tx);
        throw new Error('ROLLBACK');
    }).catch((err) => {
        if (err.message !== 'ROLLBACK') throw err;
    });
};
