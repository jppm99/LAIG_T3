increment(X, X1) :-
    X1 is X+1.

decrement(X, X1) :-
    X1 is X-1.

% gamespace coords: 1-8
get_board(Board, X, Y, B) :-
    BN is div(X-1, 4) + (2 * div(Y-1, 4)),
    board(Board, BN, B).

get_pos(Board, X, Y, Content) :-
    nth0(Y, Board, Line),
    nth0(X, Line, Content).


board(Board, 0, B) :- Board = [B,_,_,_].
board(Board, 1, B) :- Board = [_,B,_,_].
board(Board, 2, B) :- Board = [_,_,B,_].
board(Board, 3, B) :- Board = [_,_,_,B].


% index coords -> start at 0
list_replace_item(Es, N, X, Xs) :-
   same_length(Es, Xs),
   append(Prefix, [_|Suffix], Es),
   length(Prefix, N),
   append(Prefix, [X|Suffix], Xs).


writeList([H|T],N):-
    write(N),
    write('. '),
    write(H),
    nl,
    N1 is N+1,
    writeList(T,N1).
writeList([],_).

nlist(U, U, List) :-
    !,
    List = [U].
nlist(X, Y, List) :-
    X>Y,!,
    List = [].
nlist(L, U, [L|Ns]) :-
    increment(L, L2),
    nlist(L2, U, Ns).

chooseRandomElement(List,Element):-
    length(List,Length),
    (Length == 0 ->
        write('\n *****  NO VALID MOVES  *****\n'),
        fail
    ;
        random(0,Length,Index),
        nth0(Index,List,Element)
    ).
chooseRandomElement([],Element) :-
    Element = [].
