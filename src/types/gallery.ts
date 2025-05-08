export type GalleryImage = {
    name: string;
    ext: string;
    campaign: string;
    course: string;
    year: string;
};

export type GalleryFilterKey = 'campaign' | 'course' | 'year';

export type GallerySortOption = {
    key: keyof GalleryImage;
    order: 'asc' | 'desc';
};