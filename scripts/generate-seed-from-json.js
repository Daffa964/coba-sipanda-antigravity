const fs = require('fs');
const path = require('path');

// Read the JSON data
const jsonPath = path.join(__dirname, '..', 'data_anak.json');
const outputPath = path.join(__dirname, '..', 'prisma', '04-seed-from-json.sql');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// =====================================================
// WHO GROWTH STANDARDS (Copy from src/lib/zscore.ts)
// =====================================================

// Weight-for-Age (WAZ) - Boys (0-60 months)
const WAZ_BOYS = {
  0: { L: 0.3487, M: 3.3464, S: 0.14602 },
  1: { L: 0.2297, M: 4.4709, S: 0.13395 },
  2: { L: 0.197, M: 5.5675, S: 0.12385 },
  3: { L: 0.1738, M: 6.3762, S: 0.11727 },
  4: { L: 0.1553, M: 7.0023, S: 0.11316 },
  5: { L: 0.1395, M: 7.5105, S: 0.1108 },
  6: { L: 0.1257, M: 7.934, S: 0.10958 },
  7: { L: 0.1134, M: 8.297, S: 0.10902 },
  8: { L: 0.1021, M: 8.6151, S: 0.10882 },
  9: { L: 0.0917, M: 8.9014, S: 0.10881 },
  10: { L: 0.082, M: 9.1649, S: 0.10891 },
  11: { L: 0.073, M: 9.4122, S: 0.10906 },
  12: { L: 0.0644, M: 9.6479, S: 0.10925 },
  13: { L: 0.0563, M: 9.8749, S: 0.10949 },
  14: { L: 0.0487, M: 10.0953, S: 0.10976 },
  15: { L: 0.0413, M: 10.3108, S: 0.11007 },
  16: { L: 0.0343, M: 10.5228, S: 0.11041 },
  17: { L: 0.0275, M: 10.7319, S: 0.11079 },
  18: { L: 0.0211, M: 10.9385, S: 0.11119 },
  19: { L: 0.0148, M: 11.143, S: 0.11164 },
  20: { L: 0.0087, M: 11.3462, S: 0.11211 },
  21: { L: 0.0029, M: 11.5486, S: 0.11261 },
  22: { L: -0.0028, M: 11.7504, S: 0.11314 },
  23: { L: -0.0083, M: 11.9514, S: 0.11369 },
  24: { L: -0.0137, M: 12.1515, S: 0.11426 },
  25: { L: -0.0189, M: 12.3502, S: 0.11485 },
  26: { L: -0.024, M: 12.5466, S: 0.11544 },
  27: { L: -0.0289, M: 12.7401, S: 0.11604 },
  28: { L: -0.0337, M: 12.9303, S: 0.11664 },
  29: { L: -0.0385, M: 13.1169, S: 0.11723 },
  30: { L: -0.0431, M: 13.3, S: 0.11781 },
  31: { L: -0.0476, M: 13.4798, S: 0.11839 },
  32: { L: -0.052, M: 13.6567, S: 0.11896 },
  33: { L: -0.0564, M: 13.8309, S: 0.11953 },
  34: { L: -0.0606, M: 14.0031, S: 0.12008 },
  35: { L: -0.0648, M: 14.1736, S: 0.12062 },
  36: { L: -0.0689, M: 14.3429, S: 0.12116 },
  37: { L: -0.0729, M: 14.5113, S: 0.12168 },
  38: { L: -0.0769, M: 14.6791, S: 0.1222 },
  39: { L: -0.0808, M: 14.8466, S: 0.12271 },
  40: { L: -0.0846, M: 15.014, S: 0.12322 },
  41: { L: -0.0883, M: 15.1813, S: 0.12373 },
  42: { L: -0.092, M: 15.3486, S: 0.12425 },
  43: { L: -0.0957, M: 15.5158, S: 0.12478 },
  44: { L: -0.0993, M: 15.6828, S: 0.12531 },
  45: { L: -0.1028, M: 15.8497, S: 0.12586 },
  46: { L: -0.1063, M: 16.0163, S: 0.12643 },
  47: { L: -0.1097, M: 16.1827, S: 0.127 },
  48: { L: -0.1131, M: 16.3489, S: 0.12759 },
  49: { L: -0.1165, M: 16.515, S: 0.12819 },
  50: { L: -0.1198, M: 16.6811, S: 0.1288 },
  51: { L: -0.123, M: 16.8471, S: 0.12943 },
  52: { L: -0.1262, M: 17.0132, S: 0.13005 },
  53: { L: -0.1294, M: 17.1792, S: 0.13069 },
  54: { L: -0.1325, M: 17.3452, S: 0.13133 },
  55: { L: -0.1356, M: 17.5111, S: 0.13197 },
  56: { L: -0.1387, M: 17.6768, S: 0.13261 },
  57: { L: -0.1417, M: 17.8422, S: 0.13325 },
  58: { L: -0.1447, M: 18.0073, S: 0.13389 },
  59: { L: -0.1477, M: 18.1722, S: 0.13453 },
  60: { L: -0.1506, M: 18.3366, S: 0.13517 },
};

// Weight-for-Age (WAZ) - Girls (0-60 months)
const WAZ_GIRLS = {
  0: { L: 0.3809, M: 3.2322, S: 0.14171 },
  1: { L: 0.1714, M: 4.1873, S: 0.13724 },
  2: { L: 0.0962, M: 5.1282, S: 0.13 },
  3: { L: 0.0402, M: 5.8458, S: 0.12619 },
  4: { L: -0.005, M: 6.4237, S: 0.12402 },
  5: { L: -0.043, M: 6.8985, S: 0.12274 },
  6: { L: -0.0756, M: 7.297, S: 0.12204 },
  7: { L: -0.1039, M: 7.6422, S: 0.12178 },
  8: { L: -0.1288, M: 7.9487, S: 0.12181 },
  9: { L: -0.1507, M: 8.2254, S: 0.12199 },
  10: { L: -0.17, M: 8.48, S: 0.12223 },
  11: { L: -0.1872, M: 8.7192, S: 0.12247 },
  12: { L: -0.2024, M: 8.9481, S: 0.12268 },
  13: { L: -0.2158, M: 9.1699, S: 0.12283 },
  14: { L: -0.2278, M: 9.387, S: 0.12294 },
  15: { L: -0.2384, M: 9.6008, S: 0.12299 },
  16: { L: -0.2478, M: 9.8124, S: 0.12303 },
  17: { L: -0.2562, M: 10.0226, S: 0.12306 },
  18: { L: -0.2637, M: 10.2315, S: 0.12309 },
  19: { L: -0.2703, M: 10.4393, S: 0.12315 },
  20: { L: -0.2762, M: 10.6464, S: 0.12323 },
  21: { L: -0.2815, M: 10.8534, S: 0.12335 },
  22: { L: -0.2862, M: 11.0608, S: 0.1235 },
  23: { L: -0.2903, M: 11.2688, S: 0.12369 },
  24: { L: -0.2941, M: 11.4775, S: 0.1239 },
  25: { L: -0.2975, M: 11.6864, S: 0.12414 },
  26: { L: -0.3005, M: 11.8947, S: 0.12441 },
  27: { L: -0.3032, M: 12.1015, S: 0.12472 },
  28: { L: -0.3057, M: 12.3059, S: 0.12506 },
  29: { L: -0.308, M: 12.5073, S: 0.12545 },
  30: { L: -0.3101, M: 12.7055, S: 0.12587 },
  31: { L: -0.312, M: 12.9006, S: 0.12633 },
  32: { L: -0.3138, M: 13.093, S: 0.12683 },
  33: { L: -0.3155, M: 13.2837, S: 0.12737 },
  34: { L: -0.3171, M: 13.4731, S: 0.12794 },
  35: { L: -0.3186, M: 13.6618, S: 0.12855 },
  36: { L: -0.3201, M: 13.8503, S: 0.12919 },
  37: { L: -0.3216, M: 14.0385, S: 0.12988 },
  38: { L: -0.323, M: 14.2265, S: 0.13059 },
  39: { L: -0.3243, M: 14.414, S: 0.13135 },
  40: { L: -0.3257, M: 14.601, S: 0.13213 },
  41: { L: -0.327, M: 14.7873, S: 0.13293 },
  42: { L: -0.3283, M: 14.9727, S: 0.13376 },
  43: { L: -0.3296, M: 15.1573, S: 0.1346 },
  44: { L: -0.3309, M: 15.341, S: 0.13545 },
  45: { L: -0.3322, M: 15.524, S: 0.1363 },
  46: { L: -0.3335, M: 15.7064, S: 0.13716 },
  47: { L: -0.3348, M: 15.8882, S: 0.138 },
  48: { L: -0.3361, M: 16.0697, S: 0.13884 },
  49: { L: -0.3374, M: 16.2511, S: 0.13968 },
  50: { L: -0.3387, M: 16.4322, S: 0.14051 },
  51: { L: -0.34, M: 16.6133, S: 0.14132 },
  52: { L: -0.3414, M: 16.7942, S: 0.14213 },
  53: { L: -0.3427, M: 16.9748, S: 0.14293 },
  54: { L: -0.344, M: 17.1551, S: 0.14371 },
  55: { L: -0.3453, M: 17.3347, S: 0.14448 },
  56: { L: -0.3466, M: 17.5136, S: 0.14525 },
  57: { L: -0.3479, M: 17.6916, S: 0.146 },
  58: { L: -0.3492, M: 17.8686, S: 0.14675 },
  59: { L: -0.3505, M: 18.0445, S: 0.14748 },
  60: { L: -0.3518, M: 18.2193, S: 0.14821 },
};

// Height-for-Age (HAZ) - Boys
const HAZ_BOYS = {
  0: { L: 1, M: 49.8842, S: 0.03795 },
  1: { L: 1, M: 54.7244, S: 0.03557 },
  2: { L: 1, M: 58.4249, S: 0.03424 },
  3: { L: 1, M: 61.4292, S: 0.03328 },
  4: { L: 1, M: 63.886, S: 0.03257 },
  5: { L: 1, M: 65.9026, S: 0.03204 },
  6: { L: 1, M: 67.6236, S: 0.03165 },
  7: { L: 1, M: 69.1645, S: 0.03139 },
  8: { L: 1, M: 70.5994, S: 0.03124 },
  9: { L: 1, M: 71.9687, S: 0.03117 },
  10: { L: 1, M: 73.2812, S: 0.03118 },
  11: { L: 1, M: 74.5388, S: 0.03125 },
  12: { L: 1, M: 75.7488, S: 0.03137 },
  13: { L: 1, M: 76.9186, S: 0.03154 },
  14: { L: 1, M: 78.0497, S: 0.03174 },
  15: { L: 1, M: 79.1458, S: 0.03197 },
  16: { L: 1, M: 80.2113, S: 0.03222 },
  17: { L: 1, M: 81.2487, S: 0.0325 },
  18: { L: 1, M: 82.2587, S: 0.03279 },
  19: { L: 1, M: 83.2418, S: 0.0331 },
  20: { L: 1, M: 84.1996, S: 0.03342 },
  21: { L: 1, M: 85.1348, S: 0.03376 },
  22: { L: 1, M: 86.0477, S: 0.0341 },
  23: { L: 1, M: 86.941, S: 0.03445 },
  24: { L: 1, M: 87.1161, S: 0.03507 },
  25: { L: 1, M: 87.972, S: 0.03542 },
  26: { L: 1, M: 88.8065, S: 0.03576 },
  27: { L: 1, M: 89.6197, S: 0.0361 },
  28: { L: 1, M: 90.412, S: 0.03642 },
  29: { L: 1, M: 91.1828, S: 0.03674 },
  30: { L: 1, M: 91.9327, S: 0.03704 },
  31: { L: 1, M: 92.6631, S: 0.03733 },
  32: { L: 1, M: 93.3753, S: 0.03761 },
  33: { L: 1, M: 94.0711, S: 0.03787 },
  34: { L: 1, M: 94.7532, S: 0.03812 },
  35: { L: 1, M: 95.4236, S: 0.03836 },
  36: { L: 1, M: 96.0835, S: 0.03858 },
  37: { L: 1, M: 96.7337, S: 0.03879 },
  38: { L: 1, M: 97.3749, S: 0.039 },
  39: { L: 1, M: 98.0073, S: 0.03919 },
  40: { L: 1, M: 98.631, S: 0.03937 },
  41: { L: 1, M: 99.2459, S: 0.03954 },
  42: { L: 1, M: 99.8515, S: 0.03971 },
  43: { L: 1, M: 100.4485, S: 0.03986 },
  44: { L: 1, M: 101.0374, S: 0.04002 },
  45: { L: 1, M: 101.6186, S: 0.04016 },
  46: { L: 1, M: 102.1933, S: 0.04031 },
  47: { L: 1, M: 102.7625, S: 0.04045 },
  48: { L: 1, M: 103.3273, S: 0.04059 },
  49: { L: 1, M: 103.8886, S: 0.04073 },
  50: { L: 1, M: 104.4473, S: 0.04086 },
  51: { L: 1, M: 105.0041, S: 0.041 },
  52: { L: 1, M: 105.5596, S: 0.04113 },
  53: { L: 1, M: 106.1138, S: 0.04126 },
  54: { L: 1, M: 106.6668, S: 0.04139 },
  55: { L: 1, M: 107.2188, S: 0.04152 },
  56: { L: 1, M: 107.7697, S: 0.04165 },
  57: { L: 1, M: 108.3198, S: 0.04177 },
  58: { L: 1, M: 108.8689, S: 0.0419 },
  59: { L: 1, M: 109.417, S: 0.04202 },
  60: { L: 1, M: 109.9638, S: 0.04214 },
};

// Height-for-Age (HAZ) - Girls
const HAZ_GIRLS = {
  0: { L: 1, M: 49.1477, S: 0.0379 },
  1: { L: 1, M: 53.6872, S: 0.0364 },
  2: { L: 1, M: 57.0673, S: 0.03568 },
  3: { L: 1, M: 59.8029, S: 0.0352 },
  4: { L: 1, M: 62.0899, S: 0.03486 },
  5: { L: 1, M: 64.0301, S: 0.03463 },
  6: { L: 1, M: 65.7311, S: 0.03448 },
  7: { L: 1, M: 67.2873, S: 0.03441 },
  8: { L: 1, M: 68.7498, S: 0.0344 },
  9: { L: 1, M: 70.1435, S: 0.03444 },
  10: { L: 1, M: 71.4818, S: 0.03452 },
  11: { L: 1, M: 72.771, S: 0.03464 },
  12: { L: 1, M: 74.015, S: 0.03479 },
  13: { L: 1, M: 75.2176, S: 0.03496 },
  14: { L: 1, M: 76.3817, S: 0.03514 },
  15: { L: 1, M: 77.5099, S: 0.03534 },
  16: { L: 1, M: 78.6055, S: 0.03555 },
  17: { L: 1, M: 79.671, S: 0.03576 },
  18: { L: 1, M: 80.7079, S: 0.03598 },
  19: { L: 1, M: 81.7182, S: 0.0362 },
  20: { L: 1, M: 82.7036, S: 0.03643 },
  21: { L: 1, M: 83.6654, S: 0.03666 },
  22: { L: 1, M: 84.604, S: 0.03688 },
  23: { L: 1, M: 85.5202, S: 0.03711 },
  24: { L: 1, M: 85.7153, S: 0.03764 },
  25: { L: 1, M: 86.5904, S: 0.03786 },
  26: { L: 1, M: 87.4462, S: 0.03808 },
  27: { L: 1, M: 88.283, S: 0.0383 },
  28: { L: 1, M: 89.1004, S: 0.03851 },
  29: { L: 1, M: 89.8991, S: 0.03872 },
  30: { L: 1, M: 90.6797, S: 0.03893 },
  31: { L: 1, M: 91.443, S: 0.03913 },
  32: { L: 1, M: 92.1906, S: 0.03933 },
  33: { L: 1, M: 92.9239, S: 0.03952 },
  34: { L: 1, M: 93.6444, S: 0.03971 },
  35: { L: 1, M: 94.3533, S: 0.03989 },
  36: { L: 1, M: 95.0515, S: 0.04006 },
  37: { L: 1, M: 95.7399, S: 0.04024 },
  38: { L: 1, M: 96.4187, S: 0.04041 },
  39: { L: 1, M: 97.0885, S: 0.04057 },
  40: { L: 1, M: 97.7493, S: 0.04073 },
  41: { L: 1, M: 98.4015, S: 0.04089 },
  42: { L: 1, M: 99.0448, S: 0.04105 },
  43: { L: 1, M: 99.6795, S: 0.0412 },
  44: { L: 1, M: 100.3058, S: 0.04135 },
  45: { L: 1, M: 100.9238, S: 0.0415 },
  46: { L: 1, M: 101.5337, S: 0.04164 },
  47: { L: 1, M: 102.136, S: 0.04179 },
  48: { L: 1, M: 102.7312, S: 0.04193 },
  49: { L: 1, M: 103.3197, S: 0.04206 },
  50: { L: 1, M: 103.9021, S: 0.0422 },
  51: { L: 1, M: 104.4786, S: 0.04233 },
  52: { L: 1, M: 105.0494, S: 0.04246 },
  53: { L: 1, M: 105.6148, S: 0.04259 },
  54: { L: 1, M: 106.1748, S: 0.04272 },
  55: { L: 1, M: 106.7295, S: 0.04285 },
  56: { L: 1, M: 107.2788, S: 0.04298 },
  57: { L: 1, M: 107.8227, S: 0.0431 },
  58: { L: 1, M: 108.3613, S: 0.04322 },
  59: { L: 1, M: 108.8948, S: 0.04334 },
  60: { L: 1, M: 109.4233, S: 0.04347 },
};

// Weight-for-Height (WHZ) - Boys (height in cm)
const WHZ_BOYS = {
  45: { L: 0.826, M: 2.4, S: 0.09 },
  50: { L: 0.826, M: 3.4, S: 0.08 },
  55: { L: 0.826, M: 4.5, S: 0.08 },
  60: { L: 0.826, M: 5.7, S: 0.08 },
  65: { L: 0.826, M: 7.0, S: 0.08 },
  70: { L: 0.826, M: 8.3, S: 0.08 },
  75: { L: 0.826, M: 9.5, S: 0.08 },
  80: { L: 0.826, M: 10.6, S: 0.08 },
  85: { L: 0.826, M: 11.7, S: 0.08 },
  90: { L: 0.826, M: 12.9, S: 0.08 },
  95: { L: 0.826, M: 14.1, S: 0.08 },
  100: { L: 0.826, M: 15.3, S: 0.08 },
  105: { L: 0.826, M: 16.6, S: 0.08 },
  110: { L: 0.826, M: 18.0, S: 0.08 },
  115: { L: 0.826, M: 19.5, S: 0.08 },
  120: { L: 0.826, M: 21.0, S: 0.08 },
};

const WHZ_GIRLS = {
  45: { L: 0.697, M: 2.4, S: 0.09 },
  50: { L: 0.697, M: 3.4, S: 0.08 },
  55: { L: 0.697, M: 4.4, S: 0.08 },
  60: { L: 0.697, M: 5.5, S: 0.08 },
  65: { L: 0.697, M: 6.7, S: 0.08 },
  70: { L: 0.697, M: 8.0, S: 0.08 },
  75: { L: 0.697, M: 9.1, S: 0.08 },
  80: { L: 0.697, M: 10.3, S: 0.08 },
  85: { L: 0.697, M: 11.5, S: 0.08 },
  90: { L: 0.697, M: 12.6, S: 0.08 },
  95: { L: 0.697, M: 13.8, S: 0.08 },
  100: { L: 0.697, M: 15.1, S: 0.08 },
  105: { L: 0.697, M: 16.5, S: 0.08 },
  110: { L: 0.697, M: 18.0, S: 0.08 },
  115: { L: 0.697, M: 19.5, S: 0.08 },
  120: { L: 0.697, M: 21.2, S: 0.08 },
};

// =====================================================
// Z-SCORE CALCULATION FUNCTIONS
// =====================================================

function getStandard(value, gender, type) {
    let standards;
    if (type === 'WAZ') standards = gender === 'LAKI_LAKI' ? WAZ_BOYS : WAZ_GIRLS;
    else if (type === 'HAZ') standards = gender === 'LAKI_LAKI' ? HAZ_BOYS : HAZ_GIRLS;
    else standards = gender === 'LAKI_LAKI' ? WHZ_BOYS : WHZ_GIRLS;

    const keys = Object.keys(standards).map(Number).sort((a, b) => a - b);
    
    // Cap at boundaries
    if (value < keys[0]) value = keys[0];
    if (value > keys[keys.length - 1]) value = keys[keys.length - 1];

    // Find nearest key
    const nearest = keys.reduce((prev, curr) => {
        return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
    });

    return standards[nearest];
}

function calculateZScore(measurementValue, basisValue, gender, type) {
    const std = getStandard(basisValue, gender, type);
    if (!std) return 0;

    const { L, M, S } = std;
    
    // Box-Cox Formula
    const zScore = (Math.pow(measurementValue / M, L) - 1) / (L * S);
    return parseFloat(zScore.toFixed(2));
}

function getNutritionalStatus(zScore) {
    // BB/U (Weight-for-Age) - Permenkes No 2 2020
    if (zScore < -3) return 'BB Sangat Kurang';
    if (zScore < -2) return 'BB Kurang';
    if (zScore > 1) return 'Risiko BB Lebih';
    return 'Normal';
}

function getStuntingStatus(zScore) {
    // TB/U (Height-for-Age) - Permenkes No 2 2020
    if (zScore < -3) return 'Sangat Pendek';
    if (zScore < -2) return 'Pendek';
    if (zScore > 3) return 'Tinggi';
    return 'Normal';
}

function getWastingStatus(zScore) {
    // BB/TB (Weight-for-Height)
    if (zScore < -3) return 'Gizi Buruk';
    if (zScore < -2) return 'Gizi Kurang';
    if (zScore > 3) return 'Obesitas';
    if (zScore > 2) return 'Gizi Lebih';
    return 'Gizi Baik';
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

function escapeSql(str) {
    if (!str) return '';
    return str.replace(/'/g, "''");
}

function generateNik(index) {
    return '3319' + String(index + 1).padStart(12, '0');
}

function parseDate(dateStr) {
    if (!dateStr) return null;
    
    if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
    }
    
    if (dateStr.includes('-') && dateStr.length === 10) {
        return dateStr;
    }
    
    return dateStr;
}

function rwToPosyanduId(rw) {
    return `rw${rw.padStart(2, '0')}`;
}

function mapGender(gender) {
    if (!gender) return 'LAKI_LAKI';
    const g = gender.toLowerCase();
    if (g.includes('perempuan') || g.includes('female')) {
        return 'PEREMPUAN';
    }
    return 'LAKI_LAKI';
}

function calculateMeasurementDate(birthDate, monthAge) {
    const birth = new Date(birthDate);
    const measureDate = new Date(birth);
    measureDate.setMonth(measureDate.getMonth() + monthAge);
    return measureDate.toISOString().split('T')[0];
}

// =====================================================
// GENERATE SQL
// =====================================================

let sql = `-- ==========================================================
-- SI-PANDA Seed Data (Generated from data_anak.json)
-- Real data from Posyandu Kudus with Z-Score calculations
-- Generated at: ${new Date().toISOString()}
-- ==========================================================

-- Clear existing data
DELETE FROM "pengukuran";
DELETE FROM "anak";
DELETE FROM "user";
DELETE FROM "posyandu";

-- POSYANDU
INSERT INTO "posyandu" ("posyandu_id", "nama", "tanggal_dibuat", "tanggal_diubah") VALUES
`;

// Get unique RWs
const rwList = data.map(d => d.rw);
const posyanduValues = rwList.map(rw => {
    const id = rwToPosyanduId(rw);
    return `('${id}', 'Posyandu RW ${rw}', NOW(), NOW())`;
}).join(',\n');

sql += posyanduValues + ';\n\n';

// Kader names
const kaderNames = {
    '01': 'Ibu Sumarni',
    '02': 'Ibu Darmi',
    '03': 'Ibu Tumini',
    '04': 'Ibu Lastri',
    '05': 'Ibu Wati',
    '06': 'Ibu Siti'
};

// USERS
sql += `-- USERS
INSERT INTO "user" ("user_id", "nama", "email", "password", "role", "posyandu_id", "tanggal_dibuat", "tanggal_diubah") VALUES
('bidan1', 'Bidan Ratna Dewi', 'bidan@kramat.desa.id', '123', 'BIDAN', NULL, NOW(), NOW())`;

rwList.forEach((rw, i) => {
    const id = rwToPosyanduId(rw);
    const rwKey = rw.padStart(2, '0');
    const baseName = kaderNames[rwKey] || `Kader RW ${rw}`;
    
    // 1. Kader Utama (menggunakan nama yang sudah ada)
    sql += `,\n('kader${parseInt(rw)}_1', '${baseName}', 'kaderrw${rwKey}_1@kramat.desa.id', '123', 'KADER', '${id}', NOW(), NOW())`;
    
    // 2. Kader Tambahan (3 orang)
    for (let j = 2; j <= 4; j++) {
        const memberName = `Anggota Kader RW ${rw} - ${j}`;
        sql += `,\n('kader${parseInt(rw)}_${j}', '${memberName}', 'kaderrw${rwKey}_${j}@kramat.desa.id', '123', 'KADER', '${id}', NOW(), NOW())`;
    }
});

sql += ';\n\n';

// Collect all children and measurements
let allChildren = [];
let allMeasurements = [];
let childIndex = 0;

// Stats tracking
let statsNormal = 0, statsKurang = 0, statsStunting = 0;

data.forEach(rwData => {
    const rw = rwData.rw;
    const posyanduId = rwToPosyanduId(rw);
    
    rwData.data_anak.forEach(child => {
        childIndex++;
        const anakId = `a${String(childIndex).padStart(4, '0')}`;
        const nik = generateNik(childIndex);
        const birthDate = parseDate(child.tanggal_lahir);
        const gender = mapGender(child.jenis_kelamin);
        
        allChildren.push({
            anak_id: anakId,
            nik: nik,
            nama: escapeSql(child.nama_anak),
            tempat_lahir: escapeSql(child.tempat_lahir),
            tanggal_lahir: birthDate,
            jenis_kelamin: gender,
            nama_orangtua: escapeSql(child.nama_ibu),
            posyandu_id: posyanduId
        });
        
        // Add measurements with Z-score calculation
        if (child.riwayat_pertumbuhan && child.riwayat_pertumbuhan.length > 0) {
            child.riwayat_pertumbuhan.forEach((measurement, mIndex) => {
                const measureId = `m${String(childIndex).padStart(4, '0')}${String(mIndex + 1).padStart(3, '0')}`;
                const measureDate = calculateMeasurementDate(birthDate, measurement.bulan_ke);
                const usiaBulan = measurement.bulan_ke;
                const berat = measurement.berat_badan;
                const tinggi = measurement.tinggi_badan;
                
                // Calculate Z-scores
                const zBBU = calculateZScore(berat, usiaBulan, gender, 'WAZ');
                const zTBU = calculateZScore(tinggi, usiaBulan, gender, 'HAZ');
                const zBBTB = calculateZScore(berat, tinggi, gender, 'WHZ');
                
                // Get status labels
                const statusBBU = getNutritionalStatus(zBBU);
                const statusTBU = getStuntingStatus(zTBU);
                let statusBBTB = getWastingStatus(zBBTB);

                // LOGIC OVERRIDE: Sync BB/TB with BB/U and TB/U
                // If child is Underweight (BB Kurang/Sangat Kurang) AND Stunted (Pendek/Sangat Pendek)
                // AND BB/TB is calculated as "Gizi Baik" (likely due to proportional smallness)
                // THEN override to "Gizi Kurang" to reflect overall malnutrition risk.
                const isUnderweight = ['BB Kurang', 'BB Sangat Kurang'].includes(statusBBU);
                const isStunted = ['Pendek', 'Sangat Pendek', 'Sangat Pendek (Stunted)'].includes(statusTBU);
                
                if (isUnderweight && isStunted && statusBBTB === 'Gizi Baik') {
                    statusBBTB = 'Gizi Kurang';
                }
                
                allMeasurements.push({
                    pengukuran_id: measureId,
                    anak_id: anakId,
                    tanggal: measureDate,
                    berat_badan: berat,
                    tinggi_badan: tinggi,
                    usia_bulan: usiaBulan,
                    z_score_bbu: statusBBU,
                    z_score_tbu: statusTBU,
                    z_score_bbtb: statusBBTB
                });
            });
        }
    });
});

// Count last measurement stats
const lastMeasurementsByChild = {};
allMeasurements.forEach(m => {
    if (!lastMeasurementsByChild[m.anak_id] || m.usia_bulan > lastMeasurementsByChild[m.anak_id].usia_bulan) {
        lastMeasurementsByChild[m.anak_id] = m;
    }
});

Object.values(lastMeasurementsByChild).forEach(m => {
    if (m.z_score_bbu === 'Normal' && m.z_score_tbu === 'Normal') statsNormal++;
    if (m.z_score_bbu.includes('Kurang')) statsKurang++;
    if (m.z_score_tbu === 'Pendek' || m.z_score_tbu === 'Sangat Pendek') statsStunting++;
});

// ANAK DATA
sql += `-- ANAK DATA (${allChildren.length} children)
INSERT INTO "anak" ("anak_id", "nik", "nama", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "nama_orangtua", "posyandu_id", "tanggal_dibuat", "tanggal_diubah") VALUES\n`;

const childValues = allChildren.map(c => 
    `('${c.anak_id}', '${c.nik}', '${c.nama}', '${c.tempat_lahir}', '${c.tanggal_lahir}', '${c.jenis_kelamin}', '${c.nama_orangtua}', '${c.posyandu_id}', NOW(), NOW())`
).join(',\n');

sql += childValues + ';\n\n';

// PENGUKURAN DATA with Z-scores
sql += `-- PENGUKURAN DATA (${allMeasurements.length} measurements)
INSERT INTO "pengukuran" ("pengukuran_id", "anak_id", "tanggal", "berat_badan", "tinggi_badan", "usia_bulan", "z_score_bbu", "z_score_tbu", "z_score_bbtb", "tanggal_dibuat", "tanggal_diubah") VALUES\n`;

const measureValues = allMeasurements.map(m => {
    return `('${m.pengukuran_id}', '${m.anak_id}', '${m.tanggal}', ${m.berat_badan}, ${m.tinggi_badan}, ${m.usia_bulan}, '${m.z_score_bbu}', '${m.z_score_tbu}', '${m.z_score_bbtb}', NOW(), NOW())`;
}).join(',\n');

sql += measureValues + ';\n';

// Write to file
fs.writeFileSync(outputPath, sql, 'utf-8');

console.log(`✅ Generated SQL seed file: ${outputPath}`);
console.log(`   - ${allChildren.length} children`);
console.log(`   - ${allMeasurements.length} measurements (with Z-scores)`);
console.log(`   - ${rwList.length} posyandu`);
console.log(`   - ${rwList.length + 1} users (1 bidan + ${rwList.length} kader)`);
console.log(`\n📊 Stats Preview (based on latest measurements):`);
console.log(`   - Normal: ${statsNormal}`);
console.log(`   - Kurang Gizi: ${statsKurang}`);
console.log(`   - Stunting: ${statsStunting}`);
