'use client';
import { vars } from 'nativewind';

export const config = {
  light: vars({
    // Primary - 브랜드 블루 (기존 theme-provider의 primary와 유사)
    '--color-primary-50': '223 237 253',
    '--color-primary-100': '179 212 250',
    '--color-primary-200': '134 187 247',
    '--color-primary-300': '89 161 244',
    '--color-primary-400': '45 136 241',
    '--color-primary-500': '0 111 238',
    '--color-primary-600': '0 92 196',
    '--color-primary-700': '0 72 155',
    '--color-primary-800': '0 53 113',
    '--color-primary-900': '0 33 71',
    '--color-primary-950': '0 20 43',

    // Secondary - 보라색 (기존 theme-provider와 유사)
    '--color-secondary-50': '238 228 248',
    '--color-secondary-100': '215 191 239',
    '--color-secondary-200': '191 153 229',
    '--color-secondary-300': '167 115 219',
    '--color-secondary-400': '144 78 210',
    '--color-secondary-500': '120 40 200',
    '--color-secondary-600': '99 33 167',
    '--color-secondary-700': '78 26 133',
    '--color-secondary-800': '57 19 95',
    '--color-secondary-900': '36 12 60',
    '--color-secondary-950': '24 8 40',

    // Default - 중성 그레이
    '--color-default-50': '250 250 250',
    '--color-default-100': '245 245 245',
    '--color-default-200': '229 229 229',
    '--color-default-300': '212 212 212',
    '--color-default-400': '163 163 163',
    '--color-default-500': '115 115 115',
    '--color-default-600': '82 82 82',
    '--color-default-700': '64 64 64',
    '--color-default-800': '38 38 38',
    '--color-default-900': '23 23 23',
    '--color-default-950': '18 18 18',

    // Success - 초록색
    '--color-success-50': '226 248 236',
    '--color-success-100': '185 239 209',
    '--color-success-200': '145 229 181',
    '--color-success-300': '104 220 154',
    '--color-success-400': '64 210 126',
    '--color-success-500': '23 201 100',
    '--color-success-600': '19 166 83',
    '--color-success-700': '15 131 66',
    '--color-success-800': '11 95 48',
    '--color-success-900': '7 60 30',
    '--color-success-950': '5 39 20',

    // Warning - 노란색/오렌지
    '--color-warning-50': '254 244 228',
    '--color-warning-100': '252 228 189',
    '--color-warning-200': '250 212 150',
    '--color-warning-300': '249 197 113',
    '--color-warning-400': '247 181 74',
    '--color-warning-500': '245 165 36',
    '--color-warning-600': '202 136 30',
    '--color-warning-700': '159 107 23',
    '--color-warning-800': '116 78 17',
    '--color-warning-900': '73 50 11',
    '--color-warning-950': '48 32 7',

    // Danger/Error - 빨간색
    '--color-danger-50': '254 225 235',
    '--color-danger-100': '251 184 207',
    '--color-danger-200': '248 142 179',
    '--color-danger-300': '245 101 152',
    '--color-danger-400': '243 59 124',
    '--color-danger-500': '240 18 96',
    '--color-danger-600': '200 15 80',
    '--color-danger-700': '158 12 63',
    '--color-danger-800': '115 9 46',
    '--color-danger-900': '73 5 29',
    '--color-danger-950': '48 3 19',

    // Info - 하늘색
    '--color-info-50': '236 248 254',
    '--color-info-100': '199 235 252',
    '--color-info-200': '162 221 250',
    '--color-info-300': '124 207 248',
    '--color-info-400': '87 194 246',
    '--color-info-500': '50 180 244',
    '--color-info-600': '41 149 202',
    '--color-info-700': '33 115 159',
    '--color-info-800': '25 90 131',
    '--color-info-900': '15 64 93',
    '--color-info-950': '10 38 56',

    // Typography
    '--color-typography-50': '250 250 250',
    '--color-typography-100': '245 245 245',
    '--color-typography-200': '229 229 229',
    '--color-typography-300': '212 212 212',
    '--color-typography-400': '163 163 163',
    '--color-typography-500': '115 115 115',
    '--color-typography-600': '82 82 82',
    '--color-typography-700': '64 64 64',
    '--color-typography-800': '38 38 38',
    '--color-typography-900': '23 23 23',
    '--color-typography-950': '0 0 0',

    // Background
    '--color-background': '255 255 255',
    '--color-background-50': '250 250 250',
    '--color-background-100': '245 245 245',
    '--color-background-200': '229 229 229',
    '--color-background-300': '212 212 212',
    '--color-background-400': '163 163 163',
    '--color-background-muted': '250 250 250',
    '--color-background-subtle': '245 245 245',

    // Content backgrounds
    '--color-content1': '255 255 255',
    '--color-content2': '250 250 250',
    '--color-content3': '245 245 245',
    '--color-content4': '229 229 229',

    // Borders
    '--color-border': '229 229 229',
    '--color-border-light': '245 245 245',
    '--color-border-medium': '212 212 212',
    '--color-border-strong': '163 163 163',

    // Focus
    '--color-focus': '0 111 238',
    '--color-focus-ring': '0 111 238',

    // Overlay
    '--color-overlay': '0 0 0',
    '--color-overlay-light': '255 255 255',

    // Foreground
    '--color-foreground': '23 23 23',
    '--color-foreground-secondary': '82 82 82',
    '--color-foreground-muted': '115 115 115',
  }),

  dark: vars({
    // Primary - 브랜드 블루 (다크 모드)
    '--color-primary-50': '0 20 43',
    '--color-primary-100': '0 33 71',
    '--color-primary-200': '0 53 113',
    '--color-primary-300': '0 72 155',
    '--color-primary-400': '0 92 196',
    '--color-primary-500': '0 111 238',
    '--color-primary-600': '45 136 241',
    '--color-primary-700': '89 161 244',
    '--color-primary-800': '134 187 247',
    '--color-primary-900': '179 212 250',
    '--color-primary-950': '223 237 253',

    // Secondary - 보라색 (다크 모드)
    '--color-secondary-50': '24 8 40',
    '--color-secondary-100': '36 12 60',
    '--color-secondary-200': '57 19 95',
    '--color-secondary-300': '78 26 133',
    '--color-secondary-400': '99 33 167',
    '--color-secondary-500': '120 40 200',
    '--color-secondary-600': '144 78 210',
    '--color-secondary-700': '167 115 219',
    '--color-secondary-800': '191 153 229',
    '--color-secondary-900': '215 191 239',
    '--color-secondary-950': '238 228 248',

    // Default - 중성 그레이 (다크 모드)
    '--color-default-50': '18 18 18',
    '--color-default-100': '23 23 23',
    '--color-default-200': '38 38 38',
    '--color-default-300': '64 64 64',
    '--color-default-400': '82 82 82',
    '--color-default-500': '115 115 115',
    '--color-default-600': '163 163 163',
    '--color-default-700': '212 212 212',
    '--color-default-800': '229 229 229',
    '--color-default-900': '245 245 245',
    '--color-default-950': '250 250 250',

    // Success - 초록색 (다크 모드)
    '--color-success-50': '5 39 20',
    '--color-success-100': '7 60 30',
    '--color-success-200': '11 95 48',
    '--color-success-300': '15 131 66',
    '--color-success-400': '19 166 83',
    '--color-success-500': '23 201 100',
    '--color-success-600': '64 210 126',
    '--color-success-700': '104 220 154',
    '--color-success-800': '145 229 181',
    '--color-success-900': '185 239 209',
    '--color-success-950': '226 248 236',

    // Warning - 노란색/오렌지 (다크 모드)
    '--color-warning-50': '48 32 7',
    '--color-warning-100': '73 50 11',
    '--color-warning-200': '116 78 17',
    '--color-warning-300': '159 107 23',
    '--color-warning-400': '202 136 30',
    '--color-warning-500': '245 165 36',
    '--color-warning-600': '247 181 74',
    '--color-warning-700': '249 197 113',
    '--color-warning-800': '250 212 150',
    '--color-warning-900': '252 228 189',
    '--color-warning-950': '254 244 228',

    // Danger/Error - 빨간색 (다크 모드)
    '--color-danger-50': '48 3 19',
    '--color-danger-100': '73 5 29',
    '--color-danger-200': '115 9 46',
    '--color-danger-300': '158 12 63',
    '--color-danger-400': '200 15 80',
    '--color-danger-500': '240 18 96',
    '--color-danger-600': '243 59 124',
    '--color-danger-700': '245 101 152',
    '--color-danger-800': '248 142 179',
    '--color-danger-900': '251 184 207',
    '--color-danger-950': '254 225 235',

    // Info - 하늘색 (다크 모드)
    '--color-info-50': '10 38 56',
    '--color-info-100': '15 64 93',
    '--color-info-200': '25 90 131',
    '--color-info-300': '33 115 159',
    '--color-info-400': '41 149 202',
    '--color-info-500': '50 180 244',
    '--color-info-600': '87 194 246',
    '--color-info-700': '124 207 248',
    '--color-info-800': '162 221 250',
    '--color-info-900': '199 235 252',
    '--color-info-950': '236 248 254',

    // Typography (다크 모드)
    '--color-typography-50': '255 255 255',
    '--color-typography-100': '245 245 245',
    '--color-typography-200': '229 229 229',
    '--color-typography-300': '212 212 212',
    '--color-typography-400': '163 163 163',
    '--color-typography-500': '115 115 115',
    '--color-typography-600': '82 82 82',
    '--color-typography-700': '64 64 64',
    '--color-typography-800': '38 38 38',
    '--color-typography-900': '23 23 23',
    '--color-typography-950': '18 18 18',

    // Background (다크 모드)
    '--color-background': '0 0 0',
    '--color-background-50': '18 18 18',
    '--color-background-100': '23 23 23',
    '--color-background-200': '38 38 38',
    '--color-background-300': '64 64 64',
    '--color-background-400': '82 82 82',
    '--color-background-muted': '18 18 18',
    '--color-background-subtle': '23 23 23',

    // Content backgrounds (다크 모드)
    '--color-content1': '18 18 18',
    '--color-content2': '23 23 23',
    '--color-content3': '38 38 38',
    '--color-content4': '64 64 64',

    // Borders (다크 모드)
    '--color-border': '38 38 38',
    '--color-border-light': '23 23 23',
    '--color-border-medium': '64 64 64',
    '--color-border-strong': '82 82 82',

    // Focus (다크 모드)
    '--color-focus': '0 111 238',
    '--color-focus-ring': '0 111 238',

    // Overlay (다크 모드)
    '--color-overlay': '255 255 255',
    '--color-overlay-light': '0 0 0',

    // Foreground (다크 모드)
    '--color-foreground': '245 245 245',
    '--color-foreground-secondary': '212 212 212',
    '--color-foreground-muted': '163 163 163',
  }),
};
