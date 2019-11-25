:- consult('menu.pl').
:- consult('display.pl').
:- consult('utils.pl').
:- consult('logic.pl').
:- consult('game_state.pl').
:- consult('movement.pl').
:- consult('bot.pl').
:- use_module(library(lists)).
:- use_module(library(random)).

play:-
    menu.

test:-
    midBoard(X),
    display_game(X, black),
    nlist(1, 3, List),
    nl,write(List),nl.
