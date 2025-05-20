import { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import styles from './VideoPlayer.module.css'

interface VideoPlayerProps {
    url: string
}

const VideoPlayer = ({ url }: VideoPlayerProps) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className={styles.playerWrapper}>
            <ReactPlayer
                url={url}
                className={styles.reactPlayer}
                playing={false}
                loop
                controls
                width="100%"
                height="100%"

            />
        </div>
    )
}

export default VideoPlayer