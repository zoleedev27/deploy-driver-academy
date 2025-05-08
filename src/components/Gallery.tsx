import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MasonryGalleryNoSSR = dynamic(() => import('./GalleryClient'), {
    ssr: false,
});

export default function GalleryWrapper() {
    return (
        <Suspense fallback={<p>Loading gallery...</p>}>
            <MasonryGalleryNoSSR />
        </Suspense>
    );
}
