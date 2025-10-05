// Cloudinary configuration
export const CLOUDINARY_CONFIG = {
    cloudName: 'ds7hzpmed',
    apiKey: '141368458813151',
    apiSecret: '1lT-dul1f0HuhtHsxskn-dvCEBs', // Updated with your secret
    uploadPreset: 'unsigned_upload', // Try unsigned upload preset
};

// Cloudinary upload function
export const uploadToCloudinary = async (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    // Try different presets
    const uploadPreset = options.uploadPreset || CLOUDINARY_CONFIG.uploadPreset;
    console.log('Using upload preset:', uploadPreset);

    formData.append('upload_preset', uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

    // Add additional options
    if (options.folder) {
        formData.append('folder', options.folder);
    }
    if (options.publicId) {
        formData.append('public_id', options.publicId);
    }
    if (options.tags) {
        formData.append('tags', options.tags);
    }

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const result = await response.json();
        return {
            success: true,
            data: result,
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: error.message,
        };
    }
};

// Generate Cloudinary URL with transformations
export const getCloudinaryUrl = (publicId, transformations = {}) => {
    const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload`;

    if (Object.keys(transformations).length === 0) {
        return `${baseUrl}/${publicId}`;
    }

    const transformString = Object.entries(transformations)
        .map(([key, value]) => `${key}_${value}`)
        .join(',');

    return `${baseUrl}/${transformString}/${publicId}`;
};

// Common transformation presets
export const CLOUDINARY_TRANSFORMATIONS = {
    thumbnail: {
        width: 150,
        height: 150,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
    },
    medium: {
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
    },
    large: {
        width: 800,
        height: 600,
        crop: 'fill',
        quality: 'auto',
        format: 'auto',
    },
    original: {
        quality: 'auto',
        format: 'auto',
    },
};

export default {
    CLOUDINARY_CONFIG,
    uploadToCloudinary,
    getCloudinaryUrl,
    CLOUDINARY_TRANSFORMATIONS,
};
