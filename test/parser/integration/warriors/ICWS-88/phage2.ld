;redcode-88
;name Nameless
;author Blameless
ORG	0
MOV.I	<7,	<11
DJN.B	$-1,	$11
MOV.AB	#7,	$261
MOV.AB	#259,	$264
MOV.AB	#14,	$264
SPL.B	$251,	$0
JMP.B	$2,	$0
DAT.F	#0,	#7
SPL.B	@5,	$0
ADD.AB	#8,	$4
JMP.B	$-2,	$0
DAT.F	#0,	#259
DAT.F	#0,	#14
DAT.F	#0,	#2
