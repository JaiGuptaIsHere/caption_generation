import { registerRoot } from 'remotion'
import CaptionComposition from './CaptionComposition'

export const RemotionRoot = () => {
  return (
    <>
      <CaptionComposition />
    </>
  )
}

registerRoot(RemotionRoot)