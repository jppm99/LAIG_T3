game_over(Board, Winner):-
    Board = [B1, B2, B3, B4],

    count_pieces(B1, black, B1B),
    count_pieces(B1, white, B1W),

    count_pieces(B2, black, B2B),
    count_pieces(B2, white, B2W),

    count_pieces(B3, black, B3B),
    count_pieces(B3, white, B3W),

    count_pieces(B4, black, B4B),
    count_pieces(B4, white, B4W),


    (B1B == 0 ->
        Winner = white
    ;
        (B1W == 0 ->
            Winner = black
        ;
            (B2B == 0 ->
                Winner = white
            ;
                (B2W == 0 ->
                    Winner = black
                ;
                    (B3B == 0 ->
                        Winner = white
                    ;
                        (B3W == 0 ->
                            Winner = black
                        ;
                            (B4B == 0 ->
                                Winner = white
                            ;
                                (B4W == 0 ->
                                    Winner = black
                                ;
                                    Winner = inProgress
                                )
                            )
                        )
                    )
                )
            )
        )
    ).


value(Board, black, Score):-
    Board=[B1,B2,B3,B4], !,
    count_pieces(B1,white,N1),
    count_pieces(B2,white,N2),
    count_pieces(B3,white,N3),
    count_pieces(B4,white,N4),
    Score is 16-(N1+N2+N3+N4).

value(Board, white, Score) :-
    Board=[B1,B2,B3,B4], !,
    count_pieces(B1,black,N1),
    count_pieces(B2,black,N2),
    count_pieces(B3,black,N3),
    count_pieces(B4,black,N4),
    Score is 16-(N1+N2+N3+N4).

value(_,_,Score) :-
    Score = 0,
    write('\n*** INVALID COLOR ***\n'),
    fail.


count_pieces(Board, Player, Number) :-
    count_pieces(Board, Player, 0, 0, Number).

count_pieces(Board, Player, X, Y, Number) :-
    (Y < 4 ->
        (X < 4 ->
            increment(X, IncX),
            IncY = Y
        ;   
            increment(Y, IncY),
            IncX is 0
        ),
        
        count_pieces(Board, Player, IncX, IncY, IncNumber),

        (X < 4 -> 
            get_pos(Board, X, Y, C),

            (Player == C -> increment(IncNumber, Number); Number = IncNumber)
        ;   
            Number = IncNumber
        )
    ;
        Number = 0
    ).
