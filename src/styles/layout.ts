import styled from '@emotion/styled'
import { breakpoints, colors, sizes, transition } from './theme'

export const PageShell = styled.main`
  min-height: 100vh;
  padding-top: ${sizes.headerHeight}px;
  background: ${colors.page};
  color: ${colors.text};
`

export const Container = styled.div<{ narrow?: number }>`
  width: 100%;
  max-width: ${({ narrow }) => narrow ?? sizes.containerMax}px;
  margin: 0 auto;
  padding: 48px ${sizes.containerPadX}px ${sizes.sectionGap}px;

  ${breakpoints.wide} {
    padding-left: 48px;
    padding-right: 48px;
  }

  ${breakpoints.mobile} {
    padding: 32px 20px 64px;
  }
`

export const Hero = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: ${sizes.headerHeight + 40}px ${sizes.containerPadX}px 80px;
  background-color: ${colors.black};
  background-image: url('/brand/hero.webp');
  background-repeat: no-repeat;
  background-position: right 10% center;
  background-size: auto 90%;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${colors.heroOverlay};
    pointer-events: none;
  }

  ${breakpoints.wide} {
    padding-left: 48px;
    padding-right: 48px;
  }

  ${breakpoints.tablet} {
    background-position: center;
    background-size: auto 70%;

    &::after {
      background: rgba(0, 0, 0, 0.8);
    }
  }

  ${breakpoints.mobile} {
    padding: ${sizes.headerHeight}px 20px 64px;
  }
`

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  width: min(640px, 100%);
`

export const Panel = styled.section`
  width: 100%;
  padding: 32px;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid ${colors.border};
  border-top: 2px solid ${colors.primary};

  ${breakpoints.mobile} {
    padding: 24px 20px;
  }
`

export const Block = styled.section`
  background: ${colors.black};
  border: 1px solid ${colors.border};
  padding: 28px 32px;
  margin-bottom: 24px;
  transition: ${transition};

  &:hover {
    border-color: ${colors.inputBorder};
  }

  ${breakpoints.mobile} {
    padding: 20px;
  }
`

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 20px;
  color: ${colors.primary};
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 2px;
  text-transform: uppercase;
`

export const HeroTitle = styled.h1`
  margin: 0 0 32px;
  color: ${colors.text};
  font-size: ${sizes.heroTitle}px;
  font-weight: 600;
  line-height: 1.3;
  text-transform: uppercase;

  ${breakpoints.tablet} {
    font-size: 48px;
  }

  ${breakpoints.mobile} {
    font-size: 36px;
    margin-bottom: 20px;
  }
`

export const SectionTitle = styled.h2`
  margin: 0 0 18px;
  color: ${colors.text};
  font-size: ${sizes.sectionTitle}px;
  font-weight: 600;
  line-height: 1.4;

  ${breakpoints.mobile} {
    font-size: 30px;
  }
`

export const SubTitle = styled.h3`
  margin: 0 0 20px;
  color: ${colors.text};
  font-size: ${sizes.itemTitle}px;
  font-weight: 400;
  line-height: 1.2;

  ${breakpoints.mobile} {
    font-size: 24px;
  }
`

export const Lead = styled.p`
  margin: 0 0 32px;
  color: ${colors.text};
  font-size: ${sizes.lead}px;
  line-height: 1.2;

  ${breakpoints.mobile} {
    font-size: 18px;
  }
`

export const BodyText = styled.p`
  margin: 0 0 16px;
  color: ${colors.text};
  font-size: ${sizes.body}px;
  line-height: 32px;
`

export const PageHeading = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 40px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${colors.border};
`
