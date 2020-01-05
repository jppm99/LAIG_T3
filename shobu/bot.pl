:- use_module(library(random)).

% dumb bot
choose_move(Board, 1, Color, X1, Y1, FX1, FY1, X2, Y2, FX2, FY2) :-
    valid_moves(Board,Color,FirstPiecesList),
    chooseRandomElement(FirstPiecesList,FirstPiece),
    FirstPiece=[TX1,TY1],
    valid_moves(Board,Color,TX1,TY1,FirstMovesList),
    chooseRandomElement(FirstMovesList,FirstMove),
    FirstMove=[TFX1,TFY1],
    valid_moves(Board,Color,TX1,TY1,TFX1,TFY1,SecondPiecesList),

    length(SecondPiecesList, Len2PList),
    (Len2PList > 0 ->
        X1 = TX1,
        Y1 = TY1,
        FX1 = TFX1,
        FY1 = TFY1,
        chooseRandomElement(SecondPiecesList,SecondPiece),
        SecondPiece=[X2,Y2],
        FX2 is X2+(FX1-X1),
        FY2 is Y2+(FY1-Y1)
    ;
        choose_move(Board,1,Color,X1,Y1,FX1,FY1,X2,Y2,FX2,FY2)
    ).
    
% smart af bot (greedy algorithm)
choose_move(Board, 2, Color, IX1, IY1, FFX1, FFY1, IX2, IY2, FFX2, FFY2) :-
    goodMovesList(Board, Color, List),

    length(List, NumGoodMoves),

    (NumGoodMoves > 0 ->
        chooseRandomElement(List, Move),
        Move = [IX1,IY1,FFX1,FFY1,IX2,IY2,FFX2,FFY2]
    ;
        choose_move(Board, 1, Color, IX1, IY1, FFX1, FFY1, IX2, IY2, FFX2, FFY2)
    ).

% shobu's world champ
choose_move(Board, 3, Color, IX1, IY1, FFX1, FFY1, IX2, IY2, FFX2, FFY2) :-
    goodMovesList(Board, Color, GoodList),

    length(GoodList, NumGoodMoves),

    (NumGoodMoves == 0 ->
        choose_move(Board, 1, Color, IX1, IY1, FFX1, FFY1, IX2, IY2, FFX2, FFY2)
    ;
        (Color == black ->
            Opposition = white
        ;
            Opposition = black
        ),

        findall(
            N
        ,
        (
            decrement(NumGoodMoves, NGMIndex),
            nlist(0, NGMIndex, NL),
            member(N, NL),

            nth0(N, GoodList, Attempt),

            Attempt = [AX1, AY1, AFX1, AFY1, AX2, AY2, AFX2, AFY2],

            move(Board, Color, AX1, AY1, AFX1, AFY1, AX2, AY2, AFX2, AFY2, NewBoard),

            goodMovesList(NewBoard, Opposition, OList),

            length(OList, Length),

            Length == 0
        )
        ,
            GreatIndexsList
        ),

        length(GreatIndexsList, NumGreatMoves),

        (NumGreatMoves > 0 ->
            chooseRandomElement(GreatIndexsList, GreatMoveIndex),
            nth0(GreatMoveIndex, GoodList, Move)
        ;
            chooseRandomElement(GoodList, Move)
        ),
        Move = [IX1,IY1,FFX1,FFY1,IX2,IY2,FFX2,FFY2]
    ).

% returns a list in which every movement throws an opponent's piece of the boards
goodMovesList(Board, Color, List) :-
    value(Board, Color, InitialScore),

    findall(
        [X1,Y1,FX1,FY1,X2,Y2,FX2,FY2]
    ,
    (
        valid_moves(Board,Color,FirstPiecesList),
        length(FirstPiecesList, Len1Ptemp),
        Len1Ptemp > 0,
        decrement(Len1Ptemp, Len1PI),
        nlist(0, Len1PI, ListLen1P),
                
        member(ListLen1PElem, ListLen1P),
        nth0(ListLen1PElem, FirstPiecesList, FirstPiece),
        FirstPiece=[X1,Y1],
                
        valid_moves(Board,Color,X1,Y1,FirstMovesList),
        length(FirstMovesList, Len1Mtemp),
        Len1Mtemp > 0,
        decrement(Len1Mtemp, Len1MI),
        nlist(0, Len1MI, ListLen1M),
                
        member(ListLen1MElem, ListLen1M),
        nth0(ListLen1MElem, FirstMovesList, FirstMove),
        FirstMove=[FX1,FY1],
        
        valid_moves(Board,Color,X1,Y1,FX1,FY1,SecondPiecesList),
        length(SecondPiecesList, Len2Ptemp),
        Len2Ptemp > 0,
        decrement(Len2Ptemp, Len2PI),
        nlist(0, Len2PI, ListLen2P),
                
        member(ListLen2PElem, ListLen2P),
        nth0(ListLen2PElem, SecondPiecesList, SecondPiece),
        SecondPiece=[X2,Y2],
                
        FX2 is X2+(FX1-X1),
        FY2 is Y2+(FY1-Y1),
        
        move(Board, Color, X1, Y1, FX1, FY1, X2, Y2, FX2, FY2, NB),
                
        value(NB, Color, NewScore),
        
        (NewScore > InitialScore)
    )
    ,
        List
    ).
