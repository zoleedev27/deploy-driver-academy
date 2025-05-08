import GalleryClient from '@/components/Gallery';

export default function GalleryPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 pt-6">
            <h1 className="font-body text-3xl font-bold text-foreground mb-6">Gallery</h1>
            <GalleryClient />
        </main>
    );
}
