import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}`)
      .execute();

    const files = result.resources.map((resource: any) => ({
      publicId: resource.public_id,
      url: resource.secure_url,
      format: resource.format,
    }));

    return NextResponse.json(files);
  } catch (error) {
    console.error('Error listing Cloudinary files:', error);
    return NextResponse.json({ error: 'Error listing files' }, { status: 500 });
  }
}