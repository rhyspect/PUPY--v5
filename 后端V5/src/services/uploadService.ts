import { randomUUID } from 'crypto';
import { supabaseAdmin } from '../config/supabase.js';

export const UPLOAD_BUCKET_NAME = 'pupy-assets';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
]);
const ALLOWED_FOLDERS = new Set(['owners', 'pets', 'diaries', 'market', 'test', 'uploads']);

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

export interface UploadedImageAsset {
  url: string;
  path: string;
  bucket: string;
  contentType: string;
}

interface UploadImageDataUrlOptions {
  userId: string;
  dataUrl: string;
  fileName?: string;
  contentType?: string;
  folder?: string;
}

export function isImageDataUrl(value?: string | null) {
  return Boolean(value?.startsWith('data:image/') && value.includes(';base64,'));
}

async function ensureUploadBucket() {
  const bucket = await supabaseAdmin.storage.getBucket(UPLOAD_BUCKET_NAME);
  if (!bucket.error) return;

  const createResult = await supabaseAdmin.storage.createBucket(UPLOAD_BUCKET_NAME, {
    public: true,
    fileSizeLimit: MAX_IMAGE_BYTES,
    allowedMimeTypes: Array.from(ALLOWED_IMAGE_TYPES),
  });

  if (createResult.error && !createResult.error.message.toLowerCase().includes('already exists')) {
    throw createResult.error;
  }
}

function parseImageDataUrl(dataUrl: string, fallbackContentType?: string) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) {
    throw new Error('请上传有效的图片文件。');
  }

  const contentType = (fallbackContentType || match[1]).toLowerCase();
  if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
    throw new Error('当前仅支持 JPG、PNG、WebP、GIF、HEIC 图片。');
  }

  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length) {
    throw new Error('图片内容为空，请重新选择。');
  }
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new Error('单张图片不能超过 8MB。');
  }

  return { buffer, contentType };
}

function normalizeFolder(folder?: string) {
  const normalized = (folder || 'uploads').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
  return ALLOWED_FOLDERS.has(normalized) ? normalized : 'uploads';
}

export async function uploadImageDataUrl(options: UploadImageDataUrlOptions): Promise<UploadedImageAsset> {
  const parsed = parseImageDataUrl(options.dataUrl, options.contentType);
  const targetFolder = normalizeFolder(options.folder);
  const extension = EXTENSIONS[parsed.contentType] || 'jpg';
  const safeName = (options.fileName || `upload.${extension}`)
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .slice(0, 60) || 'upload';
  const storagePath = `${targetFolder}/${options.userId}/${Date.now()}-${randomUUID()}-${safeName}.${extension}`;

  await ensureUploadBucket();

  const uploadResult = await supabaseAdmin.storage
    .from(UPLOAD_BUCKET_NAME)
    .upload(storagePath, parsed.buffer, {
      contentType: parsed.contentType,
      upsert: false,
    });

  if (uploadResult.error) {
    throw uploadResult.error;
  }

  const publicUrl = supabaseAdmin.storage.from(UPLOAD_BUCKET_NAME).getPublicUrl(storagePath).data.publicUrl;

  return {
    url: publicUrl,
    path: storagePath,
    bucket: UPLOAD_BUCKET_NAME,
    contentType: parsed.contentType,
  };
}

export async function uploadImageList(userId: string, images: string[] | undefined, folder: string) {
  const nextImages: string[] = [];
  for (const [index, image] of (images || []).entries()) {
    if (!isImageDataUrl(image)) {
      nextImages.push(image);
      continue;
    }

    const uploaded = await uploadImageDataUrl({
      userId,
      dataUrl: image,
      fileName: `${folder}-${index + 1}`,
      folder,
    });
    nextImages.push(uploaded.url);
  }

  return nextImages;
}
