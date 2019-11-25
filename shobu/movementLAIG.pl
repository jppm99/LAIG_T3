:- consult('movement.pl').
:- consult('utils.pl').
:- use_module(library(lists)).

in(Board, Move1, Move2, Return) :-
    nth0(0, Move1, X1),
    nth0(0, Move2, X2),

    nth0(1, Move1, Y1),
    nth0(1, Move2, Y2),

    nth0(2, Move1, XF1),
    nth0(2, Move2, XF2),

    nth0(3, Move1, YF1),
    nth0(3, Move2, YF2),

    get_board(Board, X1, Y1, SB),
    get_pos(SB, X1, Y1, Team),

    move(Board, Team, X1, Y1, XF1, YF1, X2, Y2, XF2, YF2, NB),

    out(Board, NB, Return).

out(InitialBoard, FinalBoard, Moves) :-
    compare_board(InitialBoard, FinalBoard, 0, L1),
    compare_board(InitialBoard, FinalBoard, 1, L2),
    compare_board(InitialBoard, FinalBoard, 2, L3),
    compare_board(InitialBoard, FinalBoard, 3, L4),

    append(L1, L2, Temp1),
    append(Temp1, L3, Temp2),
    append(Temp22, L4, Moves).

compare_board(InitialBoard, InitialBoard, Number, Moves) :-
    board(InitialBoard, Number, B1),
    board(FinalBoard, Number, B2),

    NL = [0, 1, 2, 3],

    findall(
        [X,Y]
    ,
    (
        member(X, NL),
        member(Y, NL),

        get_pos(B1, X, Y, C1),
        get_pos(B2, X, Y, C2),

        C1 \== C2
    )
    ,
        Diff
    ),

    length(Diff, ND),
    
    ND > 0, !,

    decrement(ND, NDIndex),

    nlist(0, NDIndex, NL2),

    findall(
        [X1, Y1, X2, Y2]
    ,
    (
        member(N1, NL2),

        nth0(N1, Diff, Coord1),
        Coord1 = [X1Temp,Y1Temp],

        get_pos(B1, X1, Y1, Content),

        Content \== empty,

        member(N2, NL2),

        nth0(N2, Diff, Coord2),
        Coord2 = [X2Temp2,Y2Temp2],

        (get_pos(B2, X2Temp2, Y2Temp2, Content) ->
            X2Temp = X2Temp2, Y2Temp = Y2Temp2
            ;
            X2Temp = -10, Y2Temp = -10
        ),

        RightSide is mod(Number, 2),
        ( RightSide =:= 1 ->
            X1 is X1Temp + 4,
            X2 is X2Temp + 4,
        ;
            X1 = X1Temp,
            X2 = X2Temp

        ),

        ( Number > 1 ->
            Y1 is Y1Temp + 4,
            Y2 is Y2Temp + 4,
        ;
            Y1 = Y1Temp,
            Y2 = Y2Temp,
        )
    )
    ,
        ML
    ),
    sort(ML, Moves).

compare_board(B1, B2, []).
