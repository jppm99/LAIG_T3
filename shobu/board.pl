initialBoard([
	[
		[white,white,white,white],
		[empty,empty,empty,empty],
		[empty,empty,empty,empty],
		[black,black,black,black]
	],
	[
		[white,white,white,white],
		[empty,empty,empty,empty],
		[empty,empty,empty,empty],
		[black,black,black,black]
	],
	[
		[white,white,white,white],
		[empty,empty,empty,empty],
		[empty,empty,empty,empty],
		[black,black,black,black]
	],
	[
		[white,white,white,white],
		[empty,empty,empty,empty],
		[empty,empty,empty,empty],
		[black,black,black,black]
	]
]).

/*  black     white
|W|W|W|W| |W|W|W|W|
|.|.|.|.| |.|.|.|.|
|.|.|.|.| |.|.|.|.|
|B|B|B|B| |B|B|B|B|
-------------------
|W|W|W|W| |W|W|W|W|
|.|.|.|.| |.|.|.|.|
|.|.|.|.| |.|.|.|.|
|B|B|B|B| |B|B|B|B|
  black     white
*/

midBoard([
	[
		[empty,empty,empty,black],
		[empty,white,empty,empty],
		[empty,empty,empty,empty],
		[empty,empty,empty,empty]
	],
	[
		[empty,black,empty,black],
		[black,empty,empty,empty],
		[empty,white,empty,empty],
		[black,black,black,empty]
	],
	[
		[empty,empty,empty,black],
		[empty,empty,empty,empty],
		[empty,empty,empty,empty],
		[empty,white,empty,empty]
	],
	[
		[empty,empty,empty,empty],
		[black,white,empty,empty],
		[empty,empty,empty,empty],
		[empty,empty,black,empty]
	]
]).

/*  black     white
|B|W|.|.| |.|.|.|W|
|.|.|.|.| |B|.|.|.|
|.|.|.|.| |.|W|.|.|
|B|.|.|B| |.|.|.|W|
-------------------
|W|.|.|.| |W|.|.|B|
|.|.|.|W| |.|.|.|B|
|.|W|B|.| |.|.|.|.|
|.|B|.|.| |.|.|.|.|
  black     white
*/

finalBoard([
	[
		[black,empty,empty,white],
		[empty,empty,black,empty],
		[empty,empty,empty,empty],
		[black,empty,empty,empty]
	],
	[
		[black,empty,empty,empty],
		[empty,empty,empty,empty],
		[empty,empty,empty,empty],
		[empty,white,white,empty]
	],
	[
		[white,empty,empty,empty],
		[empty,white,empty,empty],
		[empty,empty,empty,empty],
		[white,empty,empty,empty]
	],
	[
		[empty,empty,empty,black],
		[empty,black,empty,empty],
		[white,empty,empty,empty],
		[empty,empty,empty,empty]
	]
]).

/*  black     white
|B|.|.|W| |B|.|.|.|
|.|.|B|.| |.|.|.|.|
|.|.|.|.| |.|.|.|.|
|B|.|.|.| |.|W|W|.|
-------------------
|W|.|.|.| |.|.|.|B|
|.|W|.|.| |.|B|.|.|
|.|.|.|.| |W|.|.|.|
|W|.|.|.| |.|.|.|.|
  black     white
*/
