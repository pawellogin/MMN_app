import { theme as antdTheme, type ThemeConfig } from 'antd'

export const colors = {
  primary: '#af1921',
  error: '#c20a0a',
  dark: '#271e1e',
  page: '#0a0a0a',
  black: '#000',
  surface: '#111',
  surfaceRaised: '#161616',
  border: '#3c3d38',
  inputBorder: '#787878',
  text: '#fff',
  textMuted: '#e0e0e0',
  textSubtle: '#b5b5b5',
  headerGradientStart: '#030303',
  overlay: 'rgba(0, 0, 0, 0.898)',
  heroOverlay:
    'linear-gradient(270deg, rgba(24, 27, 31, 0) 0, rgba(0, 0, 0, 0.925) 91%)',
  dot: 'rgba(255, 255, 255, 0.7)',
  scrollThumb: '#cfcfcf',
  scrollThumbHover: '#b5b5b5',
  shadow: '0 4px 20px 0 rgba(0, 0, 0, 0.16)',
} as const

export const fonts = {
  main: "'Oswald', sans-serif",
} as const

export const sizes = {
  heroTitle: 62,
  sectionTitle: 42,
  itemTitle: 32,
  cardTitle: 24,
  lead: 22,
  nav: 18,
  body: 18,
  base: 16,
  footerTitle: 20,
  footerLink: 15,
  small: 12,
  headerHeight: 113,
  logoHeight: 85,
  containerMax: 1800,
  containerPadX: 100,
  sectionGap: 90,
} as const

export const breakpoints = {
  wide: '@media (max-width: 1500px)',
  tablet: '@media (max-width: 1000px)',
  mobile: '@media (max-width: 768px)',
} as const

export const transition = 'all 0.3s'

export const appTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: colors.primary,
    colorError: colors.error,
    colorLink: colors.text,
    colorLinkHover: colors.primary,
    colorBgBase: colors.page,
    colorBgContainer: colors.black,
    colorBgElevated: colors.surface,
    colorBorder: colors.inputBorder,
    colorBorderSecondary: colors.border,
    colorText: colors.text,
    colorTextSecondary: colors.textSubtle,
    borderRadius: 0,
    borderRadiusLG: 0,
    borderRadiusSM: 0,
    borderRadiusXS: 0,
    fontFamily: fonts.main,
    fontSize: sizes.base,
    motionDurationMid: '0.3s',
  },
  components: {
    Button: {
      fontWeight: 600,
      controlHeight: 42,
      controlHeightLG: 50,
      paddingInline: 20,
      paddingInlineLG: 32,
      contentFontSizeLG: 18,
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none',
      defaultBg: 'transparent',
      defaultColor: colors.primary,
      defaultBorderColor: colors.primary,
      defaultHoverBg: colors.primary,
      defaultHoverColor: colors.text,
      defaultHoverBorderColor: colors.primary,
      defaultActiveBg: colors.primary,
      defaultActiveColor: colors.text,
      defaultActiveBorderColor: colors.primary,
    },
    Input: {
      colorBgContainer: 'transparent',
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.text,
      activeShadow: 'none',
      colorTextPlaceholder: 'rgba(255, 255, 255, 0.6)',
    },
    InputNumber: {
      colorBgContainer: 'transparent',
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.text,
      activeShadow: 'none',
    },
    Select: {
      colorBgContainer: 'transparent',
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.text,
      optionSelectedBg: colors.primary,
      optionSelectedColor: colors.text,
      colorBgElevated: colors.overlay,
    },
    Card: {
      colorBgContainer: colors.black,
      colorBorderSecondary: colors.border,
      headerFontSize: 20,
      actionsBg: colors.black,
    },
    List: {
      colorBorder: colors.border,
    },
    Modal: {
      contentBg: colors.surface,
      headerBg: colors.surface,
      footerBg: colors.surface,
      titleFontSize: 22,
    },
    Statistic: {
      titleFontSize: 14,
      contentFontSize: 32,
    },
    Tag: {
      defaultBg: 'transparent',
      defaultColor: colors.textMuted,
    },
    Alert: {
      colorInfoBg: colors.surface,
      colorInfoBorder: colors.border,
    },
    Typography: {
      titleMarginBottom: 18,
      titleMarginTop: 0,
    },
    Empty: {
      colorTextDescription: colors.textSubtle,
    },
  },
}
