/**
 * unitConverter.ts
 * Unit definitions for all 15 unit converter tools.
 * Each unit is defined relative to a base unit via toBase/fromBase functions.
 */
import type { UnitDef } from "@/components/tools/shared/UnitConverterShell";

// ─── Length ───────────────────────────────────────────────────────────────────
// Base: metre
export const LENGTH_UNITS: UnitDef[] = [
  { label:"Metre",       symbol:"m",    toBase: v=>v,           fromBase: v=>v },
  { label:"Kilometre",   symbol:"km",   toBase: v=>v*1000,      fromBase: v=>v/1000 },
  { label:"Centimetre",  symbol:"cm",   toBase: v=>v/100,       fromBase: v=>v*100 },
  { label:"Millimetre",  symbol:"mm",   toBase: v=>v/1000,      fromBase: v=>v*1000 },
  { label:"Mile",        symbol:"mi",   toBase: v=>v*1609.344,  fromBase: v=>v/1609.344 },
  { label:"Yard",        symbol:"yd",   toBase: v=>v*0.9144,    fromBase: v=>v/0.9144 },
  { label:"Foot",        symbol:"ft",   toBase: v=>v*0.3048,    fromBase: v=>v/0.3048 },
  { label:"Inch",        symbol:"in",   toBase: v=>v*0.0254,    fromBase: v=>v/0.0254 },
  { label:"Nautical mi", symbol:"nmi",  toBase: v=>v*1852,      fromBase: v=>v/1852 },
  { label:"Micrometre",  symbol:"μm",   toBase: v=>v/1e6,       fromBase: v=>v*1e6 },
];

// ─── Weight / Mass ────────────────────────────────────────────────────────────
// Base: kilogram
export const WEIGHT_UNITS: UnitDef[] = [
  { label:"Kilogram",    symbol:"kg",   toBase: v=>v,           fromBase: v=>v },
  { label:"Gram",        symbol:"g",    toBase: v=>v/1000,      fromBase: v=>v*1000 },
  { label:"Milligram",   symbol:"mg",   toBase: v=>v/1e6,       fromBase: v=>v*1e6 },
  { label:"Metric Ton",  symbol:"t",    toBase: v=>v*1000,      fromBase: v=>v/1000 },
  { label:"Pound",       symbol:"lb",   toBase: v=>v*0.453592,  fromBase: v=>v/0.453592 },
  { label:"Ounce",       symbol:"oz",   toBase: v=>v*0.0283495, fromBase: v=>v/0.0283495 },
  { label:"Stone",       symbol:"st",   toBase: v=>v*6.35029,   fromBase: v=>v/6.35029 },
  { label:"US Ton",      symbol:"ston", toBase: v=>v*907.185,   fromBase: v=>v/907.185 },
];

// ─── Temperature ─────────────────────────────────────────────────────────────
// Base: Celsius
export const TEMPERATURE_UNITS: UnitDef[] = [
  { label:"Celsius",    symbol:"°C", toBase: v=>v,                       fromBase: v=>v },
  { label:"Fahrenheit", symbol:"°F", toBase: v=>(v-32)*5/9,              fromBase: v=>v*9/5+32 },
  { label:"Kelvin",     symbol:"K",  toBase: v=>v-273.15,                fromBase: v=>v+273.15 },
  { label:"Rankine",    symbol:"°R", toBase: v=>(v-491.67)*5/9,          fromBase: v=>(v+273.15)*9/5+491.67-491.67 },
];

// ─── Speed ────────────────────────────────────────────────────────────────────
// Base: m/s
export const SPEED_UNITS: UnitDef[] = [
  { label:"Metre/sec",   symbol:"m/s",   toBase: v=>v,           fromBase: v=>v },
  { label:"Km/hour",     symbol:"km/h",  toBase: v=>v/3.6,       fromBase: v=>v*3.6 },
  { label:"Mile/hour",   symbol:"mph",   toBase: v=>v*0.44704,   fromBase: v=>v/0.44704 },
  { label:"Foot/sec",    symbol:"ft/s",  toBase: v=>v*0.3048,    fromBase: v=>v/0.3048 },
  { label:"Knot",        symbol:"kn",    toBase: v=>v*0.514444,  fromBase: v=>v/0.514444 },
  { label:"Mach",        symbol:"Ma",    toBase: v=>v*343,       fromBase: v=>v/343 },
];

// ─── Data Storage ─────────────────────────────────────────────────────────────
// Base: byte
export const DATA_UNITS: UnitDef[] = [
  { label:"Bit",       symbol:"bit", toBase: v=>v/8,          fromBase: v=>v*8 },
  { label:"Byte",      symbol:"B",   toBase: v=>v,            fromBase: v=>v },
  { label:"Kilobyte",  symbol:"KB",  toBase: v=>v*1024,       fromBase: v=>v/1024 },
  { label:"Megabyte",  symbol:"MB",  toBase: v=>v*1048576,    fromBase: v=>v/1048576 },
  { label:"Gigabyte",  symbol:"GB",  toBase: v=>v*1073741824, fromBase: v=>v/1073741824 },
  { label:"Terabyte",  symbol:"TB",  toBase: v=>v*1099511627776, fromBase: v=>v/1099511627776 },
  { label:"Petabyte",  symbol:"PB",  toBase: v=>v*1.12590e15, fromBase: v=>v/1.12590e15 },
];

// ─── Area ─────────────────────────────────────────────────────────────────────
// Base: sq metre
export const AREA_UNITS: UnitDef[] = [
  { label:"Sq Metre",    symbol:"m²",   toBase: v=>v,          fromBase: v=>v },
  { label:"Sq Km",       symbol:"km²",  toBase: v=>v*1e6,      fromBase: v=>v/1e6 },
  { label:"Sq Mile",     symbol:"mi²",  toBase: v=>v*2589988,  fromBase: v=>v/2589988 },
  { label:"Sq Foot",     symbol:"ft²",  toBase: v=>v*0.092903, fromBase: v=>v/0.092903 },
  { label:"Sq Inch",     symbol:"in²",  toBase: v=>v*6.4516e-4,fromBase: v=>v/6.4516e-4 },
  { label:"Acre",        symbol:"ac",   toBase: v=>v*4046.86,  fromBase: v=>v/4046.86 },
  { label:"Hectare",     symbol:"ha",   toBase: v=>v*10000,    fromBase: v=>v/10000 },
  { label:"Sq Yard",     symbol:"yd²",  toBase: v=>v*0.836127, fromBase: v=>v/0.836127 },
];

// ─── Volume ───────────────────────────────────────────────────────────────────
// Base: litre
export const VOLUME_UNITS: UnitDef[] = [
  { label:"Litre",       symbol:"L",    toBase: v=>v,          fromBase: v=>v },
  { label:"Millilitre",  symbol:"mL",   toBase: v=>v/1000,     fromBase: v=>v*1000 },
  { label:"Cubic Metre", symbol:"m³",   toBase: v=>v*1000,     fromBase: v=>v/1000 },
  { label:"US Gallon",   symbol:"gal",  toBase: v=>v*3.78541,  fromBase: v=>v/3.78541 },
  { label:"UK Gallon",   symbol:"uk gal",toBase:v=>v*4.54609,  fromBase: v=>v/4.54609 },
  { label:"US Cup",      symbol:"cup",  toBase: v=>v*0.236588, fromBase: v=>v/0.236588 },
  { label:"US Fl Oz",    symbol:"fl oz",toBase: v=>v*0.0295735,fromBase: v=>v/0.0295735 },
  { label:"Cubic Inch",  symbol:"in³",  toBase: v=>v*0.0163871,fromBase: v=>v/0.0163871 },
  { label:"Tablespoon",  symbol:"tbsp", toBase: v=>v*0.0147868,fromBase: v=>v/0.0147868 },
];

// ─── Time ─────────────────────────────────────────────────────────────────────
// Base: second
export const TIME_UNITS: UnitDef[] = [
  { label:"Second",      symbol:"s",    toBase: v=>v,           fromBase: v=>v },
  { label:"Millisecond", symbol:"ms",   toBase: v=>v/1000,      fromBase: v=>v*1000 },
  { label:"Microsecond", symbol:"μs",   toBase: v=>v/1e6,       fromBase: v=>v*1e6 },
  { label:"Minute",      symbol:"min",  toBase: v=>v*60,        fromBase: v=>v/60 },
  { label:"Hour",        symbol:"hr",   toBase: v=>v*3600,      fromBase: v=>v/3600 },
  { label:"Day",         symbol:"day",  toBase: v=>v*86400,     fromBase: v=>v/86400 },
  { label:"Week",        symbol:"wk",   toBase: v=>v*604800,    fromBase: v=>v/604800 },
  { label:"Month",       symbol:"mo",   toBase: v=>v*2629800,   fromBase: v=>v/2629800 },
  { label:"Year",        symbol:"yr",   toBase: v=>v*31557600,  fromBase: v=>v/31557600 },
];

// ─── Fuel Economy ─────────────────────────────────────────────────────────────
// Base: km/L
export const FUEL_UNITS: UnitDef[] = [
  { label:"km/L",        symbol:"km/L",   toBase: v=>v,          fromBase: v=>v },
  { label:"L/100km",     symbol:"L/100km",toBase: v=>100/v,      fromBase: v=>100/v },
  { label:"MPG (US)",    symbol:"mpg",    toBase: v=>v*0.425144, fromBase: v=>v/0.425144 },
  { label:"MPG (UK)",    symbol:"mpg UK", toBase: v=>v*0.354006, fromBase: v=>v/0.354006 },
  { label:"km/gal (US)", symbol:"km/gal", toBase: v=>v*0.264172, fromBase: v=>v/0.264172 },
];

// ─── Pressure ─────────────────────────────────────────────────────────────────
// Base: Pascal
export const PRESSURE_UNITS: UnitDef[] = [
  { label:"Pascal",      symbol:"Pa",   toBase: v=>v,          fromBase: v=>v },
  { label:"Kilopascal",  symbol:"kPa",  toBase: v=>v*1000,     fromBase: v=>v/1000 },
  { label:"Megapascal",  symbol:"MPa",  toBase: v=>v*1e6,      fromBase: v=>v/1e6 },
  { label:"Bar",         symbol:"bar",  toBase: v=>v*1e5,      fromBase: v=>v/1e5 },
  { label:"Millibar",    symbol:"mbar", toBase: v=>v*100,      fromBase: v=>v/100 },
  { label:"PSI",         symbol:"psi",  toBase: v=>v*6894.76,  fromBase: v=>v/6894.76 },
  { label:"Atmosphere",  symbol:"atm",  toBase: v=>v*101325,   fromBase: v=>v/101325 },
  { label:"Torr/mmHg",   symbol:"Torr", toBase: v=>v*133.322,  fromBase: v=>v/133.322 },
];

// ─── Energy ───────────────────────────────────────────────────────────────────
// Base: Joule
export const ENERGY_UNITS: UnitDef[] = [
  { label:"Joule",       symbol:"J",    toBase: v=>v,          fromBase: v=>v },
  { label:"Kilojoule",   symbol:"kJ",   toBase: v=>v*1000,     fromBase: v=>v/1000 },
  { label:"Calorie",     symbol:"cal",  toBase: v=>v*4.184,    fromBase: v=>v/4.184 },
  { label:"Kilocalorie", symbol:"kcal", toBase: v=>v*4184,     fromBase: v=>v/4184 },
  { label:"kWh",         symbol:"kWh",  toBase: v=>v*3.6e6,    fromBase: v=>v/3.6e6 },
  { label:"BTU",         symbol:"BTU",  toBase: v=>v*1055.06,  fromBase: v=>v/1055.06 },
  { label:"Electronvolt",symbol:"eV",   toBase: v=>v*1.60218e-19,fromBase:v=>v/1.60218e-19 },
  { label:"Foot-pound",  symbol:"ft⋅lb",toBase: v=>v*1.35582,  fromBase: v=>v/1.35582 },
];

// ─── Power ────────────────────────────────────────────────────────────────────
// Base: Watt
export const POWER_UNITS: UnitDef[] = [
  { label:"Watt",        symbol:"W",    toBase: v=>v,          fromBase: v=>v },
  { label:"Kilowatt",    symbol:"kW",   toBase: v=>v*1000,     fromBase: v=>v/1000 },
  { label:"Megawatt",    symbol:"MW",   toBase: v=>v*1e6,      fromBase: v=>v/1e6 },
  { label:"Horsepower",  symbol:"hp",   toBase: v=>v*745.7,    fromBase: v=>v/745.7 },
  { label:"BTU/hour",    symbol:"BTU/h",toBase: v=>v*0.293071, fromBase: v=>v/0.293071 },
  { label:"Calorie/sec", symbol:"cal/s",toBase: v=>v*4.184,    fromBase: v=>v/4.184 },
];

// ─── Frequency ────────────────────────────────────────────────────────────────
// Base: Hz
export const FREQUENCY_UNITS: UnitDef[] = [
  { label:"Hertz",       symbol:"Hz",   toBase: v=>v,          fromBase: v=>v },
  { label:"Kilohertz",   symbol:"kHz",  toBase: v=>v*1e3,      fromBase: v=>v/1e3 },
  { label:"Megahertz",   symbol:"MHz",  toBase: v=>v*1e6,      fromBase: v=>v/1e6 },
  { label:"Gigahertz",   symbol:"GHz",  toBase: v=>v*1e9,      fromBase: v=>v/1e9 },
  { label:"RPM",         symbol:"rpm",  toBase: v=>v/60,       fromBase: v=>v*60 },
  { label:"Rad/sec",     symbol:"rad/s",toBase: v=>v/(2*Math.PI),fromBase:v=>v*2*Math.PI },
];

// ─── Angle ────────────────────────────────────────────────────────────────────
// Base: degree
export const ANGLE_UNITS: UnitDef[] = [
  { label:"Degree",      symbol:"°",    toBase: v=>v,              fromBase: v=>v },
  { label:"Radian",      symbol:"rad",  toBase: v=>v*180/Math.PI,  fromBase: v=>v*Math.PI/180 },
  { label:"Gradian",     symbol:"grad", toBase: v=>v*0.9,          fromBase: v=>v/0.9 },
  { label:"Milliradian", symbol:"mrad", toBase: v=>v*180/(1000*Math.PI),fromBase:v=>v*1000*Math.PI/180 },
  { label:"Arcminute",   symbol:"′",    toBase: v=>v/60,           fromBase: v=>v*60 },
  { label:"Arcsecond",   symbol:"″",    toBase: v=>v/3600,         fromBase: v=>v*3600 },
  { label:"Turn",        symbol:"turn", toBase: v=>v*360,          fromBase: v=>v/360 },
];

// ─── Resolution / Digital Image ───────────────────────────────────────────────
// Base: PPI (pixels per inch)
export const RESOLUTION_UNITS: UnitDef[] = [
  { label:"PPI",         symbol:"PPI",  toBase: v=>v,             fromBase: v=>v },
  { label:"DPI",         symbol:"DPI",  toBase: v=>v,             fromBase: v=>v },
  { label:"PPCM",        symbol:"PPCM", toBase: v=>v*2.54,        fromBase: v=>v/2.54 },
  { label:"Dots/mm",     symbol:"dpmm", toBase: v=>v*25.4,        fromBase: v=>v/25.4 },
];
