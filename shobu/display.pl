:- consult('board.pl').

symbol(empty,'.').
symbol(black,'B').
symbol(white,'W').

display_game(Board,Player):-
    nl,
    (Player==black ->
        Board = [TopLeft,TopRight,BottomLeft,BottomRight],
        write('   |     black     |   |     white     |\n'),
        write('   |---------------|   |---------------|\n'),
        write('   | 1 | 2 | 3 | 4 |   | 5 | 6 | 7 | 8 |\n'),
        N1=1,
        N2=5;
    Player==white ->
        invertBoard(Board,ReverseBoard),
        ReverseBoard = [TopLeft,TopRight,BottomLeft,BottomRight],
        write('   |     white     |   |     black     |\n'),
        write('   |---------------|   |---------------|\n'),
        write('   | 8 | 7 | 6 | 5 |   | 4 | 3 | 2 | 1 |\n'),
        N1=8,
        N2=4
    ),
    write('---|---|---|---|---|   |---|---|---|---|\n'),
    printBoards(TopLeft,TopRight,Player,N1),
    nl,
    write('   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+\n'),
    nl,
    write('---|---------------|   |---------------|\n'),
    printBoards(BottomLeft,BottomRight,Player,N2),
    (Player==black ->
        write('   |     black     |   |     white     |\n\n')
    ;
        (Player==white ->
            write('   |     white     |   |     black     |\n\n')
        )
    ).
display_game([]).

invertBoard(Board,NewBoard):-
    invertBoard(Board,[],NewBoard).
invertBoard([],NewBoard,NewBoard).
invertBoard([Head|Tail],NewTail,NewBoard):-
    is_list(Head),!,
    invertBoard(Head,NewHead),
    invertBoard(Tail,[NewHead|NewTail],NewBoard).
invertBoard([Head|Tail],NewTail,NewBoard):-
    invertBoard(Tail,[Head|NewTail],NewBoard).

printBoards([FirstHead|FirstTail],[SecondHead|SecondTail],Player,N):-
    write(' '),
    write(N),
    (Player==black ->
        N1 is N+1;
    Player==white ->
        N1 is N-1
    ),
    write(' | '),
    printLine(FirstHead),
    write('  | '),
    printLine(SecondHead),
    nl,
    (Player==black ->
        ((N==4;N==8) ->
        write('---|---------------|   |---------------|\n');
        write('---|---|---|---|---|   |---|---|---|---|\n')
        );
    Player==white ->
        ((N==1;N==5) ->
        write('---|---------------|   |---------------|\n');
        write('---|---|---|---|---|   |---|---|---|---|\n')
        )
    ),
    printBoards(FirstTail,SecondTail,Player,N1).
printBoards([],[],_,_).

printLine([Head|Tail]):-
    symbol(Head,S),
    write(S),
    write(' | '),
    printLine(Tail).
printLine([]).
