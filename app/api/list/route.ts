import { NextResponse } from 'next/server';
import cloudinary from '@/utils/cloudinary';

export async function GET() {
  try {
    let allResources: any[] = [];
    let nextCursor: string | undefined;

    do {
      const result = await cloudinary.search
        .expression(`folder:${process.env.CLOUDINARY_FOLDER}`)
        .max_results(500) // Increase this if you have more than 500 files
        .next_cursor(nextCursor)
        .execute();

      allResources = [...allResources, ...result.resources];
      nextCursor = result.next_cursor;
    } while (nextCursor);

    const files = allResources.map((resource: any) => ({
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