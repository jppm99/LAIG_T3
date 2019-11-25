% assumes the movement is valid
% gamespace coords -> start at 1    
move(Board, Player, X1, Y1, FX1, FY1, X2, Y2, FX2, FY2, NewBoard) :-
    ( (nonvar(Board), nonvar(Player), nonvar(X1), nonvar(Y1), nonvar(FX1), nonvar(FY1), nonvar(X2), nonvar(Y2), nonvar(FX2), nonvar(FY2)) ->

        B1N is div(X1-1, 4) + (2 * div(Y1-1, 4)),
        B2N is div(X2-1, 4) + (2 * div(Y2-1, 4)),


        T1X is mod(X1-1, 4),
        T1Y is mod(Y1-1, 4),
        T2X is mod(X2-1, 4),
        T2Y is mod(Y2-1, 4),

        T1XF is mod(FX1-1, 4),
        T1YF is mod(FY1-1, 4),
        T2XF is mod(FX2-1, 4),
        T2YF is mod(FY2-1, 4),
        
        move_piece(Board, B1N, T1X, T1Y, T1XF, T1YF, Player, NB),

        get_move_type_and_length(T2X, T2Y, T2XF, T2YF, Type, Length),
        nth0(B2N, Board, B2),
        test_move(B2, Player, T2X, T2Y, Type, Length, N_pieces, _),

        ( N_pieces == 1 ->
            (Player == black ->
                Opposition = white
            ;
                Opposition = black
            ),

            updateLen(Type, T2XF, T2YF, Length, DX, DY, _,_),
            replace_elem(NB, B2N, DX, DY, Opposition, NB2),

            (Length == 2 ->
                updateLen(Type, T2X, T2Y, Length, Xempty, Yempty, _,_),
                replace_elem(NB2, B2N, Xempty, Yempty, empty, NB3)
            ;
                NB3 = NB2
            )
        ;
            NB3 = NB
        ),

        move_piece(NB3, B2N, T2X, T2Y, T2XF, T2YF, Player, NewBoard)
    ;
        NewBoard = Board
    ).


% index coords -> start at 0
move_piece(Board, N, Xi, Yi, Xf, Yf, Elem, NewBoard) :-
    board(Board, N, B),

    nth0(Yi, B, Line),
    list_replace_item(Line, Xi, empty, NewLine),
    list_replace_item(B, Yi, NewLine, NB),
    
    nth0(Yf, NB, Line2),
    list_replace_item(Line2, Xf, Elem, NewLine2),
    list_replace_item(NB, Yf, NewLine2, NB2),

    list_replace_item(Board, N, NB2, NewBoard).

% gets gamespace coords of avaiable pieces to do the first move
valid_moves(Board, Player, ListOfMoves):-
    findall( [X1,Y1], ( NL = [1,2,3,4,5,6,7,8], member(X1,NL), member(Y1,NL), member(FX1,NL), member(FY1,NL), valid_first_move(Board, Player, X1, Y1, FX1, FY1, _,_,success) ), List),
    sort(List, ListOfMoves).
% gets gamespace coords of destinatios for the first piece moved
valid_moves(Board, Player, Xi, Yi, ListOfMoves):-
    findall( [FX1,FY1], ( NL = [1,2,3,4,5,6,7,8], member(FX1,NL), member(FY1,NL), valid_first_move(Board, Player, Xi, Yi, FX1, FY1, _,_,success) ), ListOfMoves).
% gets gamespace coords of avaiable pieces to do the second move
valid_moves(Board, Player, X1, Y1, XF1, YF1, ListOfMoves):-
    get_move_type_and_length_gamespace(X1, Y1, XF1, YF1, Type, Len),
    XB1 is div(X1-1, 4),
    findall( [X2,Y2], ( NL = [1,2,3,4,5,6,7,8], member(X2,NL), member(Y2,NL), member(FX2,NL), member(FY2,NL), (XB2 is div(X2-1, 4)), (XB1 \= XB2), valid_second_move(Board, Player, X2, Y2, FX2, FY2, Type, Len, success) ), List),
    sort(List, ListOfMoves).


% replaces element at X,Y in board N with Elem returning NewBoard
replace_elem(Board, N, X, Y, Elem, NewBoard) :-
    ( (nonvar(X), nonvar(Y), nonvar(N), nonvar(Elem)) ->
        ( (X<0 ; Y<0 ; X>3 ; Y>3) ->
            NewBoard = Board
        ;
            board(Board, N, B),

            nth0(Y, B, Line),
            list_replace_item(Line, X, Elem, NewLine),
            list_replace_item(B, Y, NewLine, NB),

            list_replace_item(Board, N, NB, NewBoard)
        )
    ;
        fail
    ).


% Valid is fail or success
is_valid(Board,Player,Move,Valid):-
    Move=[X1, Y1, FX1, FY1, X2, Y2, FX2, FY2],
    is_valid(Board, Player, X1, Y1, FX1, FY1, X2, Y2, FX2, FY2, NewValid),
    Valid=NewValid.

% Valid is fail or success
is_valid(Board, Player, X1, Y1, FX1, FY1, X2, Y2, FX2, FY2, Valid) :-
    
    valid_first_move(Board, Player, X1, Y1, FX1, FY1, Type1, Len1, Valid1),
    valid_second_move(Board, Player,  X2, Y2, FX2, FY2, Type2, Len2, Valid2),

    BX1 is div(X1-1,4),
    BX2 is div(X2-1,4),

    ( (Valid1 \= 'success' ; Valid2 \= 'success' ; Type1 \= Type2 ; Len1 \= Len2 ; BX1 == BX2) ->
        Valid = 'fail'
    ;
        Valid = 'success'
    ).

% checks if the move has the conditions to be valid (additional checking required)
valid_first_move(Board, Player, X1, Y1, FX1, FY1, Type, Length, Valid) :-
    B1N is div(X1-1, 4) + (2 * div(Y1-1, 4)),
    B1FN is div(FX1-1, 4) + (2 * div(FY1-1, 4)),

    nth0(B1N, Board, B1),

    T1X is mod(X1-1, 4),
    T1Y is mod(Y1-1, 4),
    T1XF is mod(FX1-1, 4),
    T1YF is mod(FY1-1, 4),

    get_pos(B1, T1X, T1Y, P1),
    get_move_type_and_length(T1X, T1Y, T1XF, T1YF, Type, Length),

    ((P1 \= Player ; (T1X < 0 ; T1XF < 0; T1Y < 0 ; T1YF < 0) ; (T1X > 3 ; T1XF > 3 ; T1Y > 3 ; T1YF > 3) ; B1N \= B1FN ; (Player == black , (B1N == 0 ; B1N == 1)) ; (Player == white , (B1N == 2 ; B1N == 3)) ; Type == 'error' ; Length > 2 ; Length < 1) -> 
        Valid = 'fail'
    ;
        test_move(B1, Player, T1X, T1Y, Type, Length, N1, _),
        (N1 == 0 ->
            Valid = 'success'
        ;
            Valid = 'fail'
        )
    ).

% checks if the move has the conditions to be valid (additional checking can be required)
valid_second_move(Board, Player, X2, Y2, FX2, FY2, Type, Length, Valid) :-
    B2N is div(X2-1, 4) + (2 * div(Y2-1, 4)),
    B2FN is div(FX2-1, 4) + (2 * div(FY2-1, 4)),

    nth0(B2N, Board, B2),

    T2X is mod(X2-1, 4),
    T2Y is mod(Y2-1, 4),
    T2XF is mod(FX2-1, 4),
    T2YF is mod(FY2-1, 4),

    get_pos(B2, T2X, T2Y, P2),
    get_move_type_and_length(T2X, T2Y, T2XF, T2YF, Type, Length),


    ((P2 \= Player ; (T2X < 0 ; T2XF < 0; T2Y < 0 ; T2YF < 0) ; (T2X > 3 ; T2XF > 3 ; T2Y > 3 ; T2YF > 3) ; B2N \= B2FN ; Type == 'error' ; Length > 2) -> 
        Valid = 'fail'
    ;
        test_move(B2, Player, T2X, T2Y, Type, Length, N2, Dragable),
        (N2 > 1 ->
            Valid = 'fail'
        ;
            (N2 == 0 ->
                Valid = 'success'
            ;
                (Dragable == 1 ->
                    Valid = 'success'
                ;
                    Valid = 'fail'
                )
            )
        )
    ).


% conta o numero de pecas da equipa contraria na direcao Type e com Len, a comecar em X,Y sem contar com a posicao da 1a chamada
% Can drag tem valor de 1 caso seja possivel arrastar uma peca no caminho proposto (nao tem nenhuma peca na casa seguinte a ultima)
% caso encontre uma peca da mesma equipa o valor retornado e maior de 10
test_move(Board, Player, X, Y, Type, Length, N_pieces, Can_drag) :-
    ( Length >= 0 ->
        updateLen(Type, X, Y, Length, NextX, NextY, NextLen, Erro),
        (Erro == 1 ->
            N_pieces = 10
        ;
            (Length > 0 ->
                test_move(Board, Player, NextX, NextY, Type, NextLen, N, Can_drag),
                get_pos(Board, NextX, NextY, C),
                (C == empty ->
                    N_pieces = N
                ;
                    (C == Player ->
                        N_pieces = 10
                    ;
                        N_pieces is N + 1
                    )
                )
            ;
                ( (NextX > 3 ; NextY > 3 ; NextX < 0 ; NextY < 0) ->
                    Can_drag = 1 
                ;
                    get_pos(Board, NextX, NextY, C),
                    (C == empty ->
                        Can_drag = 1
                    ;
                        Can_drag = 0
                    )
                ),
                N_pieces = 0
            )
        )
    ).

% gives next position for a move with a certain direction at X,Y and decrements Len
updateLen('xaxis+', X, Y, Len, NextX, NextY, NextLen, Erro) :-
    !,
    NextX is X + 1,
    NextY = Y,
    NextLen is Len - 1,
    Erro = 0.
updateLen('xaxis-', X, Y, Len, NextX, NextY, NextLen, Erro) :-
    !,
    NextX is X - 1,
    NextY = Y,
    NextLen is Len - 1,
    Erro = 0.
updateLen('yaxis+', X, Y, Len, NextX, NextY, NextLen, Erro) :-
    !,
    NextY is Y + 1,
    NextX = X,
    NextLen is Len - 1,
    Erro = 0.
updateLen('yaxis-', X, Y, Len, NextX, NextY, NextLen, Erro) :-
    !,
    NextY is Y - 1,
    NextX = X,
    NextLen is Len - 1,
    Erro = 0.
updateLen('diagonal++', X, Y, Len, NextX, NextY, NextLen, Erro) :-
    !,
    NextX is X + 1,
    NextY is Y + 1,
    NextLen is Len - 1,
    Erro = 0.
updateLen('diagonal+-', X, Y, Len, NextX, NextY, NextLen, Erro) :-
    !,
    NextX is X + 1,
    NextY is Y - 1,
    NextLen is Len - 1,
    Erro = 0.
updateLen('diagonal-+', X, Y, Len, NextX, NextY, NextLen, Erro) :-
    !,
    NextX is X - 1,
    NextY is Y + 1,
    NextLen is Len - 1,
    Erro = 0.
updateLen('diagonal--', X, Y, Len, NextX, NextY, NextLen, Erro) :-
    !,
    NextX is X - 1,
    NextY is Y - 1,
    NextLen is Len - 1,
    Erro = 0.
updateLen(_,_,_,_,_,_,_,Erro) :-
    Erro = 1.

% X and Y coords start at 0 -> index
get_move_type_and_length(X1, Y1, X2, Y2, Type, Length) :-

    Bi is div(X1, 4) + (2 * div(Y1, 4)),
    Bf is div(X2, 4) + (2 * div(Y2, 4)),

    ( Bi \= Bf ->
        Type = 'error',
        Len = 0
    ;
        LX is X2 - X1,
        LY is Y2 - Y1,

        AbsLx is abs(LX),
        AbsLy is abs(LY),

        LXsign is sign(LX),
        LYsign is sign(LY),

        (AbsLx == AbsLy ->
            (LX \= 0 -> 
                (LYsign == 1 ->
                    (LXsign == 1 ->
                        Type = 'diagonal++'
                    ;
                        Type = 'diagonal-+'
                    )
                ;
                    (LXsign == 1 ->
                        Type = 'diagonal+-'
                    ;
                        Type = 'diagonal--'
                    )
                )
            ;
                Type = error
            ),
            Len = LX
        ;
            (LX == 0 ->
                (LYsign == 1 ->
                    Type = 'yaxis+'
                ;
                    Type = 'yaxis-'
                ),
                Len = LY
            ;
                (LY == 0 ->
                    (LXsign == 1 ->
                        Type = 'xaxis+'
                    ;
                        Type = 'xaxis-'
                    ),
                    Len = LX
                ;
                    Type = 'error',
                    Len = 0
                )
            )
        )
    ),
    Length is abs(Len).    

% X and Y coords start at 1 -> gamespace
get_move_type_and_length_gamespace(X1, Y1, X2, Y2, Type, Length) :-
    T1X is mod(X1-1, 4),
    T1Y is mod(Y1-1, 4),
    T1XF is mod(X2-1, 4),
    T1YF is mod(Y2-1, 4),
    get_move_type_and_length(T1X, T1Y, T1XF, T1YF, Type, Length).
