import prisma from '../prisma';
import { generateCertificateNumber } from '../utils';

export async function issueCertificate(userId: string, courseId: string) {
  // Check if certificate already exists
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existing) return existing;

  // Get course info for prefix
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { title: true },
  });

  const prefix = course
    ? course.title.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 3)
    : 'GEN';

  const certificate = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      certificateNumber: generateCertificateNumber(prefix),
    },
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      title: '🏆 Certificate Earned!',
      message: `Congratulations! You earned a certificate for "${course?.title}"`,
      link: '/trainee/certificates',
    },
  });

  return certificate;
}
