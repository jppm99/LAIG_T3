startGame(Player1,Player2):-
    initialBoard(Board),
    gameLoop(Board,Player1,Player2).

gameLoop(Board,Player1,Player2):-
    display_game(Board,black),
    write('\n----------------------- PLAYER 1 - BLACK ------------------------\n'),
    playerTurn(Board,Board1,black,Player1),
    game_over(Board1,Winner1),
    (Winner1==black ->
        display_game(Board1,black),
        write('\n               **************'),
        write('\n               * Black won! *\n'),
        write('               **************\n');
        display_game(Board1,white),
        write('\n----------------------- PLAYER 2 - WHITE ------------------------\n'),
        playerTurn(Board1,Board2,white,Player2),
        game_over(Board2,Winner2),
        (Winner2==white ->
            display_game(Board2,black),
            write('\n               **************'),
            write('\n               * White won! *\n'),
            write('               **************\n');
            gameLoop(Board2,Player1,Player2)
        )
    ).

playerTurn(Board,NewBoard,Color,player):-
    valid_moves(Board,Color,FirstPiecesList),
    nl,
    writeList(FirstPiecesList,1),
    length(FirstPiecesList,Length1),
    readInput(1,Length1,FirstPiece),
    nth1(FirstPiece,FirstPiecesList,FirstPieceCoords),
    FirstPieceCoords=[X1,Y1],
    valid_moves(Board,Color,X1,Y1,FirstMovesList),
    length(FirstMovesList,Length2),
    (Length2==0 ->
        write('\nThere are no valid moves for that piece.'),
        write('\nPlease choose another one.\n'),
        playerTurn(Board,NewerBoard,Color,player);
        nl,
        writeList(FirstMovesList,1),
        readInput(2,Length2,FirstMove),
        nth1(FirstMove,FirstMovesList,FirstMoveCoords),
        FirstMoveCoords=[FX1,FY1],
        valid_moves(Board,Color,X1,Y1,FX1,FY1,SecondPiecesList),
        length(SecondPiecesList,Length3),
        (Length3==0 ->
            write('\nThat move makes it impossible to move a second piece.'),
            write('\nPlease try again.\n'),
            playerTurn(Board,NewerBoard,Color,player);
            nl,
            writeList(SecondPiecesList,1),
            readInput(3,Length3,SecondPiece),
            nth1(SecondPiece,SecondPiecesList,SecondPieceCoords),
            SecondPieceCoords=[X2,Y2],
            FX2 is X2+(FX1-X1),
            FY2 is Y2+(FY1-Y1),
            move(Board,Color,X1,Y1,FX1,FY1,X2,Y2,FX2,FY2,NewerBoard)
        )
    ),
    NewBoard=NewerBoard.

playerTurn(Board,NewBoard,Color,computer1):-
    choose_move(Board,1,Color,C1,L1,NewC1,NewL1,C2,L2,NewC2,NewL2),
    write('\nThe computer moved the piece in ['),
    write(C1),
    write(','),
    write(L1),
    write('] to ['),
    write(NewC1),
    write(','),
    write(NewL1),
    write('].\n'),
    write('\nThe computer moved the piece in ['),
    write(C2),
    write(','),
    write(L2),
    write('] to ['),
    write(NewC2),
    write(','),
    write(NewL2),
    write('].\n'),
    move(Board,Color,C1,L1,NewC1,NewL1,C2,L2,NewC2,NewL2,NewerBoard),
    NewBoard=NewerBoard.

playerTurn(Board,NewBoard,Color,computer2):-
    choose_move(Board,2,Color,C1,L1,NewC1,NewL1,C2,L2,NewC2,NewL2),
    write('\nThe computer moved the piece in ['),
    write(C1),
    write(','),
    write(L1),
    write('] to ['),
    write(NewC1),
    write(','),
    write(NewL1),
    write('].\n'),
    write('\nThe computer moved the piece in ['),
    write(C2),
    write(','),
    write(L2),
    write('] to ['),
    write(NewC2),
    write(','),
    write(NewL2),
    write('].\n'),
    move(Board,Color,C1,L1,NewC1,NewL1,C2,L2,NewC2,NewL2,NewerBoard),
    NewBoard=NewerBoard.

playerTurn(Board,NewBoard,Color,computer3):-
    choose_move(Board,3,Color,C1,L1,NewC1,NewL1,C2,L2,NewC2,NewL2),
    write('\nThe computer moved the piece in ['),
    write(C1),
    write(','),
    write(L1),
    write('] to ['),
    write(NewC1),
    write(','),
    write(NewL1),
    write('].\n'),
    write('\nThe computer moved the piece in ['),
    write(C2),
    write(','),
    write(L2),
    write('] to ['),
    write(NewC2),
    write(','),
    write(NewL2),
    write('].\n'),
    move(Board,Color,C1,L1,NewC1,NewL1,C2,L2,NewC2,NewL2,NewerBoard),
    NewBoard=NewerBoard.

readInput(N,Length,Return):-
    (N==1 ->
        write('\n> Choose the first piece you want to move');
    N==2 ->
        write('\n> Choose where you want to move the first piece');
    N==3 ->
        write('\n> Choose the second piece you want to move')
    ),
    write(' [1-'),
    write(Length),
    write(']'),
    read(Input),
    ((\+integer(Input);Input<1;Input>Length) ->
        write('\nChoose a valid option!\n'),
        readInput(N,Length,NewInput),
        Return=NewInput;
        Return=Input
    ).
