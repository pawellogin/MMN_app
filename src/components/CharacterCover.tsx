import styled from '@emotion/styled'
import { colors } from '../styles/theme'

export const CHARACTER_PLACEHOLDER = '/character-placeholder.svg'

const Cover = styled.div<{ height?: number }>`
  width: 100%;
  ${(props) => (props.height ? `height: ${props.height}px;` : 'aspect-ratio: 1 / 1;')}
  overflow: hidden;
  background: ${colors.black};
`

const Photo = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(0.15);
  transition: all 0.3s;

  .ant-card:hover & {
    filter: none;
    transform: scale(1.03);
  }
`

type Props = {
  src?: string
  alt?: string
  height?: number
}

export function CharacterCover({ src, alt = '', height }: Props) {
  return (
    <Cover height={height}>
      <Photo src={src || CHARACTER_PLACEHOLDER} alt={alt} />
    </Cover>
  )
}
