/*
const FRAMEDRUM_EXERCISES_IDS = {
	PREFIX: "Warmup exercise #"
}

const FRAMEDRUM_WARMUPS = {

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "1"] :
`RRRR LLLL : 3
RR LL RR LL`,

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "2"] :
`RRRR LLLL : 3
RR LL (RRRR LLLL)/2`,

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "3"] :
`RRRR LLLL (RRRR LLLL)/2 RR LL`,

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "4"] :
`RRRR LLLL (RRRR)/2 LL (RRRR LLLL)/2`,

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "5"] :
`(RRRR LLLL)/2 RR (LLLL)/2
(RRRR LLLL)/2 (RRRR)/2 LL`,

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "6"] :
`(RRRR)/2 L R (LLLL)/2 R L`,

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "7"] :
`(RRRR)/2 (LLLL)/2 (RRRR)/2 LR
(LLLL)/2 (RRRR)/2 (LLLL)/2 R L`,

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "8"] :
`D L L L (DLLL TLLL)/2`,

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "9"] :
`D L L L (DLLL DLLL)/2 R R L L (RR LL RR LL)/2`,

[FRAMEDRUM_EXERCISES_IDS.PREFIX + "10"] :
`D L L L (DLLL DLLL)/2 T L L L (RR LL T LLL)/2`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "11"] :
`D L L L (DLLL TLLL)/2
(DLLL RRR LLLL RRRR L)/2`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "12"] :
`D L L L (DLLL TLLL)/2
(RRRR LLLL)/2 
(RRRR LLLL)/4
(RLLL)/2`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "13"] :
`D L (RRRR LLLL)/4 
R L (RRRR LLLL)/4
D L (RRRR LLLL)/4
(RRRR LLLL)/2`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "14"] :
`D L L L (DLLL TLLL)/2
(DL–LRL–L RRRR LLLL)/2`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "15"] :
`D L L L (DLLL TLLL)/2
(DL–LRL–L)/2 (RRRR LLLL)/4 (RL–L)/2`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "16"] :
`(DLLL)/2 (RRRR LLLL)/4
(TLLL)/2 (RRRR LLLL)/4
(DLLL)/2 (RRRR LLLL)/4
(RRLL)/4 (DLLL)/2 (TLLL)/4 `,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "17"] :
`(DLL)/2 (DLLL RRR LLL)/4`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "18"] :
`(DLL)/2 (DLLL RRRR LL)/4`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "19"] :
`(DLL)/2 (DLL RRR LLLL)/4`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "20"] :
`(DLL)/2 (DLLL RRR LLL)/4
(DLL)/2 (DLLL RRRR LL)/4
(DLL)/2 (DLLL RRR LLL)/4
(DLL)/2 (DLL RRR LLLL)/4`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "21"] :
`D L L (DLLL RRR LLL)/2
D L L (DLLL RRR LLL)/4 (DLLL RRR LLL)/4`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "22"] :
`(DLLLRRRR)/2 L L L L 
(TLLLRRRR)/2 L L L L
(DLLLRRRR)/2 L L L L
(RRRRLLLL)/2 T L L L `,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "23"] :
`(DLLLRRRR)/2 L L L L 
(TLLL TLLL RRRR LLLL)/2
(DLLLRRRR)/2 L L L L 
(TLLL RRLL RRRR LLLL)/2`,
[FRAMEDRUM_EXERCISES_IDS.PREFIX + "24"] :
`(D2 T K)/2 (R R R R L L L L)/4
(T K)/2 (R R R R L L L L)/4 (D K)/2`

}
*/

/*

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "1", text: 
`RRRR LLLL : 3
RR LL RR LL`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "2", text: 
`RRRR LLLL : 3
RR LL (RRRR LLLL)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "3", text: 
`RRRR LLLL (RRRR LLLL)/2 RR LL`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "4", text: 
`RRRR LLLL (RRRR)/2 LL (RRRR LLLL)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "5", text: 
`(RRRR LLLL)/2 RR (LLLL)/2
(RRRR LLLL)/2 (RRRR)/2 LL`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "6", text: 
`(RRRR)/2 L R (LLLL)/2 R L`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "7", text: 
`(RRRR)/2 (LLLL)/2 (RRRR)/2 LR
(LLLL)/2 (RRRR)/2 (LLLL)/2 R L`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "8", text: 
`D L L L (DLLL TLLL)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "9", text: 
`D L L L (DLLL DLLL)/2 R R L L (RR LL RR LL)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "10", text: 
`D L L L (DLLL DLLL)/2 T L L L (RR LL T LLL)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "11", text: 
`D L L L (DLLL TLLL)/2
(DLLL RRR LLLL RRRR L)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "12", text: 
`D L L L (DLLL TLLL)/2
(RRRR LLLL)/2 
(RRRR LLLL)/4
(RLLL)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "13", text: 
`D L (RRRR LLLL)/4 
R L (RRRR LLLL)/4
D L (RRRR LLLL)/4
(RRRR LLLL)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "14", text: 
`D L L L (DLLL TLLL)/2
(DL–LRL–L RRRR LLLL)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "15", text: 
`D L L L (DLLL TLLL)/2
(DL–LRL–L)/2 (RRRR LLLL)/4 (RL–L)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "16", text: 
`(DLLL)/2 (RRRR LLLL)/4
(TLLL)/2 (RRRR LLLL)/4
(DLLL)/2 (RRRR LLLL)/4
(RRLL)/4 (DLLL)/2 (TLLL)/4 `,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "17", text: 
`(DLL)/2 (DLLL RRR LLL)/4`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "18", text: 
`(DLL)/2 (DLLL RRRR LL)/4`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "19", text: 
`(DLL)/2 (DLL RRR LLLL)/4`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "20", text: 
`(DLL)/2 (DLLL RRR LLL)/4
(DLL)/2 (DLLL RRRR LL)/4
(DLL)/2 (DLLL RRR LLL)/4
(DLL)/2 (DLL RRR LLLL)/4`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "21", text: 
`D L L (DLLL RRR LLL)/2
D L L (DLLL RRR LLL)/4 (DLLL RRR LLL)/4`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "22", text: 
`(DLLLRRRR)/2 L L L L 
(TLLLRRRR)/2 L L L L
(DLLLRRRR)/2 L L L L
(RRRRLLLL)/2 T L L L `,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "23", text: 
`(DLLLRRRR)/2 L L L L 
(TLLL TLLL RRRR LLLL)/2
(DLLLRRRR)/2 L L L L 
(TLLL RRLL RRRR LLLL)/2`,

name: FRAMEDRUM_EXERCISES_IDS.PREFIX + "24", text: 
`(D2 T K)/2 (R R R R L L L L)/4
(T K)/2 (R R R R L L L L)/4 (D K)/2`


*/


