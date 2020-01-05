:- consult('movement.pl').
:- consult('utils.pl').
:- consult('bot.pl').
:- consult('game_state.pl').
:- use_module(library(lists)).

inMove(Board, Team, Move1, Move2, Return) :-
    nth0(0, Move1, X1),
    nth0(0, Move2, X2),

    nth0(1, Move1, Y1),
    nth0(1, Move2, Y2),

    nth0(2, Move1, XF1),
    nth0(2, Move2, XF2),

    nth0(3, Move1, YF1),
    nth0(3, Move2, YF2),

    is_valid(Board, Team, X1, Y1, XF1, YF1, X2, Y2, XF2, YF2, Valid),

    (Valid == 'success' ->
        move(Board, Team, X1, Y1, XF1, YF1, X2, Y2, XF2, YF2, NB),
        outMove(Board, NB, Return)
    ;
        Return = []
    ).

inState(Board, Out) :-
    game_over(Board, Out).

/* computer is 1, 2 or 3 */
inComputer(Board, Team, Computer, Out) :-
    choose_move(Board, Computer, Team, X1, Y1, XF1, YF1, X2, Y2, XF2, YF2),
    move(Board, Team, X1, Y1, XF1, YF1, X2, Y2, XF2, YF2, NB),
    outMove(Board, NB, Out).

outMove(InitialBoard, FinalBoard, Moves) :-
    compare_board(InitialBoard, FinalBoard, 0, L1),
    compare_board(InitialBoard, FinalBoard, 1, L2),
    compare_board(InitialBoard, FinalBoard, 2, L3),
    compare_board(InitialBoard, FinalBoard, 3, L4),

    append(L1, L2, Temp1),
    append(Temp1, L3, Temp2),
    append(Temp2, L4, Moves).

compare_board(InitialBoard, FinalBoard, Number, Moves) :-
    board(InitialBoard, Number, B1),
    board(FinalBoard, Number, B2),

    nlist(0, 3, NL),

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

        get_pos(B1, X1Temp, Y1Temp, Content),

        Content \== empty,

        member(N2, NL2),

        nth0(N2, Diff, Coord2),
        Coord2 = [X2Temp2,Y2Temp2],

        get_pos(B2, X2Temp2, Y2Temp2, Content2),

        ( Content == Content2->
            X2Temp = X2Temp2, Y2Temp = Y2Temp2,!
            ;
            X2Temp = -10, Y2Temp = -10
        ),

        RightSide is mod(Number, 2),
        ( RightSide == 1 ->
            X1 is X1Temp + 1 + 4,
            X2 is X2Temp + 1 + 4
        ;
            X1 is X1Temp + 1,
            X2 is X2Temp + 1

        ),

        ( Number > 1 ->
            Y1 is Y1Temp + 1 + 4,
            Y2 is Y2Temp + 1 + 4
        ;
            Y1 is Y1Temp + 1,
            Y2 is Y2Temp + 1
        )

    )
    ,
        ML
    ),
    sort(ML, Moves).

compare_board(_, _, _, []).

inValidMoves(_Board, _Pos, _Return).
    /* TODO */
