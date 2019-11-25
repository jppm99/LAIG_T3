menu:-
    printMenu,
    write('> Insert your option: '),
    read(Input),
    menuInput(Input).

menuInput(1):-
    !,
    startGame(player,player),
    menu.

menuInput(2):-
    !,
    write('> Select Bot difficulty [1-3]: '),
    read(Input),
    botInput(Input, P),
    startGame(player,P),
    menu.

menuInput(3):-
    !,
    write('> Select Bot 1 difficulty [1-3]: '),
    read(Input1),
    botInput(Input1, P1),

    write('> Select Bot 2 difficulty [1-3]: '),
    read(Input2),
    botInput(Input2, P2),

    startGame(P1,P2),
    menu.

menuInput(0):-
    !,
    write('\nExiting...\n\n').

menuInput(_Other):-
    write('\nChoose a valid option!\n\n'),
    write('> Insert your option: '),
    read(Input),
    menuInput(Input).

botInput(1, Bot):-
    !,
    Bot = computer1.

botInput(2, Bot):-
    !,
    Bot = computer2.

botInput(3, Bot):-
    !,
    Bot = computer3.

botInput(_Other, Bot):-
    write('\nChoose a valid option!\n\n'),
    write('> Select Bot difficulty (1/2): '),
    read(Input),
    botInput(Input, Bot).


printMenu:-
    write('\n\n ______________________________________________________________________ \n'),
    write('|                                                                      |\n'),
    write('|                                                                      |\n'),
    write('|                      __ _           _                                |\n'),
    write('|                     / _\\ |__   ___ | |__  _   _                      |\n'),
    write('|                     \\ \\| \'_ \\ / _ \\| \'_ \\| | | |                     |\n'),
    write('|                     _\\ \\ | | | (_) | |_) | |_| |                     |\n'),
    write('|                     \\__/_| |_|\\___/|_.__/ \\__,_|                     |\n'),
    write('|                                                                      |\n'),
    write('|                                                                      |\n'),
    write('|                                                                      |\n'),
    write('|               ----------------------------------------               |\n'),
    write('|                                                                      |\n'),
    write('|                                                                      |\n'),
    write('|                        1. Player vs Player                           |\n'),
    write('|                                                                      |\n'),
    write('|                        2. Player vs Computer                         |\n'),
    write('|                                                                      |\n'),
	write('|                        3. Computer vs Computer                       |\n'),
    write('|                                                                      |\n'),
    write('|                        0. Exit                                       |\n'),
    write('|                                                                      |\n'),
    write('|                                                                      |\n'),
    write('|______________________________________________________________________|\n\n\n').
