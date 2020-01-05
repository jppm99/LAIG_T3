:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

:- consult('movementLAIG.pl').

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

parse_input(move(T1L11,T1L12,T1L13,T1L14,T1L21,T1L22,T1L23,T1L24,T1L31,T1L32,T1L33,T1L34,T1L41,T1L42,T1L43,T1L44,T2L11,T2L12,T2L13,T2L14,T2L21,T2L22,T2L23,T2L24,T2L31,T2L32,T2L33,T2L34,T2L41,T2L42,T2L43,T2L44,T3L11,T3L12,T3L13,T3L14,T3L21,T3L22,T3L23,T3L24,T3L31,T3L32,T3L33,T3L34,T3L41,T3L42,T3L43,T3L44,T4L11,T4L12,T4L13,T4L14,T4L21,T4L22,T4L23,T4L24,T4L31,T4L32,T4L33,T4L34,T4L41,T4L42,T4L43,T4L44,Team,X1,Y1,X2,Y2,X3,Y3,X4,Y4), Out) :-
	Board = [ [ [T1L11,T1L12,T1L13,T1L14], [T1L21,T1L22,T1L23,T1L24], [T1L31,T1L32,T1L33,T1L34], [T1L41,T1L42,T1L43,T1L44] ], [ [T2L11,T2L12,T2L13,T2L14], [T2L21,T2L22,T2L23,T2L24], [T2L31,T2L32,T2L33,T2L34], [T2L41,T2L42,T2L43,T2L44] ], [ [T3L11,T3L12,T3L13,T3L14], [T3L21,T3L22,T3L23,T3L24], [T3L31,T3L32,T3L33,T3L34], [T3L41,T3L42,T3L43,T3L44] ], [ [T4L11,T4L12,T4L13,T4L14], [T4L21,T4L22,T4L23,T4L24], [T4L31,T4L32,T4L33,T4L34], [T4L41,T4L42,T4L43,T4L44] ]],
	Move1 = [X1, Y1, X2, Y2],
	Move2 = [X3, Y3, X4, Y4],
	inMove(Board, Team, Move1, Move2, Out).

parse_input(computer_move(T1L11,T1L12,T1L13,T1L14,T1L21,T1L22,T1L23,T1L24,T1L31,T1L32,T1L33,T1L34,T1L41,T1L42,T1L43,T1L44,T2L11,T2L12,T2L13,T2L14,T2L21,T2L22,T2L23,T2L24,T2L31,T2L32,T2L33,T2L34,T2L41,T2L42,T2L43,T2L44,T3L11,T3L12,T3L13,T3L14,T3L21,T3L22,T3L23,T3L24,T3L31,T3L32,T3L33,T3L34,T3L41,T3L42,T3L43,T3L44,T4L11,T4L12,T4L13,T4L14,T4L21,T4L22,T4L23,T4L24,T4L31,T4L32,T4L33,T4L34,T4L41,T4L42,T4L43,T4L44,Team,Computer), Out) :-
	Board = [ [ [T1L11,T1L12,T1L13,T1L14], [T1L21,T1L22,T1L23,T1L24], [T1L31,T1L32,T1L33,T1L34], [T1L41,T1L42,T1L43,T1L44] ], [ [T2L11,T2L12,T2L13,T2L14], [T2L21,T2L22,T2L23,T2L24], [T2L31,T2L32,T2L33,T2L34], [T2L41,T2L42,T2L43,T2L44] ], [ [T3L11,T3L12,T3L13,T3L14], [T3L21,T3L22,T3L23,T3L24], [T3L31,T3L32,T3L33,T3L34], [T3L41,T3L42,T3L43,T3L44] ], [ [T4L11,T4L12,T4L13,T4L14], [T4L21,T4L22,T4L23,T4L24], [T4L31,T4L32,T4L33,T4L34], [T4L41,T4L42,T4L43,T4L44] ]],
	%write('read board in computer move\n'),
	inComputer(Board, Team, Computer, Out).

parse_input(state(T1L11,T1L12,T1L13,T1L14,T1L21,T1L22,T1L23,T1L24,T1L31,T1L32,T1L33,T1L34,T1L41,T1L42,T1L43,T1L44,T2L11,T2L12,T2L13,T2L14,T2L21,T2L22,T2L23,T2L24,T2L31,T2L32,T2L33,T2L34,T2L41,T2L42,T2L43,T2L44,T3L11,T3L12,T3L13,T3L14,T3L21,T3L22,T3L23,T3L24,T3L31,T3L32,T3L33,T3L34,T3L41,T3L42,T3L43,T3L44,T4L11,T4L12,T4L13,T4L14,T4L21,T4L22,T4L23,T4L24,T4L31,T4L32,T4L33,T4L34,T4L41,T4L42,T4L43,T4L44), Out) :-
	Board = [ [ [T1L11,T1L12,T1L13,T1L14], [T1L21,T1L22,T1L23,T1L24], [T1L31,T1L32,T1L33,T1L34], [T1L41,T1L42,T1L43,T1L44] ], [ [T2L11,T2L12,T2L13,T2L14], [T2L21,T2L22,T2L23,T2L24], [T2L31,T2L32,T2L33,T2L34], [T2L41,T2L42,T2L43,T2L44] ], [ [T3L11,T3L12,T3L13,T3L14], [T3L21,T3L22,T3L23,T3L24], [T3L31,T3L32,T3L33,T3L34], [T3L41,T3L42,T3L43,T3L44] ], [ [T4L11,T4L12,T4L13,T4L14], [T4L21,T4L22,T4L23,T4L24], [T4L31,T4L32,T4L33,T4L34], [T4L41,T4L42,T4L43,T4L44] ]],
	%write('received board '),write(Board),nl,
	inState(Board, Out).

/*parse_input(valid_moves(BoardRaw,Pos), Out) :-
	raw_to_list(BoardRaw, Board),
	inValidMoves(Board, Pos, Out).*/

raw_to_list(T1L11-T1L12-T1L13-T1L14-T1L21-T1L22-T1L23-T1L24-T1L31-T1L32-T1L33-T1L34-T1L41-T1L42-T1L43-T1L44-T2L11-T2L12-T2L13-T2L14-T2L21-T2L22-T2L23-T2L24-T2L31-T2L32-T2L33-T2L34-T2L41-T2L42-T2L43-T2L44-T3L11-T3L12-T3L13-T3L14-T3L21-T3L22-T3L23-T3L24-T3L31-T3L32-T3L33-T3L34-T3L41-T3L42-T3L43-T3L44-T4L11-T4L12-T4L13-T4L14-T4L21-T4L22-T4L23-T4L24-T4L31-T4L32-T4L33-T4L34-T4L41-T4L42-T4L43-T4L44, List) :-
	ListTemp = [ [ [T1L11,T1L12,T1L13,T1L14], [T1L21,T1L22,T1L23,T1L24], [T1L31,T1L32,T1L33,T1L34], [T1L41,T1L42,T1L43,T1L44] ], [ [T2L11,T2L12,T2L13,T2L14], [T2L21,T2L22,T2L23,T2L24], [T2L31,T2L32,T2L33,T2L34], [T2L41,T2L42,T2L43,T2L44] ], [ [T3L11,T3L12,T3L13,T3L14], [T3L21,T3L22,T3L23,T3L24], [T3L31,T3L32,T3L33,T3L34], [T3L41,T3L42,T3L43,T3L44] ], [ [T4L11,T4L12,T4L13,T4L14], [T4L21,T4L22,T4L23,T4L24], [T4L31,T4L32,T4L33,T4L34], [T4L41,T4L42,T4L43,T4L44] ]],
	write('ListTemp is: '), write(ListTemp), nl
	,List = ListTemp
	.

	