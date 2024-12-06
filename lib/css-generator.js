import Color from 'colorjs.io'
import { OKLCH } from 'colorjs.io/fn'

// Use a primary color, and generate palette based on that - med utgangspunkt i fargeverktøy fra https://vestfoldfylke.no/no/Designmanual/meny/Visuell-verktoykasse/farger/
export const generatePalette = (baseColor, numberOfHues) => {
  // SKal fra #005260 (vann) til #1C6C6C (hav) til #14828C (fjord)
  /*
  vann #005260 oklch(40.34% 0.0709 214.23)  
  hav #1C6C6C oklch(48.54% 0.0739 194.99)
  fjord #14828C oklch(55.52% 0.0906 204.76)

  vann #005260
  hav #1C6C6C
  fjord #14828C
  himmel #009BC2
  gress #1F9562
  gran #2F7542
  korn #A5983A
  stein #7B7B7A
  berg #727062
  strand #8A6C3E
  siv #BC7726
  bark #996954
  nype #B7173D
  plomme #5A2E61
  blåveis #414681

  LIGHTNESS
  lightness changes quite a lot - from 0.08 on hav to 0.80 on nype

  CHROMA
  chroma changes from 0.003 on hav to 0.10 on korn, so a little bit

  HUE
  hue changes from -19.23 on hav to -190.29 on blåveis, so quite a lot - but approximately 10 degrees per step -thats consistent at least
  */
  const base = new Color(baseColor)
  // 0.4033778192255503, 0.07098522051951742, 214.22621572191002 - vann

  // 360 / x = 10
  // x = 36
  const steps = numberOfHues * 36
  
  // 0 + 24 + 48 + 72 + 96 + 120 + 144 + 168 + 192 + 216 + 240 + 264 + 288 + 312 + 336 + 360

  const colors = {
    vann: new Color("#005260"),
    hav: new Color("#1C6C6C"),
    fjord: new Color("#14828C"),
    himmel: new Color('#009BC2'),
    gress: new Color('#1F9562'),
    gran: new Color('#2F7542'),
    korn: new Color('#A5983A'),
    stein: new Color('#7B7B7A'),
    berg: new Color('#727062'),
    strand: new Color('#8A6C3E'),
    siv: new Color('#BC7726'),
    bark: new Color('#996954'),
    nype: new Color('#B7173D'),
    plomme: new Color('#5A2E61'),
    blåveis: new Color('#414681')
  }

  // HUe - 0 is red, 120 is green, and 240 is blue
  /* 
  On Lightness 100%
    [0,20] - pink length 20
    [21,40] - red length 20
    [41,70] - orange length 30
    [71,115] - yellow length 45
    [116,175] - green length 60
    [176,270] - blue length 95
    [271,280] - purple length 10
    [281,360] - pink length 80
  On lightness 75%
    [0,15] - pink length 15
    [16,70] - red length 55
    [71,100] - orange length 30
    [101,110] - yellow length 10
    [111,185] - green length 75
    [186,275] - blue length 90
    [276,285] - purple length 10
    [286,360] - pink length 75
  On Lightness 50%
    [0,95] - red length 95
    [96,100] - orange length 5
    [101,110] - brown length 10
    [111,190] - green length 80
    [191,280] - blue length 105
    [281,300] - purple length 20
    [301,360] - pink length 60
  On lightness 25%
    [0,74] - red length 75
    [75,109] - brown length 15
    [110,185] - green length 70
    [186,290] - blue  length 105
    [286,350] - purple length 65
    [351,360] - red length 10
  On lightness 0%
    [0,44] - red length 45
    [45,179] - green length 135
    [180,314] - blue length 135
    [315,360] - red length 45

  On brightness [0, 25, 50, 75, 100]
  Red has lengths [90, 85, 95, 55, 20] - 

  Can we deduce something from this?
  lets pretend 50 is 0 - then 75 is actually 50 and 100 is 100
  Red increases as lightness decreases. 100% 20, 75% 55, 50% 95
  so red * (1*factor) = 20, red * (50*factor) = 55, red * (100*factor) = 95 - factor is 0.75?
  red * (25*factor) = 37,5

  if (lightness < 50) we have one set of colors we can achieve
  else we have another set of colors we can achieve

  if we have hue 55 we have red - and we need to 
  
  const getColorHueRanges = (lightness) => {


  const getHueRange = (lightness, hue?) => {
    getColorHueRange = (lightness) => {
  
  






  lets say we start with blue - L: 40%, C: 0.07, H: 214
  Lightness is below 50%, blue is in range [176, 280], which has length 104, and normalizing to 104, 214 is on step 38 - percentage 36.54%
  First we keep the lightness and chroma, and change the hue to get the colors we can on this lightness

  We 



const pureHuesBySight = {
    red: 30, // 60 to the left, 30 to the right, total range 90
    orange: 60, // 30 to the left, 45 to the right, total range 75
    brown: 75, // 15 to the left, 30 to the right, total range 45
    yellow: 105, // 30 to the left, 45 to the right, total range 75
    green: 150, // 45 to the left, 45 to the right, total range 90
    cyan: 200, // 50 to the left, 55 to the right, total range 105
    blue: 255, // 55 to the left, 75 to the right, total range 130
    purple: 300, // 45 to the left, 30 to the right, total range 75
    pink: 330 // 30 to the left, 60 to the right, total range 90
  }

  */

  /*
  primary, secondary, tertiary
  navigation - blue hue
  error - red hue
  success - green hue
  warning - yellow hue
  info - light blue hue?

  */

  for (const [colorName, color] of Object.entries(colors)) {
    // console.log(`${color.toString({ format: { name: 'rgb2', coords: [ "<number>[0, 255]", "<number>[0, 255]", "<number>[0, 255]" ] } })} - ${colorName}`)
    console.log(`${color.toString({ format: 'rgb' })} - ${colorName}`)
  }
  console.log('---')
  for (const [colorName, color] of Object.entries(colors)) {
    // console.log(`${color.toString({ format: { name: 'rgb2', coords: [ "<number>[0, 255]", "<number>[0, 255]", "<number>[0, 255]" ] } })} - ${colorName}`)
    console.log(`${color.oklch} - ${colorName}`)
  }

  // Comparing to vann
  // OKLCH
  const compareTo = colors.stein
  for (const [colorName, color] of Object.entries(colors)) {
    // console.log(`${color.toString({ format: { name: 'rgb2', coords: [ "<number>[0, 255]", "<number>[0, 255]", "<number>[0, 255]" ] } })} - ${colorName}`)
    console.log(`L diff: ${compareTo.oklch.l - color.oklch.l} - C diff: ${compareTo.oklch.c - color.oklch.c} - H diff: ${compareTo.oklch.h - color.oklch.h} - ${colorName}`)
  }
  console.log('')
  console.log('---')
  console.log('')
  // HSL
  for (const [colorName, color] of Object.entries(colors)) {
    // console.log(`${color.toString({ format: { name: 'rgb2', coords: [ "<number>[0, 255]", "<number>[0, 255]", "<number>[0, 255]" ] } })} - ${colorName}`)
    console.log(`H diff: ${compareTo.hsl.h - color.hsl.h} - S diff: ${compareTo.hsl.s - color.hsl.s} - L diff: ${compareTo.hsl.l - color.hsl.l} - ${colorName}`)
  }

  console.log('')
  console.log('---')
  console.log('')

  // LCH
  for (const [colorName, color] of Object.entries(colors)) {
    // console.log(`${color.toString({ format: { name: 'rgb2', coords: [ "<number>[0, 255]", "<number>[0, 255]", "<number>[0, 255]" ] } })} - ${colorName}`)
    console.log(`L diff: ${compareTo.lch.l - color.lch.l} - C diff: ${compareTo.lch.c - color.lch.c} - H diff: ${compareTo.lch.h - color.lch.h} - ${colorName}`)
  }

  return null
  return {
    vann: primary.toString({ format: 'hex' }),
    hav: secondary.toString({ format: 'hex' }),
    fjord: secondary.toString({ format: 'hex' })
  }
}

export const generateCss = (customTheme, options = {}) => {

}

/*
import { oklch, hex } from 'culori';

// Convert the input color to OKLCH
const inputColor = oklch('#005260');

// BASED ON VANN

// Define variations by adjusting L, C, and H
const variations = [
  { name: 'vann', color: inputColor },
  { name: 'hav', color: { ...inputColor, l: inputColor.l + 0.08, c: inputColor.c + 0.003, h: inputColor.h - 19.23 } },
  { name: 'fjord', color: { ...inputColor, l: inputColor.l + 0.15, c: inputColor.c + 0.02, h: inputColor.h - 9.47 } },
  { name: 'himmel', color: { ...inputColor, l: inputColor.l + 0.24, c: inputColor.c + 0.05, h: inputColor.h + 10.53 } },
  { name: 'gress', color: { ...inputColor, l: inputColor.l + 0.19, c: inputColor.c + 0.06, h: inputColor.h - 55.29 } },
  { name: 'gran', color: { ...inputColor, l: inputColor.l + 0.14, c: inputColor.c + 0.05, h: inputColor.h - 70.29 } },
  { name: 'korn', color: { ...inputColor, l: inputColor.l + 0.55, c: inputColor.c + 0.10, h: inputColor.h - 100.29 } },
  { name: 'stein', color: { ...inputColor, l: inputColor.l + 0.35, c: inputColor.c + 0.00, h: inputColor.h - 120.29 } },
  { name: 'berg', color: { ...inputColor, l: inputColor.l + 0.32, c: inputColor.c - 0.01, h: inputColor.h - 130.29 } },
  { name: 'strand', color: { ...inputColor, l: inputColor.l + 0.45, c: inputColor.c + 0.03, h: inputColor.h - 140.29 } },
  { name: 'siv', color: { ...inputColor, l: inputColor.l + 0.75, c: inputColor.c + 0.05, h: inputColor.h - 150.29 } },
  { name: 'bark', color: { ...inputColor, l: inputColor.l + 0.60, c: inputColor.c + 0.04, h: inputColor.h - 160.29 } },
  { name: 'nype', color: { ...inputColor, l: inputColor.l + 0.80, c: inputColor.c + 0.07, h: inputColor.h - 170.29 } },
  { name: 'plomme', color: { ...inputColor, l: inputColor.l + 0.20, c: inputColor.c + 0.03, h: inputColor.h - 180.29 } },
  { name: 'blåveis', color: { ...inputColor, l: inputColor.l + 0.10, c: inputColor.c + 0.01, h: inputColor.h - 190.29 } }
];

// 0 19.23  9.47  10.53  55.29  70.29  100.29  120.29  130.29  140.29  150.29  160.29  170.29  180.29  190.29

// 0 9.47  10.53  55.29  70.29  100.29  120.29  130.29  140.29  150.29  160.29  170.29  180.29  190.29

/*
relations from the stuff above
LIGHTNESS
lightness changes quite a lot - from 0.08 on hav to 0.80 on nype

CHROMA
chroma changes from 0.003 on hav to 0.10 on korn, so a little bit

HUE
hue changes from -19.23 on hav to -190.29 on blåveis, so quite a lot - but approximately 10 degrees per step -thats consistent at least



// Convert the variations back to HEX
const palette = variations.map(variation => ({
  name: variation.name,
  color: hex(variation.color)
}));

// Output the palette
console.log(palette);


/*

import { oklch, hex } from 'culori';

// Convert the input color to OKLCH
const inputColor = oklch('#7B7B7A');

// Define variations by adjusting L, C, and H
const variations = [
  { name: 'vann', color: { ...inputColor, l: 0.4034, c: 0.0709, h: 214.23 } },
  { name: 'hav', color: { ...inputColor, l: 0.4854, c: 0.0739, h: 194.99 } },
  { name: 'fjord', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 204.76 } },
  { name: 'himmel', color: { ...inputColor, l: 0.4034, c: 0.0709, h: 214.23 } },
  { name: 'gress', color: { ...inputColor, l: 0.5946, c: 0.1275, h: 158.93 } },
  { name: 'gran', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 158.93 } },
  { name: 'korn', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 58.93 } },
  { name: 'stein', color: inputColor },
  { name: 'berg', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 158.93 } },
  { name: 'strand', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 38.93 } },
  { name: 'siv', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 28.93 } },
  { name: 'bark', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 18.93 } },
  { name: 'nype', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 348.93 } },
  { name: 'plomme', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 328.93 } },
  { name: 'blåveis', color: { ...inputColor, l: 0.5552, c: 0.0906, h: 308.93 } }
];

// Convert the variations back to HEX
const palette = variations.map(variation => ({
  name: variation.name,
  color: hex(variation.color)
}));

// Output the palette
console.log(palette);
*/