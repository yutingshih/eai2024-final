'use client';
// Chakra imports
import { Flex, useColorModeValue } from '@chakra-ui/react';

import { HSeparator } from '@/components/separator/Separator';

export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue('navy.700', 'white');
// height="26px" width="146px"
  return (
    <Flex alignItems="center" flexDirection="column">
      <Logo />
      <HSeparator mb="20px" w="284px" />
    </Flex>
  );
}

function Logo() {
  return <><svg version="1.0" style={{ height: "64px" }}
  xmlns="http://www.w3.org/2000/svg"
  width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000"
  preserveAspectRatio="xMidYMid meet">
 
 <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
 fill="#000000" stroke="none">
 <path d="M2215 5069 c-60 -5 -146 -12 -190 -14 -87 -4 -274 -42 -392 -80 -40
 -12 -82 -21 -92 -18 -18 5 -160 -70 -379 -200 -126 -75 -357 -305 -454 -452
 -150 -226 -227 -446 -253 -718 l-7 -68 -62 -28 c-81 -36 -138 -89 -164 -149
 -17 -40 -22 -86 -32 -317 -19 -423 7 -571 117 -677 63 -61 121 -81 248 -86 93
 -3 130 0 235 23 69 15 136 29 150 32 22 4 28 -2 56 -59 70 -142 217 -289 376
 -376 161 -88 327 -130 546 -139 l152 -6 0 -171 0 -172 -85 -12 c-107 -16 -200
 -44 -291 -88 l-72 -35 -48 37 c-160 122 -355 136 -553 38 -285 -141 -398 -451
 -250 -690 18 -30 19 -39 10 -90 -16 -82 -14 -242 3 -298 30 -99 106 -171 216
 -203 50 -15 198 -16 1600 -14 l1545 1 45 23 c102 51 140 164 140 410 l0 154
 34 65 c97 186 61 385 -98 544 -126 126 -300 189 -460 166 -89 -13 -184 -53
 -238 -101 -20 -17 -40 -31 -45 -31 -5 0 -38 15 -73 34 -87 46 -195 75 -307 83
 l-93 6 0 174 0 173 94 0 c51 0 121 3 155 6 57 6 61 6 61 -14 0 -29 54 -89 101
 -113 68 -34 166 -51 266 -46 78 3 103 9 157 36 53 26 68 39 85 74 12 24 21 49
 21 56 0 10 20 11 88 6 211 -16 349 47 404 184 19 48 22 75 23 199 l0 142 73 0
 c62 0 84 5 145 33 92 43 140 85 171 150 23 49 25 67 32 302 12 351 10 470 -10
 541 -31 109 -107 192 -199 219 l-42 12 -7 69 c-43 405 -173 689 -438 955 -190
 192 -372 310 -622 404 -109 40 -290 85 -368 91 -30 2 -98 9 -150 14 -133 14
 -742 20 -875 9z m-145 -83 c0 -21 -35 -44 -272 -181 -150 -87 -276 -160 -280
 -162 -5 -2 -8 -2 -8 1 0 2 110 81 244 175 135 94 248 176 251 181 3 6 19 10
 36 10 24 0 29 -4 29 -24z m1087 6 c8 -5 -9 -19 -47 -41 l-60 -32 0 40 0 41 48
 0 c26 0 52 -4 59 -8z m-798 -6 c-2 -2 -14 -9 -26 -15 -19 -10 -23 -9 -23 4 0
 10 9 15 27 15 14 0 24 -2 22 -4z m271 0 c0 -3 -178 -106 -215 -124 -5 -3 19
 25 55 62 62 63 66 66 112 66 26 0 48 -2 48 -4z m210 -1 c0 -2 -13 -11 -30 -20
 -16 -9 -30 -23 -30 -33 0 -11 -23 -29 -63 -50 l-62 -34 75 71 c41 38 83 70 93
 71 9 0 17 -2 17 -5z m-1031 -9 c-7 -8 -510 -296 -516 -296 -3 0 58 50 136 111
 78 60 141 114 141 118 0 4 42 20 93 35 50 15 97 29 102 31 15 5 49 6 44 1z
 m1580 -31 c2 -3 2 -6 0 -8 -12 -10 -169 -97 -174 -97 -4 0 15 27 42 61 47 60
 48 61 87 54 22 -3 42 -8 45 -10z m166 -57 c25 -11 25 -12 -41 -50 -37 -21 -68
 -37 -70 -36 -5 5 68 98 76 98 5 0 21 -5 35 -12z m-444 -45 c-6 -10 -21 -31
 -35 -48 l-25 -30 -1 31 c0 24 6 33 33 47 17 8 33 16 35 16 1 1 -2 -7 -7 -16z
 m229 -38 c0 -2 -14 -25 -32 -50 -31 -43 -33 -44 -72 -38 -23 3 -42 7 -44 8 -4
 3 130 83 141 84 4 1 7 -1 7 -4z m-1270 -49 l0 -43 -62 -7 c-35 -4 -76 -10 -93
 -13 -22 -3 -5 11 60 50 50 30 91 56 93 56 1 1 2 -19 2 -43z m642 7 c-17 -21
 -48 -55 -70 -76 -37 -36 -42 -38 -98 -35 l-59 3 125 72 c69 40 127 73 128 73
 2 0 -10 -17 -26 -37z m-317 -39 c-88 -82 -93 -85 -129 -70 -28 11 -28 12 80
 74 60 34 111 62 114 62 3 -1 -26 -30 -65 -66z m474 -48 c-13 -28 -41 -40 -80
 -34 -21 3 -17 8 31 35 30 18 56 31 57 29 2 -2 -2 -15 -8 -30z m1048 9 c1 -5
 -15 -20 -37 -32 -46 -25 -48 -23 -18 18 21 28 48 35 55 14z m-1832 -37 c6 -12
 24 -30 41 -40 80 -47 350 -68 601 -48 165 13 252 34 293 72 20 19 23 19 133 3
 517 -75 940 -463 1032 -948 23 -119 20 -171 -8 -190 -23 -15 -24 -14 -56 45
 -147 266 -442 459 -756 493 -60 7 -61 8 -88 56 -72 130 -214 165 -552 135
 -138 -12 -237 -14 -422 -9 -213 5 -250 4 -307 -11 -73 -20 -141 -71 -162 -121
 -12 -30 -17 -32 -76 -39 -292 -30 -593 -227 -745 -487 l-38 -65 -27 16 c-25
 14 -28 20 -28 71 0 214 122 504 284 678 53 57 441 321 471 321 8 0 37 11 64
 24 57 29 202 60 301 65 28 1 37 -4 45 -21z m1629 -48 c-29 -44 -32 -46 -58
 -27 -16 12 -13 15 31 40 26 14 49 27 51 27 1 0 -10 -18 -24 -40z m301 0 c-3
 -5 -11 -10 -16 -10 -6 0 -7 5 -4 10 3 6 11 10 16 10 6 0 7 -4 4 -10z m-205
 -95 c-7 -8 -17 -12 -22 -9 -6 4 -5 10 3 15 22 14 33 10 19 -6z m305 6 c3 -6
 -3 -15 -14 -20 -28 -16 -33 -14 -21 9 12 22 25 26 35 11z m-2996 -36 c-13 -13
 -344 -242 -347 -240 -2 2 6 17 17 35 14 24 61 57 173 122 139 80 170 97 157
 83z m2809 -45 c-25 -35 -22 -34 -37 -16 -10 12 -7 18 16 30 41 22 46 19 21
 -14z m362 -131 c0 -10 -62 -51 -68 -45 -2 2 7 20 20 39 17 27 26 33 35 25 7
 -6 13 -14 13 -19z m-167 -40 c-26 -45 -37 -51 -51 -28 -11 17 -8 22 20 39 45
 27 52 25 31 -11z m-3108 -8 c-28 -25 -345 -230 -345 -222 0 23 47 58 190 141
 151 87 174 99 155 81z m3350 -70 c3 -6 -3 -15 -14 -20 -29 -16 -33 -14 -19 9
 14 22 24 25 33 11z m-1755 -42 c117 -11 183 -9 356 7 97 9 156 -16 184 -78 37
 -82 20 -203 -48 -332 -48 -92 -104 -147 -178 -177 -58 -23 -65 -23 -369 -21
 l-309 2 -52 25 c-105 51 -204 196 -239 350 -18 75 -15 123 9 160 19 28 91 64
 153 75 58 11 321 5 493 -11z m1577 -26 c-9 -9 -20 -13 -24 -9 -4 4 1 14 11 22
 25 18 35 8 13 -13z m-751 -163 c362 -92 620 -418 691 -875 30 -198 1 -483 -67
 -655 -61 -153 -146 -286 -239 -373 l-50 -47 -99 0 c-149 0 -247 -40 -288 -116
 -13 -24 -28 -36 -49 -39 -52 -9 -1284 -12 -1410 -3 -304 21 -528 114 -682 282
 -107 117 -205 343 -238 551 -19 115 -21 337 -5 440 61 390 274 685 573 793 71
 26 235 60 241 50 1 -2 9 -34 19 -73 23 -94 73 -196 134 -275 l50 -65 -111 0
 c-95 0 -123 -4 -200 -29 -174 -57 -310 -172 -399 -336 -58 -106 -81 -198 -81
 -320 1 -174 54 -292 189 -418 56 -52 89 -74 145 -96 191 -75 400 -100 760 -91
 140 4 424 9 631 11 334 3 384 6 455 24 192 48 336 161 412 320 51 108 64 167
 65 288 0 315 -204 575 -503 638 -50 10 -111 15 -186 12 l-110 -3 53 65 c66 79
 138 220 155 300 14 71 18 72 144 40z m1034 -6 c0 -9 -32 -33 -44 -34 -5 0 -1
 9 9 20 18 20 35 26 35 14z m-3776 -25 c-10 -12 -31 -30 -46 -41 -22 -15 -28
 -16 -28 -5 0 8 19 27 43 41 52 31 55 32 31 5z m3599 -35 c-11 -17 -19 -22 -21
 -14 -3 7 3 19 14 27 26 19 27 17 7 -13z m-3683 -278 c0 -2 -8 -10 -17 -17 -16
 -13 -17 -12 -4 4 13 16 21 21 21 13z m1693 -132 c5 -6 -66 -52 -145 -95 -36
 -20 -16 1 39 40 43 30 53 41 38 42 -11 1 -4 5 15 9 19 4 38 8 41 9 3 0 9 -2
 12 -5z m-218 -17 c-40 -27 -120 -69 -110 -59 26 29 92 71 110 72 19 0 19 0 0
 -13z m505 -1 c-11 -9 -439 -259 -572 -333 -5 -2 -8 -2 -8 0 0 3 57 47 128 98
 302 221 314 231 301 240 -9 5 22 9 76 9 76 0 87 -2 75 -14z m243 -3 c4 -4 -23
 -24 -60 -46 -304 -176 -446 -257 -437 -247 6 6 105 76 220 155 156 108 217
 144 240 145 17 0 34 -3 37 -7z m402 -2 c-15 -13 -327 -192 -330 -189 -7 7 301
 198 319 198 12 0 16 -4 11 -9z m-1375 -5 c0 -2 -39 -26 -87 -54 -190 -108
 -176 -103 -111 -37 56 57 75 67 196 94 1 1 2 -1 2 -3z m1550 -21 c0 -3 -326
 -193 -365 -213 -34 -18 22 21 169 117 93 60 175 107 182 104 8 -3 14 -6 14 -8z
 m1330 -35 c0 -9 -80 -60 -95 -60 -5 0 9 16 31 35 39 34 64 44 64 25z m-4146
 -37 c-10 -16 -30 -37 -46 -46 -26 -15 -25 -12 13 33 46 55 59 60 33 13z m2936
 12 c7 -9 11 -17 9 -19 -4 -5 -400 -233 -494 -285 -33 -19 -55 -29 -50 -24 14
 15 509 343 516 343 4 0 12 -7 19 -15z m737 -72 c-9 -9 -20 -13 -24 -9 -4 4 1
 14 11 22 25 18 35 8 13 -13z m-3902 -33 c-36 -36 -60 -45 -49 -17 4 10 70 55
 84 57 2 0 -13 -18 -35 -40z m4423 15 c-17 -17 -108 -68 -108 -62 0 12 103 86
 112 81 6 -4 5 -11 -4 -19z m-1136 -47 c-4 -3 -63 -39 -132 -78 -110 -63 -127
 -70 -148 -60 -14 6 -23 12 -21 14 2 2 62 45 134 95 l130 91 22 -28 c12 -15 18
 -30 15 -34z m-2762 -12 c0 -33 -4 -36 -117 -101 -146 -83 -141 -81 -123 -62
 28 30 225 196 233 197 4 0 7 -15 7 -34z m3385 -76 c-10 -11 -23 -20 -29 -20
 -6 1 0 10 13 20 30 26 39 26 16 0z m521 -35 c-3 -10 -150 -102 -211 -133 -19
 -9 21 28 115 107 81 69 95 77 98 60 2 -11 1 -26 -2 -34z m-1096 40 c0 -2 -10
 -10 -22 -16 -21 -11 -22 -11 -9 4 13 16 31 23 31 12z m-3343 -55 c-27 -22 -37
 -25 -37 -12 0 5 10 14 23 20 35 17 42 14 14 -8z m168 -36 c-22 -20 -79 -69
 -127 -111 l-88 -74 0 39 0 39 123 72 c67 39 124 70 127 70 3 0 -13 -16 -35
 -35z m363 -31 c-3 -40 -24 -56 -193 -148 l-70 -38 50 45 c143 128 201 177 208
 177 5 1 7 -16 5 -36z m2852 32 c0 -2 -15 -12 -32 -20 l-33 -16 25 20 c24 20
 40 26 40 16z m555 -40 c-41 -35 -55 -42 -55 -26 0 9 78 61 90 61 3 0 -13 -16
 -35 -35z m-2405 2 c0 -7 -7 -23 -16 -36 l-16 -23 41 21 41 21 20 -32 c57 -94
 -6 -222 -93 -189 l-27 10 21 36 c24 40 19 43 -26 15 -28 -17 -34 -18 -45 -5
 -18 22 -24 91 -10 125 7 17 24 40 38 50 28 22 72 27 72 7z m1384 4 c3 -5 -6
 -16 -20 -26 -34 -22 -24 -31 15 -11 39 21 38 21 61 -16 12 -21 20 -51 20 -80
 0 -88 -73 -137 -145 -98 -14 7 -25 17 -25 22 0 4 -9 17 -20 28 -38 38 -20 138
 32 174 24 17 73 21 82 7z m-1590 -23 c-5 -13 -300 -233 -312 -233 -4 0 -8 14
 -10 30 -3 29 3 33 155 122 87 50 161 92 165 92 4 1 5 -5 2 -11z m2776 -12 c0
 -9 -201 -176 -211 -176 -6 0 -9 12 -7 27 2 23 20 37 108 90 112 66 110 65 110
 59z m340 -38 c0 -31 -6 -36 -101 -91 -56 -32 -102 -57 -104 -55 -3 3 195 176
 203 177 1 1 2 -14 2 -31z m-3420 -3 c-7 -8 -18 -15 -24 -15 -6 0 -2 7 8 15 25
 19 32 19 16 0z m2380 -19 c0 -21 -21 -37 -139 -105 -77 -45 -143 -81 -146 -81
 -4 0 57 47 135 105 78 58 144 105 146 105 2 0 4 -11 4 -24z m-3200 -30 c0 -4
 -195 -176 -232 -205 -16 -12 -18 -10 -18 26 l0 39 123 71 c136 80 127 74 127
 69z m317 -48 c-2 -8 -29 -26 -58 -42 -62 -33 -62 -32 6 22 50 40 62 45 52 20z
 m793 -36 c0 -5 -54 -46 -120 -91 -101 -69 -123 -81 -136 -70 -20 16 -17 18
 122 99 121 70 134 76 134 62z m1105 -11 c-6 -5 -163 -115 -349 -246 l-340
 -237 -64 7 c-35 4 -60 10 -56 15 10 9 807 470 814 470 2 0 0 -4 -5 -9z m2035
 0 c0 -10 -70 -54 -76 -48 -4 3 66 57 73 57 2 0 3 -4 3 -9z m-360 -5 c0 -3 -46
 -44 -102 -92 -101 -85 -103 -86 -106 -59 -4 35 -3 36 110 101 99 57 98 56 98
 50z m-3570 -86 c0 -9 -73 -60 -86 -60 -10 0 69 69 79 70 4 0 7 -4 7 -10z
 m1475 1 c-6 -5 -126 -86 -268 -180 -232 -154 -262 -172 -289 -166 -18 4 -26
 11 -21 16 10 10 575 338 583 339 2 0 0 -4 -5 -9z m2434 -111 c-12 -8 -45 -28
 -73 -44 l-51 -28 70 71 c68 70 70 71 73 44 3 -20 -2 -32 -19 -43z m-2994 41
 c-20 -19 -227 -151 -237 -151 -27 0 8 26 117 90 120 69 137 78 120 61z m-1355
 -14 c0 -9 -102 -79 -107 -73 -9 8 8 24 54 52 36 21 53 28 53 21z m1535 -6 c-6
 -5 -77 -52 -159 -105 -95 -62 -154 -95 -165 -91 -11 4 8 20 64 52 44 25 121
 70 170 99 89 53 108 62 90 45z m1180 -10 c-23 -20 -325 -240 -344 -251 -12 -6
 -43 -10 -69 -8 l-46 3 229 132 c221 127 250 143 230 124z m1380 -89 c-200
 -190 -203 -193 -232 -186 -33 8 -55 23 -51 35 3 10 288 177 303 178 5 1 -4
 -12 -20 -27z m-230 8 c-11 -17 -65 -51 -65 -41 0 6 15 20 33 31 36 23 41 24
 32 10z m-3811 -18 c-12 -9 -40 -32 -62 -50 -26 -21 -43 -29 -47 -22 -9 14 -5
 18 58 57 56 34 85 43 51 15z m2805 -102 c-53 -43 -82 -60 -103 -60 -18 0 -26
 4 -20 9 14 14 178 110 188 111 5 0 -24 -27 -65 -60z m1351 -19 c-22 -28 -49
 -52 -58 -55 -36 -10 -117 -18 -110 -10 12 11 192 114 201 114 5 0 -10 -22 -33
 -49z m-2020 35 c0 -9 -142 -96 -157 -96 -10 0 20 22 67 49 91 53 90 53 90 47z
 m-210 -10 c0 -2 -27 -21 -60 -42 -33 -22 -60 -42 -60 -46 0 -5 -12 -8 -27 -8
 -23 0 -12 9 57 49 92 54 90 53 90 47z m-1916 -41 c-10 -8 -23 -14 -29 -14 -5
 0 -1 6 9 14 11 8 24 15 30 15 5 0 1 -7 -10 -15z m164 -31 c-16 -17 -34 -25
 -49 -22 -22 3 -20 6 21 30 53 31 64 28 28 -8z m209 -1 c4 -10 -66 -27 -75 -18
 -6 5 51 35 62 31 6 -1 11 -7 13 -13z m3411 -73 l87 -5 0 -170 c0 -261 -3 -265
 -233 -265 l-149 0 -7 51 c-7 54 -48 109 -80 109 -25 0 -19 16 18 44 43 33 149
 163 188 232 l30 53 29 -22 c24 -17 49 -23 117 -27z m-649 -344 c-2 -2 -15 -9
 -29 -16 -23 -12 -24 -12 -11 3 7 10 20 17 29 17 8 0 13 -2 11 -4z m231 -120
 c0 -8 -7 -16 -15 -20 -12 -4 -13 -2 -2 14 14 24 17 25 17 6z m-167 -59 c-71
 -90 -85 -98 -137 -78 -15 6 -4 16 60 53 91 53 102 57 77 25z m-782 -24 c1 -30
 1 -235 0 -285 l-1 -48 -360 0 c-198 0 -360 3 -360 8 -2 42 -2 185 -1 255 l1
 87 360 0 c336 0 360 -1 361 -17z m933 -48 c-4 -8 -16 -15 -28 -15 -21 1 -21 1
 -2 15 25 19 37 19 30 0z m-687 -355 c207 -54 371 -185 459 -368 55 -115 62
 -167 66 -457 l3 -260 -25 -50 -25 -50 -1064 -3 c-1196 -2 -1096 -9 -1133 75
 -36 81 -46 525 -15 643 67 253 260 405 590 465 154 28 281 34 679 29 344 -4
 395 -7 465 -24z m-1807 -19 c30 -11 81 -42 114 -67 l58 -46 -39 -42 c-126
 -132 -183 -292 -191 -540 l-5 -149 -75 6 c-229 17 -398 239 -380 500 12 172
 111 300 273 354 56 18 177 11 245 -16z m2591 9 c29 -6 73 -20 97 -31 64 -32
 154 -120 190 -186 133 -251 -36 -599 -302 -620 -117 -10 -112 -16 -119 154 -3
 82 -13 182 -22 223 -21 97 -80 219 -144 297 l-50 62 32 25 c101 75 199 98 318
 76z m257 -948 c-4 -145 -18 -184 -78 -215 -30 -16 -57 -18 -200 -15 l-166 3
 25 44 c19 34 26 64 29 127 l4 81 87 6 c90 5 198 38 250 77 51 38 54 32 49
 -108z m-3139 54 c32 -9 91 -16 142 -16 l86 0 5 -102 c3 -70 10 -114 22 -135
 l17 -33 -156 0 c-170 0 -211 9 -240 54 -28 42 -36 96 -29 198 l7 97 46 -23
 c25 -13 70 -31 100 -40z"/>
 </g>
 </svg>
 </>
}

export default SidebarBrand;
